import "server-only";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getMyTechniqueGoals } from "@/lib/supabase/techniqueGoals";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { buildTrainingCountMap, type Technique } from "@/types/domain";
import { recommendGamePlans, type Recommendations } from "@/lib/gamePlanRecommend";

/**
 * 게임플랜 작성/수정 폼에 필요한 데이터 한 번에 준비 (2026-09-20).
 * 새 게임플랜과 수정 페이지에서 공통 사용.
 */
export async function getGamePlanFormData(opts: { withRecommendations?: boolean } = {}) {
  const [positions, techniques, sessions, goals, athletes] = await Promise.all([
    getAllPositions(),
    getAllTechniques(),
    getAllTrainingSessions(),
    getMyTechniqueGoals(),
    // 추천은 새 게임플랜 화면에서만 필요 — 수정 화면에서는 Airtable 호출 생략
    opts.withRecommendations ? getAllAthletes().catch(() => []) : Promise.resolve([]),
  ]);

  // 포지션(부모) 레코드는 게임플랜 단계로 직접 선택하지 않음 — 구체적 자식 기술만 선택 대상
  const stepTechniques: Technique[] = techniques.filter((t) => t.id.includes("-"));

  // 포지션 짧은 ID → 한글 이름 (기술 선택창 그룹 제목)
  const positionNameById: Record<string, string> = {};
  for (const p of positions) positionNameById[p.id] = p.nameKo;

  const goalTechniqueIds = goals.map((g) => g.techniqueRecordId);

  // 최근 수련한 기술 — 최신 세션부터 중복 없이 수집
  const recentTechniqueIds: string[] = [];
  const seen = new Set<string>();
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  for (const s of sorted) {
    for (const id of s.techniqueRecordIds) {
      if (!seen.has(id)) {
        seen.add(id);
        recentTechniqueIds.push(id);
      }
    }
    if (recentTechniqueIds.length >= 16) break;
  }

  // AI 추천 게임플랜 (2026-10-10) — 수련 기록 + 좋아요한 기술/선수 통합, 신호 없으면 기본 템플릿
  let recommendations: Recommendations = { plans: [], personalized: false };
  if (opts.withRecommendations) {
    recommendations = recommendGamePlans({
      techniques: stepTechniques,
      athletes,
      positionNameById,
      trainingCountMap: buildTrainingCountMap(sessions),
      goals: goals.map((g) => ({
        techniqueRecordId: g.techniqueRecordId,
        athleteRecordId: g.athleteRecordId,
      })),
    });
  }

  return {
    stepTechniques,
    positionNameById,
    goalTechniqueIds,
    recentTechniqueIds,
    recommendations,
  };
}
