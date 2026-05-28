"use server";

import { revalidatePath } from "next/cache";
import { toggleMainSkill } from "@/lib/airtable/techniques";

/**
 * 주력 기술 ON/OFF 서버 액션.
 * trainingCount >= 3 조건은 클라이언트에서 검증 후 호출.
 */
export async function toggleMainSkillAction(
  recordId: string,
  value: boolean,
): Promise<void> {
  await toggleMainSkill(recordId, value);
  revalidatePath("/", "layout");
}
