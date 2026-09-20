"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type DeleteAccountResult = { ok: boolean; error?: string };

/**
 * Server Action — 계정 완전 삭제(회원 탈퇴).
 * auth.users 레코드를 삭제하면 ON DELETE CASCADE로 profiles/
 * training_sessions/game_plans/technique_goals까지 함께 정리됨.
 */
export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
  } catch (e) {
    console.error("[deleteAccountAction] failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "계정 삭제에 실패했습니다.",
    };
  }

  // 삭제된 유저의 세션 쿠키 정리
  await supabase.auth.signOut();

  return { ok: true };
}
