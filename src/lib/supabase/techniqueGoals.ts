import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TechniqueGoal = {
  techniqueRecordId: string;
  athleteRecordId: string | null;
  createdAt: string;
};

async function requireUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** 로그인 유저의 학습 목표(찜한 기술) 전체 조회. 비로그인이면 빈 배열. */
export async function getMyTechniqueGoals(): Promise<TechniqueGoal[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("technique_goals")
      .select("technique_record_id, athlete_record_id, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      techniqueRecordId: row.technique_record_id,
      athleteRecordId: row.athlete_record_id,
      createdAt: row.created_at,
    }));
  } catch (e) {
    console.warn("[techniqueGoals] 조회 실패, 빈 배열 반환:", e);
    return [];
  }
}

/** 홈/캘린더 등에서 빠른 lookup용 — technique_record_id Set만 필요할 때. */
export async function getMyTechniqueGoalIdSet(): Promise<Set<string>> {
  const goals = await getMyTechniqueGoals();
  return new Set(goals.map((g) => g.techniqueRecordId));
}

export async function addTechniqueGoal(
  techniqueRecordId: string,
  athleteRecordId: string | null,
): Promise<void> {
  const userId = await requireUserId();
  if (!userId) throw new Error("로그인이 필요합니다.");

  const supabase = createClient();
  const { error } = await supabase
    .from("technique_goals")
    .upsert(
      { user_id: userId, technique_record_id: techniqueRecordId, athlete_record_id: athleteRecordId },
      { onConflict: "user_id,technique_record_id" },
    );
  if (error) throw error;
}

export async function removeTechniqueGoal(techniqueRecordId: string): Promise<void> {
  const userId = await requireUserId();
  if (!userId) throw new Error("로그인이 필요합니다.");

  const supabase = createClient();
  const { error } = await supabase
    .from("technique_goals")
    .delete()
    .eq("user_id", userId)
    .eq("technique_record_id", techniqueRecordId);
  if (error) throw error;
}
