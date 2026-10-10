import type { Technique, Athlete } from "@/types/domain";
import { COMBO_LIBRARY, type Combo } from "@/data/comboLibrary";

/**
 * AI 추천 게임플랜 — 콤보 라이브러리 기반 추천 엔진 (2026-10-10)
 *
 * 기술도감의 기술을 단계별로 임의 조합하면 실전에서 안 쓰는 흐름이 나오므로,
 * 근거가 확인된 콤보(src/data/comboLibrary.ts)만 추천한다. 엔진은 콤보를 새로
 * 만들지 않고 "내게 맞는 콤보를 고르는" 역할만 한다.
 *
 * 개인화 신호 (콤보 점수)
 *   1) 내 수련 기록       — 콤보에 든 기술을 수련한 횟수
 *   2) 좋아요(찜)한 기술   — 콤보에 든 기술당 +5
 *   3) 좋아요한 선수 스타일 — 찜한 기술에 연결된 선수의 시그니처 기술이 콤보에 있으면 +3
 * 신호가 전혀 없으면 근거 등급·기본 순서대로 기본 추천.
 * (2단계: LLM은 이 후보 안에서 고르고 이유를 설명하는 데만 사용 예정.)
 */

export type RecommendedStep = {
  recordId: string;
  role: "main" | "if_blocked" | "then" | "transition";
  trigger?: string;
};

export type RecommendedPlan = {
  id: string;
  name: string;
  /** 폼의 '설명' 칸에 채워질 문장 (상황 + 단계별 트리거) */
  note: string;
  /** 순서가 있는 기술 recordId */
  techRecordIds: string[];
  steps: RecommendedStep[];
  /** 카드에 표시되는 추천 이유 한 줄 */
  reason: string;
  source: "combo";
};

export type Recommendations = {
  plans: RecommendedPlan[];
  /** true면 내 기록/좋아요 기반, false면 기본 추천 */
  personalized: boolean;
};

export type GoalSignal = { techniqueRecordId: string; athleteRecordId: string | null };

const ROLE_LABEL: Record<RecommendedStep["role"], string> = {
  main: "먼저",
  if_blocked: "막히면",
  then: "이어서",
  transition: "이동",
};

export function roleLabel(role: RecommendedStep["role"]): string {
  return ROLE_LABEL[role];
}

function buildNote(combo: Combo, nameOf: (shortId: string) => string): string {
  const lines = [`상황: ${combo.start}`];
  combo.steps.forEach((s, i) => {
    const trig = s.trigger ? ` (${s.trigger})` : "";
    lines.push(`${i + 1}. [${ROLE_LABEL[s.role]}] ${nameOf(s.tech)}${trig}`);
  });
  lines.push(`결과: ${combo.end}`);
  return lines.join("\n");
}

export function recommendGamePlans(args: {
  techniques: Technique[];
  athletes: Athlete[];
  positionNameById: Record<string, string>;
  trainingCountMap: Record<string, number>;
  goals: GoalSignal[];
  limit?: number;
}): Recommendations {
  const { techniques, positionNameById, trainingCountMap, goals, limit = 4 } = args;

  const byShortId = new Map(techniques.map((t) => [t.id, t]));
  const goalIdSet = new Set(goals.map((g) => g.techniqueRecordId));
  const likedAthletes = new Set(goals.map((g) => g.athleteRecordId).filter((x): x is string => Boolean(x)));
  const nameOf = (shortId: string) => byShortId.get(shortId)?.nameKo ?? shortId;

  type Scored = { combo: Combo; score: number; trained: number; goalHits: Technique[]; styleHit: boolean; order: number };
  const scored: Scored[] = [];

  COMBO_LIBRARY.forEach((combo, order) => {
    const techs = combo.steps.map((s) => byShortId.get(s.tech));
    if (techs.some((t) => !t)) return; // 도감에서 사라진 기술이 있으면 콤보 제외
    const list = techs as Technique[];

    const trained = list.reduce((sum, t) => sum + (trainingCountMap[t.recordId] ?? 0), 0);
    const goalHits = list.filter((t) => goalIdSet.has(t.recordId));
    const styleHit = list.some((t) => t.athleteRecordIds.some((a) => likedAthletes.has(a)));
    const score = trained + goalHits.length * 5 + (styleHit ? 3 : 0);
    scored.push({ combo, score, trained, goalHits, styleHit, order });
  });

  const personalizedPool = scored.filter((s) => s.score > 0);
  const personalized = personalizedPool.length > 0;

  const gradeRank = (g: Combo["grade"]) => (g === "검증됨" ? 0 : 1);
  const ranked = (personalized ? personalizedPool : scored).sort((a, b) => {
    if (personalized && a.score !== b.score) return b.score - a.score;
    if (gradeRank(a.combo.grade) !== gradeRank(b.combo.grade)) return gradeRank(a.combo.grade) - gradeRank(b.combo.grade);
    return a.order - b.order;
  });

  // 개인화 결과가 적으면 기본 추천으로 채워 화면이 비어 보이지 않게 한다
  let picked = ranked.slice(0, limit);
  if (!personalized) {
    // 기본 추천은 특정 포지션에 쏠리지 않게 포지션당 하나씩 고른다
    const seenPos = new Set<string>();
    picked = ranked.filter((s) => (seenPos.has(s.combo.position) ? false : (seenPos.add(s.combo.position), true))).slice(0, limit);
  }
  if (personalized && picked.length < 3) {
    const have = new Set(picked.map((p) => p.combo.id));
    const fill = scored
      .filter((s) => !have.has(s.combo.id))
      .sort((a, b) => gradeRank(a.combo.grade) - gradeRank(b.combo.grade) || a.order - b.order);
    for (const f of fill) {
      if (picked.length >= 3) break;
      picked.push(f);
    }
  }

  const plans: RecommendedPlan[] = picked.map((s) => {
    const posName = positionNameById[s.combo.position] ?? "";
    const reasons: string[] = [];
    if (s.trained > 0) reasons.push(`이 콤보의 기술을 ${s.trained}번 수련했어요`);
    if (s.goalHits.length > 0) reasons.push(`배우고 싶은 '${s.goalHits[0].nameKo}' 포함`);
    if (s.styleHit) reasons.push("좋아요한 선수 스타일과 맞아요");
    if (reasons.length === 0) reasons.push(posName ? `${posName}에서 많이 쓰는 기본 연계예요` : "많이 쓰는 기본 연계예요");

    return {
      id: `combo-${s.combo.id}`,
      name: s.combo.name,
      note: buildNote(s.combo, nameOf),
      techRecordIds: s.combo.steps.map((st) => byShortId.get(st.tech)!.recordId),
      steps: s.combo.steps.map((st) => ({
        recordId: byShortId.get(st.tech)!.recordId,
        role: st.role,
        trigger: st.trigger,
      })),
      reason: reasons.join(" · "),
      source: "combo" as const,
    };
  });

  return { plans, personalized };
}
