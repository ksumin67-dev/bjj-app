import type { Technique, Athlete, TechniqueType } from "@/types/domain";
import { GAME_PLAN_TEMPLATES } from "@/lib/gamePlanTemplates";

/**
 * AI 추천 게임플랜 — 규칙 기반 추천 엔진 (2026-10-10)
 *
 * 세 가지 신호를 하나로 합쳐 추천한다 (탭 구분 없음).
 *   1) 내 수련 기록       — 많이 수련한 포지션
 *   2) 좋아요(찜)한 기술   — 배우고 싶은 기술이 속한 포지션
 *   3) 좋아요한 선수 스타일 — 찜한 기술에 연결된 대표 선수(athleteRecordId)
 * 신호가 없으면 기본 큐레이션 템플릿을 보여준다.
 * 기술도감에 실제 있는 기술(recordId)만 조합하므로 존재하지 않는 기술이 나올 수 없다.
 * (2단계에서 LLM이 이름·설명만 다듬는 구조로 확장 예정.)
 */

export type RecommendedPlan = {
  id: string;
  name: string;
  /** 폼의 '설명' 칸에 채워질 문장 */
  note: string;
  /** 순서가 있는 기술 recordId */
  techRecordIds: string[];
  /** 카드에 표시되는 추천 이유 한 줄 */
  reason: string;
  source: "position" | "athlete" | "curated";
};

export type Recommendations = {
  plans: RecommendedPlan[];
  /** true면 내 기록/좋아요 기반, false면 기본 템플릿 */
  personalized: boolean;
};

export type GoalSignal = { techniqueRecordId: string; athleteRecordId: string | null };

// 흐름 단계: 0 = 컨트롤/세팅, 1 = 전환(스윕·패스·이탈 등), 2 = 피니시
const FINISH_TYPES: TechniqueType[] = [
  "서브미션", "혈관초크", "무릎", "발목", "팔꿈치", "어깨",
];
const CONTROL_TYPES: TechniqueType[] = ["컨트롤", "셋업", "리텐션", "디펜스"];

function stageOf(t: Technique): 0 | 1 | 2 {
  if (FINISH_TYPES.includes(t.type)) return 2;
  if (CONTROL_TYPES.includes(t.type)) return 0;
  return 1; // 스윕/패스/이탈/전환/그 외
}

type Ctx = {
  trainingCountMap: Record<string, number>;
  goalIdSet: Set<string>;
};

/** 우선순위: 찜 > 수련 많은 순 > 기술도감 ID 순(기본 기술이 앞) */
function rank(a: Technique, b: Technique, ctx: Ctx): number {
  const ga = ctx.goalIdSet.has(a.recordId) ? 1 : 0;
  const gb = ctx.goalIdSet.has(b.recordId) ? 1 : 0;
  if (ga !== gb) return gb - ga;
  const ca = ctx.trainingCountMap[a.recordId] ?? 0;
  const cb = ctx.trainingCountMap[b.recordId] ?? 0;
  if (ca !== cb) return cb - ca;
  return a.id.localeCompare(b.id, "en", { numeric: true });
}

/** 후보 기술들로 컨트롤 1 → 전환 최대 2 → 피니시 최대 2 체인을 만든다. 3개 미만이면 null. */
function buildChain(candidates: Technique[], ctx: Ctx): Technique[] | null {
  const byStage: Record<0 | 1 | 2, Technique[]> = { 0: [], 1: [], 2: [] };
  for (const t of candidates) byStage[stageOf(t)].push(t);
  for (const s of [0, 1, 2] as const) byStage[s].sort((a, b) => rank(a, b, ctx));

  const chain = [
    ...byStage[0].slice(0, 1),
    ...byStage[1].slice(0, 2),
    ...byStage[2].slice(0, 2),
  ];
  // 단계가 비어 3개가 안 되면 남은 후보로 채움
  if (chain.length < 3) {
    const used = new Set(chain.map((t) => t.recordId));
    const rest = candidates.filter((t) => !used.has(t.recordId)).sort((a, b) => rank(a, b, ctx));
    for (const t of rest) {
      if (chain.length >= 4) break;
      chain.push(t);
    }
  }
  return chain.length >= 3 ? chain : null;
}

/** 포지션 기반 플랜 제목 — 목표형(C안). 포지션 ID로 고정 선택해 같은 추천은 항상 같은 제목 */
const TITLE_TEMPLATES: ((n: string, f: string) => string)[] = [
  (n, f) => `${n} ${f} 셋업`,
  (n, f) => `${f}로 가는 ${n} 플랜`,
  (n, f) => `${n} 피니시 플랜`,
];

