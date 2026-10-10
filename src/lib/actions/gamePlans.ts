"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createGamePlan,
  updateGamePlan,
  setGamePlanPrimary,
  deleteGamePlan,
  type CreateGamePlanInput,
} from "@/lib/supabase/gamePlans";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllPositions } from "@/lib/airtable/positions";
import { getGamePlanFormData } from "@/lib/gamePlanFormData";

export type CreateGamePlanFormState = {
  ok: boolean;
  error?: string;
};

/**
 * 시작 포지션 자동 지정 (2026-09-20) — 폼에서 직접 고르게 하면 코드 목록에서
 * 찾기 어려워서, 첫 번째 기술이 속한 포지션을 시작 포지션으로 저장한다.
 * 목록 카드의 "○○ 시작" 표시와 스트림 구분은 그대로 동작.
 */
async function resolveStartPositionRecordId(
  firstTechniqueRecordId: string | undefined,
): Promise<string | undefined> {
  if (!firstTechniqueRecordId) return undefined;
  try {
    const [techniques, positions] = await Promise.all([
      getAllTechniques(),
      getAllPositions(),
    ]);
    const first = techniques.find((t) => t.recordId === firstTechniqueRecordId);
    if (!first?.parentId) return undefined;
    return positions.find((p) => p.id === first.parentId)?.recordId;
  } catch (e) {
    console.warn("[gamePlans] 시작 포지션 자동 지정 실패:", e);
    return undefined;
  }
}

/** 생성/수정 공통 — FormData → 입력값 변환 */
async function parseGamePlanForm(
  formData: FormData,
): Promise<{ input?: CreateGamePlanInput; error?: string }> {
  const planName = (formData.get("planName") as string)?.trim();
  if (!planName) return { error: "게임플랜 이름은 필수입니다." };

  const stepsText = (formData.get("stepsText") as string) ?? "";
  const hasBranch = formData.get("hasBranch") === "on";
  const branchCondition =
    (formData.get("branchCondition") as string)?.trim() || undefined;

  // 다중 선택 필드: Form에서 같은 name으로 여러 값 (순서 유지)
  const techniquesUsedRecordIds = formData
    .getAll("techniques")
    .map((v) => v.toString())
    .filter(Boolean);
  const isPrimary = formData.get("isPrimary") === "on";

  const startPositionRecordId = await resolveStartPositionRecordId(
    techniquesUsedRecordIds[0],
  );

  return {
    input: {
      planName,
      startPositionRecordId,
      techniquesUsedRecordIds,
      stepsText,
      hasBranch,
      branchCondition: hasBranch ? branchCondition : undefined,
      isPrimary,
    },
  };
}

/**
 * Server Action — 새 게임플랜 생성.
 * 폼에서 호출: action={createGamePlanAction}
 */
export async function createGamePlanAction(
  _prevState: CreateGamePlanFormState,
  formData: FormData,
): Promise<CreateGamePlanFormState> {
  const parsed = await parseGamePlanForm(formData);
  if (!parsed.input) return { ok: false, error: parsed.error };

  let newRecordId: string;
  try {
    newRecordId = await createGamePlan(parsed.input);
  } catch (e) {
    console.error("[createGamePlanAction] failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "생성 실패",
    };
  }

  revalidatePath("/gameplans");
  redirect(`/gameplans/${newRecordId}`);
}

/**
 * Server Action — 게임플랜 수정 (2026-09-20).
 * 대상 ID는 폼의 hidden input "planId"로 전달.
 */
export async function updateGamePlanAction(
  _prevState: CreateGamePlanFormState,
  formData: FormData,
): Promise<CreateGamePlanFormState> {
  const planId = (formData.get("planId") as string)?.trim();
  if (!planId) return { ok: false, error: "수정할 게임플랜을 찾을 수 없습니다." };

  const parsed = await parseGamePlanForm(formData);
  if (!parsed.input) return { ok: false, error: parsed.error };

  try {
    await updateGamePlan(planId, parsed.input);
  } catch (e) {
    console.error("[updateGamePlanAction] failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "수정 실패",
    };
  }

  revalidatePath("/gameplans");
  revalidatePath(`/gameplans/${planId}`);
  redirect(`/gameplans/${planId}`);
}

export type RecommendationView = {
  id: string;
  name: string;
  reason: string;
  /** 순서대로 표시할 기술 이름 */
  techNames: string[];
  source: "position" | "athlete" | "curated";
};

export type RecommendResult =
  | {
      ok: true;
      personalized: boolean;
      plans: RecommendationView[];
      signals: { sessionCount: number; trainedTechniqueCount: number; goalCount: number };
    }
  | { ok: false; error: string };

/**
 * Server Action — "AI로 게임플랜 추천받기" 버튼 (2026-10-10).
 * 버튼을 눌렀을 때만 계산해서 목록 화면 로딩에는 영향이 없다.
 * 2단계에서 LLM 호출이 이 함수 안으로 들어올 예정.
 */
export async function recommendGamePlansAction(): Promise<RecommendResult> {
  try {
    const data = await getGamePlanFormData({ withRecommendations: true });
    const nameById = new Map(data.stepTechniques.map((t) => [t.recordId, t.nameKo]));
    return {
      ok: true,
      personalized: data.recommendations.personalized,
      signals: data.signals,
      plans: data.recommendations.plans.map((p) => ({
        id: p.id,
        name: p.name,
        reason: p.reason,
        source: p.source,
        techNames: p.techRecordIds
          .map((id) => nameById.get(id))
          .filter((n): n is string => Boolean(n)),
      })),
    };
  } catch (e) {
    console.error("[recommendGamePlansAction] failed:", e);
    return { ok: false, error: "추천을 만들지 못했어요. 잠시 후 다시 시도해주세요." };
  }
}

/**
 * Server Action — 주력 기술 표시 토글.
 */
export async function setPrimaryAction(
  recordId: string,
  isPrimary: boolean,
): Promise<void> {
  await setGamePlanPrimary(recordId, isPrimary);
  revalidatePath("/gameplans");
  revalidatePath(`/gameplans/${recordId}`);
}

/**
 * Server Action — 게임플랜 삭제.
 */
export async function deleteGamePlanAction(recordId: string): Promise<void> {
  await deleteGamePlan(recordId);
  revalidatePath("/gameplans");
  redirect("/gameplans");
}
