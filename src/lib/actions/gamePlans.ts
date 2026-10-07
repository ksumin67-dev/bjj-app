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