function funTitle(posId: string, posName: string, finisher: string): string {
  let h = 0;
  for (const ch of posId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TITLE_TEMPLATES[h % TITLE_TEMPLATES.length](posName, finisher);
}

/** 기본 큐레이션 템플릿을 같은 형태로 변환 */
function curatedPlans(techniques: Technique[]): RecommendedPlan[] {
  return GAME_PLAN_TEMPLATES.flatMap((tpl) => {
    const ids = tpl.techShortIds
      .map((sid) => techniques.find((t) => t.id === sid)?.recordId)
      .filter((id): id is string => Boolean(id));
    if (ids.length < 3) return [];
    return [
      {
        id: `curated-${tpl.id}`,
        name: tpl.name,
        note: tpl.note,
        techRecordIds: ids,
        reason: tpl.summary,
        source: "curated" as const,
      },
    ];
  });
}

/**
 * 통합 추천. 개인화 결과가 하나도 없으면 기본 템플릿만,
 * 있어도 3개 미만이면 기본 템플릿으로 채워 화면이 비어 보이지 않게 한다.
 */
export function recommendGamePlans(args: {
  techniques: Technique[];
  athletes: Athlete[];
  positionNameById: Record<string, string>;
  trainingCountMap: Record<string, number>;
  goals: GoalSignal[];
  limit?: number;
}): Recommendations {
  const { techniques, athletes, positionNameById, trainingCountMap, goals, limit = 4 } = args;
  const ctx: Ctx = {
    trainingCountMap,
    goalIdSet: new Set(goals.map((g) => g.techniqueRecordId)),
  };

  const scored: { plan: RecommendedPlan; score: number }[] = [];

  // ── 1) 포지션 기반: 수련 횟수 합 + 찜한 기술당 5점 ─────────────────────────
  const posScore = new Map<string, number>();
  const posTrained = new Map<string, number>();
  for (const t of techniques) {
    if (!t.parentId) continue;
    const c = trainingCountMap[t.recordId] ?? 0;
    const g = ctx.goalIdSet.has(t.recordId) ? 5 : 0;
    if (c + g > 0) posScore.set(t.parentId, (posScore.get(t.parentId) ?? 0) + c + g);
    if (c > 0) posTrained.set(t.parentId, (posTrained.get(t.parentId) ?? 0) + c);
  }

  for (const [posId, score] of posScore) {
    const candidates = techniques.filter((t) => t.parentId === posId);
    const chain = buildChain(candidates, ctx);
    if (!chain) continue;

    const posName = positionNameById[posId] ?? posId;
    const mid = chain.find((t) => stageOf(t) === 1) ?? chain[1];
    const last = chain[chain.length - 1];
    const finisher = [...chain].reverse().find((t) => stageOf(t) === 2) ?? last;
    const goalIn = chain.filter((t) => ctx.goalIdSet.has(t.recordId));
    const untrained = chain.filter((t) => (trainingCountMap[t.recordId] ?? 0) === 0);
    const reps = posTrained.get(posId) ?? 0;

    const reasons: string[] = [];
    if (reps > 0) reasons.push(`${posName} 기술을 ${reps}번 수련했어요`);
    if (goalIn.length > 0) reasons.push(`배우고 싶은 '${goalIn[0].nameKo}' 포함`);
    else if (untrained.length > 0) reasons.push(`안 해본 기술 ${untrained.length}개로 확장`);

    scored.push({
      score,
      plan: {
        id: `position-${posId}`,
        name: funTitle(posId, posName, finisher.nameKo),
        note: `${posName}에서 ${mid.nameKo}(으)로 시작해 ${last.nameKo}까지 이어가는 흐름이에요.`,
        techRecordIds: chain.map((t) => t.recordId),
        reason: reasons.join(" · ") || `${posName} 중심으로 구성했어요`,
        source: "position",
      },
    });
  }

  // ── 2) 선수 스타일 기반: 좋아요한 기술의 대표 선수 + 시그니처 기술 수련량 ──
  const athleteLikes = new Map<string, number>();
  for (const g of goals) {
    if (g.athleteRecordId) {
      athleteLikes.set(g.athleteRecordId, (athleteLikes.get(g.athleteRecordId) ?? 0) + 1);
    }
  }

  for (const a of athletes) {
    const signature = techniques.filter((t) => t.athleteRecordIds.includes(a.recordId));
    const trained = signature.reduce((s, t) => s + (trainingCountMap[t.recordId] ?? 0), 0);
    const likes = athleteLikes.get(a.recordId) ?? 0;
    const score = likes * 5 + trained;
    if (score <= 0) continue;

    const chain = buildChain(signature, ctx);
    if (!chain) continue;

    const reasons: string[] = [];
    if (likes > 0) reasons.push(`좋아요한 ${a.nameKo} 기술 ${likes}개`);
    if (trained > 0) reasons.push(`시그니처 기술을 ${trained}번 수련했어요`);
    const tags = a.styleTags.slice(0, 2).join(" · ");
    if (reasons.length === 0 && tags) reasons.push(tags);

    scored.push({
      score,
      plan: {
        id: `athlete-${a.recordId}`,
        name: `${a.nameKo} 스타일`,
        note: `${a.nameKo}의 시그니처 기술로 구성한 조합이에요.${a.signatureSystem ? ` (${a.signatureSystem})` : ""}`,
        techRecordIds: chain.map((t) => t.recordId),
        reason: reasons.join(" · "),
        source: "athlete",
      },
    });
  }

  const personal = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.plan);

  const curated = curatedPlans(techniques);
  if (personal.length === 0) return { plans: curated, personalized: false };

  // 개인화 결과가 3개 미만이면 기본 템플릿으로 채움
  const plans = [...personal];
  for (const c of curated) {
    if (plans.length >= 3) break;
    plans.push(c);
  }
  return { plans, personalized: true };
}
