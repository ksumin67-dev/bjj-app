import type { Technique, Athlete, TechniqueType } from "@/types/domain";
import { GAME_PLAN_TEMPLATES } from "@/lib/gamePlanTemplates";

/**
 * AI 추천 게임플랜 — 1단계: 규칙 기반 추천 엔진 (2026-10-10)
 *
 * 내 수련 기록·찜한 기술을 바탕으로 "컨트롤 → 전환(스윕/패스) → 피니시" 흐름의
 * 기술 체인을 조립한다. 기록이 없으면 대표 선수 시그니처 기반 추천을 보여준다.
 * 기술도감에 실제로 있는 기술(recordId)만 조합하므로 존재하지 않는 기술이 나올 수 없다.
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
  source: "mine" | "athlete" | "curated";
};

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
  // 단계가 비어 3개가 안 되면 남은 후보로 채움 (최대 5개)
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

/** 내 수련 기반 추천 — 수련·찜 기록이 없으면 빈 배열 */
export function recommendFromMyTraining(args: {
  techniques: Technique[];
  positionNameById: Record<string, string>;
  trainingCountMap: Record<string, number>;
  goalTechniqueIds: string[];
  limit?: number;
}): RecommendedPlan[] {
  const { techniques, positionNameById, trainingCountMap, goalTechniqueIds, limit = 3 } = args;
  const ctx: Ctx = { trainingCountMap, goalIdSet: new Set(goalTechniqueIds) };

  // 포지션별 점수 = 수련 횟수 합 + 찜한 기술당 5점
  const score = new Map<string, number>();
  const trainedInPos = new Map<string, number>();
  for (const t of techniques) {
    if (!t.parentId) continue;
    const c = trainingCountMap[t.recordId] ?? 0;
    const g = ctx.goalIdSet.has(t.recordId) ? 5 : 0;
    if (c + g > 0) score.set(t.parentId, (score.get(t.parentId) ?? 0) + c + g);
    if (c > 0) trainedInPos.set(t.parentId, (trainedInPos.get(t.parentId) ?? 0) + c);
  }

  const topPositions = [...score.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  const results: RecommendedPlan[] = [];

  for (const posId of topPositions) {
    if (results.length >= limit) break;
    const candidates = techniques.filter((t) => t.parentId === posId);
    const chain = buildChain(candidates, ctx);
    if (!chain) continue;

    const posName = positionNameById[posId] ?? posId;
    const first = chain.find((t) => stageOf(t) === 1) ?? chain[1];
    const last = chain[chain.length - 1];
    const goalIn = chain.filter((t) => ctx.goalIdSet.has(t.recordId));
    const untrained = chain.filter((t) => (trainingCountMap[t.recordId] ?? 0) === 0);
    const reps = trainedInPos.get(posId) ?? 0;

    const reasonParts: string[] = [];
    if (reps > 0) reasonParts.push(`${posName} 기술을 ${reps}번 수련했어요`);
    if (goalIn.length > 0) reasonParts.push(`배우고 싶은 '${goalIn[0].nameKo}' 포함`);
    else if (untrained.length > 0) reasonParts.push(`안 해본 기술 ${untrained.length}개로 확장`);

    results.push({
      id: `mine-${posId}`,
      name: `${posName} 연계 플랜`,
      note: `${posName}에서 ${first.nameKo}(으)로 시작해 ${last.nameKo}까지 이어가는 흐름이에요.`,
      techRecordIds: chain.map((t) => t.recordId),
      reason: reasonParts.join(" · ") || `${posName} 중심으로 구성했어요`,
      source: "mine",
    });
  }
  return results;
}

/** 유명 선수 스타일 추천 — 대표 선수의 시그니처 기술로 조합. 선수 순서는 입력 순서 유지 */
export function recommendFromAthletes(args: {
  techniques: Technique[];
  athletes: Athlete[];
  trainingCountMap: Record<string, number>;
  goalTechniqueIds: string[];
  limit?: number;
}): RecommendedPlan[] {
  const { techniques, athletes, trainingCountMap, goalTechniqueIds, limit = 4 } = args;
  const ctx: Ctx = { trainingCountMap, goalIdSet: new Set(goalTechniqueIds) };
  const results: RecommendedPlan[] = [];

  for (const a of athletes) {
    if (results.length >= limit) break;
    const candidates = techniques.filter((t) => t.athleteRecordIds.includes(a.recordId));
    const chain = buildChain(candidates, ctx);
    if (!chain) continue;

    const tags = a.styleTags.slice(0, 2).join(" · ");
    results.push({
      id: `athlete-${a.recordId}`,
      name: `${a.nameKo} 스타일`,
      note: `${a.nameKo}의 시그니처 기술로 구성한 조합이에요.${a.signatureSystem ? ` (${a.signatureSystem})` : ""}`,
      techRecordIds: chain.map((t) => t.recordId),
      reason: tags ? `${tags} · 시그니처 기술 ${chain.length}개` : `시그니처 기술 ${chain.length}개`,
      source: "athlete",
    });
  }
  return results;
}

/** 선수 데이터가 부족할 때의 기본 큐레이션 (기존 템플릿을 같은 형태로 변환) */
export function curatedFallback(techniques: Technique[]): RecommendedPlan[] {
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
