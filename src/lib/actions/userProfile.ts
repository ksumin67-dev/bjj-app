"use server";

import { revalidatePath } from "next/cache";
import { updateUserProfile, completeOnboarding, updateReminderHour } from "@/lib/supabase/userProfile";
import type { BeltLevel, StyleTag } from "@/types/domain";

export async function updateProfileAction(
  belt: BeltLevel,
  stripe: number,
  nickname: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const clampedStripe = belt === "Black Belt"
      ? Math.min(6, Math.max(0, stripe))
      : Math.min(4, Math.max(0, stripe));
    await updateUserProfile(belt, clampedStripe, nickname.trim() || "아쿠아");
    // 홈은 force-dynamic이라 revalidatePath 불필요 (오히려 SSR 컨텍스트 오류 유발)
    revalidatePath("/profile");
    return { ok: true };
  } catch (e) {
    console.error("[updateProfileAction] 실패:", e);
    return { ok: false, error: "저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
}

export async function completeOnboardingAction(input: {
  belt: BeltLevel;
  stripe: number;
  weeklyGoal: number | null;
  reminderHour: number | null;
  preferredStyleTag: StyleTag | null;
  favoriteAthleteIds?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await completeOnboarding(input);
    return { ok: true };
  } catch (e) {
    console.error("[completeOnboardingAction] 실패:", e);
    return { ok: false, error: "저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
}

export async function updateReminderHourAction(
  hour: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateReminderHour(hour);
    revalidatePath("/profile");
    return { ok: true };
  } catch (e) {
    console.error("[updateReminderHourAction] 실패:", e);
    return { ok: false, error: "저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
}
