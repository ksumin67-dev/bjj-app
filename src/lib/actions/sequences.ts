"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSequence,
  incrementSuccessCount,
  deleteSequence,
  type CreateSequenceInput,
} from "@/lib/airtable/sequences";

export type CreateSequenceFormState = {
  ok: boolean;
  error?: string;
};

/**
 * Server Action — 새 시퀀스 생성.
 * 폼에서 호출: action={createSequenceAction}
 */
export async function createSequenceAction(
  _prevState: CreateSequenceFormState,
  formData: FormData,
): Promise<CreateSequenceFormState> {
  const seqName = (formData.get("seqName") as string)?.trim();
  if (!seqName) {
    return { ok: false, error: "시퀀스 이름은 필수입니다." };
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
  const tags = formData
    .getAll("tags")
    .map((v) => v.toString())
    .filter(Boolean);

  const input: CreateSequenceInput = {
    seqName,
    startPositionRecordId,
    techniquesUsedRecordIds,
    stepsText,
    hasBranch,
    branchCondition,
    tags,
  };

  let newRecordId: string;
  try {
    newRecordId = await createSequence(input);
  } catch (e) {
    console.error("[createSequenceAction] failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "생성 실패",
    };
  }

  revalidatePath("/sequences");
  redirect(`/sequences/${newRecordId}`);
}

/**
 * Server Action — 성공 카운트 +1.
 */
export async function incrementSuccessAction(recordId: string): Promise<void> {
  await incrementSuccessCount(recordId);
  revalidatePath("/sequences");
  revalidatePath(`/sequences/${recordId}`);
}

/**
 * Server Action — 시퀀스 삭제.
 */
export async function deleteSequenceAction(recordId: string): Promise<void> {
  await deleteSequence(recordId);
  revalidatePath("/sequences");
  redirect("/sequences");
}
