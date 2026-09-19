"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createGamePlan,
  setGamePlanPrimary,
  deleteGamePlan,
  type CreateGamePlanInput,
} from "@/lib/supabase/gamePlans";

export type CreateGamePlanFormState = {
  ok: boolean;
  error?: string;
};

/**
 * Server Action — 새 게임플랜 생성.
 * 폼에서 호출: action={createGamePlanAction}
 */
export async function createGamePlanAction(
  _prevState: CreateGamePlanFormState,
  formData: FormData,
): Promise<CreateGamePlanFormState> {
  const planName = (formData.get("planName") as string)?.trim();
  if (!planName) {
    return { ok: false, error: "게임플랜 이름은 필수입니다." };
  }

  const startPositionRecordId =
    (formData.get("startPosition") as string) || undefined;
  const stepsText = (formData.get("stepsText") as string) ?? "";
  const hasBranch = formData.get("hasBranch") === "on";
  const branchCondition =
    (formData.get("branchCondition") as string) || undefined;

  // 다중 선택 필드: Form에서 같은 name으로 여러 값
  const techniquesUsedRecordIds = formData
    .getAll("techniques")
    .map((v) => v.toString())
    .filter(Boolean);
  const isPrimary = formData.get("isPrimary") === "on";

  const input: CreateGamePlanInput = {
    planName,
    startPositionRecordId,
    techniquesUsedRecordIds,
    stepsText,
    hasBranch,
    branchCondition,
    isPrimary,
  };

  let newRecordId: string;
  try {
    newRecordId = await createGamePlan(input);
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
