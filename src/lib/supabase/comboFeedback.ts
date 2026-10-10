import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ComboVote = 1 | -1;

/** 로그인 유저의 콤보 피드백 전체 (combo id → 1 | -1). 실패/비로그인이면 빈 Map. */
export async function getMyComboVotes(): Promise<Map<string, ComboVote>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("combo_feedback").select("combo_id, vote");
    if (error) throw error;
    return new Map((data ?? []).map((r) => [r.combo_id as string, (r.vote as number) === 1 ? 1 : -1]));
  } catch (e) {
    console.warn("[comboFeedback] 조회 실패, 빈 Map 반환:", e);
    return new Map();
  }
}

/** vote: 1(도움됨) | -1(별로) | 0(취소) */
export async function setMyComboVote(comboId: string, vote: ComboVote | 0): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  if (vote === 0) {
    const { error } = await supabase.from("combo_feedback").delete().eq("user_id", user.id).eq("combo_id", comboId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("combo_feedback")
    .upsert(
      { user_id: user.id, combo_id: comboId, vote, updated_at: new Date().toISOString() },
      { onConflict: "user_id,combo_id" },
    );
  if (error) throw error;
}
