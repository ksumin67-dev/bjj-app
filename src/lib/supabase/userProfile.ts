import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { BeltLevel, StyleTag } from "@/types/domain";

/**
 * RevenueCat 구독 상태. free=미구독, trialing=무료체험중, active=구독중, expired=만료.
 * Phase 3/4에서 RevenueCat 웹훅이 갱신 예정. 지금은 DB 기본값(free) 또는 수동 설정.
 */
export type SubscriptionStatus = "free" | "trialing" | "active" | "expired";

export interface UserProfile {
  recordId: string;
  nickname: string;
  belt: BeltLevel;
  stripe: number; // 0~4 (Black Belt: 0~6)
  subscriptionStatus: SubscriptionStatus;
  isPremium: boolean;
  weeklyGoal: number | null;
  reminderHour: number;
  preferredStyleTag: StyleTag | null;
  onboardingCompleted: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  recordId: "",
  nickname: "아쿠아",
  belt: "White Belt",
  stripe: 0,
  subscriptionStatus: "free",
  isPremium: false,
  weeklyGoal: null,
  reminderHour: 20,
  preferredStyleTag: null,
  onboardingCompleted: false,
};

function isPremiumStatus(status: SubscriptionStatus): boolean {
  return status === "trialing" || status === "active";
}

export async function getUserProfile(): Promise<UserProfile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return DEFAULT_PROFILE;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, nickname, belt, stripe, subscription_status, weekly_goal, reminder_hour, preferred_style_tag, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (error || !data) return { ...DEFAULT_PROFILE, recordId: user.id };

    const subscriptionStatus =
      (data.subscription_status as SubscriptionStatus) ?? "free";

    return {
      recordId: data.id,
      nickname: data.nickname ?? "아쿠아",
      belt: (data.belt as BeltLevel) ?? "White Belt",
      stripe: data.stripe ?? 0,
      subscriptionStatus,
      isPremium: isPremiumStatus(subscriptionStatus),
      weeklyGoal: data.weekly_goal ?? null,
      reminderHour: data.reminder_hour ?? 20,
      preferredStyleTag: (data.preferred_style_tag as StyleTag) ?? null,
      onboardingCompleted: data.onboarding_completed ?? false,
    };
  } catch {
    return { ...DEFAULT_PROFILE, recordId: user.id };
  }
}

export async function updateUserProfile(
  belt: BeltLevel,
  stripe: number,
  nickname?: string,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const updates: Record<string, unknown> = {
    belt,
    stripe,
    updated_at: new Date().toISOString(),
  };
  if (nickname !== undefined) updates.nickname = nickname;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) throw error;
}

/** 가입 직후 온보딩(벨트/그랄/주간 목표/리마인더 시간/선호 스타일) 저장 + 완료 처리 */
export async function completeOnboarding(input: {
  belt: BeltLevel;
  stripe: number;
  weeklyGoal: number | null;
  reminderHour: number | null;
  preferredStyleTag: StyleTag | null;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("profiles")
    .update({
      belt: input.belt,
      stripe: input.stripe,
      weekly_goal: input.weeklyGoal,
      reminder_hour: input.reminderHour ?? 20,
      preferred_style_tag: input.preferredStyleTag,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw error;
}

/** 프로필 화면 알림 설정에서 리마인더 시간만 바꿀 때 사용 */
export async function updateReminderHour(hour: number): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("profiles")
    .update({ reminder_hour: hour, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw error;
}
