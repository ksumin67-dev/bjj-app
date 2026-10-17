"use server";

import { revalidatePath } from "next/cache";
import {
  deleteCustomTechnique,
  setCustomTechniqueRegistered,
} from "@/lib/airtable/customTechniques";
import {
  createTechnique,
  updateTechnique,
  deleteTechnique,
  type TechniqueInput,
} from "@/lib/airtable/techniques";
import { requireAdmin } from "@/lib/auth/requireAdmin";

/** 내부 오류 문장을 그대로 화면에 노출하지 않는다 (권한 없음만 구분) */
function failure(e: unknown): { ok: false; error: string } {
  if (e instanceof Error && e.message === "FORBIDDEN") return { ok: false, error: "권한이 없습니다." };
  console.error("[admin/techniques]", e);
  return { ok: false, error: "처리하지 못했어요. 잠시 후 다시 시도해주세요." };
}

export async function actionCreateTechnique(
  input: TechniqueInput,
): Promise<{ ok: true; recordId: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const recordId = await createTechnique(input);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true, recordId };
  } catch (e) {
    return failure(e);
  }
}

export async function actionUpdateTechnique(
  recordId: string,
  input: Partial<TechniqueInput>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await updateTechnique(recordId, input);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

export async function actionDeleteTechnique(
  recordId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await deleteTechnique(recordId);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

export async function actionDeleteCustomTechnique(
  recordId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await deleteCustomTechnique(recordId);
    revalidatePath("/admin/techniques");
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}

export async function actionSetCustomTechniqueRegistered(
  recordId: string,
  registered: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await setCustomTechniqueRegistered(recordId, registered);
    revalidatePath("/admin/techniques");
    return { ok: true };
  } catch (e) {
    return failure(e);
  }
}
