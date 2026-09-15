"use server";

import { revalidatePath } from "next/cache";
import { addTechniqueGoal, removeTechniqueGoal } from "@/lib/supabase/techniqueGoals";

/**
 * 선수 상세 페이지의 찜(학습 목표) 토글 버튼에서 직접 호출하는 서버 액션.
 * nextIsGoal=true면 추가, false면 제거.
 */
export async function toggleTechniqueGoalAction(
  techniqueRecordId: string,
  athleteRecordId: string | null,
  nextIsGoal: boolean,
): Promise<void> {
  if (nextIsGoal) {
    await addTechniqueGoal(techniqueRecordId, athleteRecordId);
  } else {
    await removeTechniqueGoal(techniqueRecordId);
  }
  revalidatePath("/", "layout");
}
