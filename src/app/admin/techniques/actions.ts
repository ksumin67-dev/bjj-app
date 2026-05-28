"use server";

import { revalidatePath } from "next/cache";
import { deleteCustomTechnique } from "@/lib/airtable/customTechniques";
import {
  createTechnique,
  updateTechnique,
  deleteTechnique,
  type TechniqueInput,
} from "@/lib/airtable/techniques";

export async function actionCreateTechnique(
  input: TechniqueInput,
): Promise<{ ok: true; recordId: string } | { ok: false; error: string }> {
  try {
    const recordId = await createTechnique(input);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true, recordId };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function actionUpdateTechnique(
  recordId: string,
  input: Partial<TechniqueInput>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await updateTechnique(recordId, input);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function actionDeleteTechnique(
  recordId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteTechnique(recordId);
    revalidatePath("/admin/techniques");
    revalidatePath("/tree");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function actionDeleteCustomTechnique(
  recordId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteCustomTechnique(recordId);
    revalidatePath("/admin/techniques");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
