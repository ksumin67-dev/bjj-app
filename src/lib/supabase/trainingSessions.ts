import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TrainingSession } from "@/types/domain";

type SessionRow = {
  id: string;
  session_date: string;
  technique_ids: string[] | null;
  game_plan_ids: string[] | null;
  notes: string | null;
  xp_earned: number | null;
  created_at: string;
};

function toSession(row: SessionRow): TrainingSession {
  const techCount = row.technique_ids?.length ?? 0;
  const planCount = row.game_plan_ids?.length ?? 0;
  const labelParts: string[] = [];
  if (techCount > 0) labelParts.push(`${techCount}개 기술`);
  if (planCount > 0) labelParts.push(`${planCount}개 게임플랜`);
  const label = `${row.session_date}${labelParts.length > 0 ? ` (${labelParts.join(", ")})` : ""}`;

  return {
    recordId: row.id,
    sessionLabel: label,
    date: row.session_date,
    techniqueRecordIds: row.technique_ids ?? [],
    gamePlanRecordIds: row.game_plan_ids ?? [],
    notes: row.notes,
    xpEarned: row.xp_earned ?? 0,
    createdAt: row.created_at,
  };
}

async function requireUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  return user.id;
}

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .order("session_date", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []).map(toSession);
  } catch (e) {
    console.warn("[trainingSessions] 조회 실패, 빈 배열 반환:", e);
    return [];
  }
}

/**
 * 특정 월의 세션만. month는 1~12.
 */
export async function getSessionsByMonth(
  year: number,
  month: number,
): Promise<TrainingSession[]> {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;
  const start = `${prefix}-01`;
  const nextMonth =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .gte("session_date", start)
      .lt("session_date", nextMonth)
      .order("session_date", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toSession);
  } catch (e) {
    console.warn("[trainingSessions] 월별 조회 실패, 전체에서 필터:", e);
    const all = await getAllTrainingSessions();
    return all.filter((s) => s.date.startsWith(prefix));
  }
}

export async function getSessionsByDate(
  date: string, // YYYY-MM-DD
): Promise<TrainingSession[]> {
  const all = await getAllTrainingSessions();
  return all.filter((s) => s.date === date);
}

export async function getSessionById(
  recordId: string,
): Promise<TrainingSession | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("id", recordId)
    .maybeSingle();
  if (error || !data) return null;
  return toSession(data);
}

export type CreateTrainingSessionInput = {
  date: string; // YYYY-MM-DD
  techniqueRecordIds: string[];
  gamePlanRecordIds: string[];
  notes?: string;
  xpEarned?: number;
};

export async function createTrainingSession(
  input: CreateTrainingSessionInput,
): Promise<string> {
  const userId = await requireUserId();
  const xp = input.xpEarned ?? input.gamePlanRecordIds.length * 200;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("training_sessions")
    .insert({
      user_id: userId,
      session_date: input.date,
      technique_ids: input.techniqueRecordIds,
      game_plan_ids: input.gamePlanRecordIds,
      notes: input.notes?.trim() || null,
      xp_earned: xp,
    })
    .select("id")
    .single();

  if (error || !data) throw error ?? new Error("세션 생성 실패");
  return data.id;
}

export async function deleteTrainingSession(recordId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("training_sessions")
    .delete()
    .eq("id", recordId);
  if (error) throw error;
}

export async function updateTrainingSession(
  recordId: string,
  input: CreateTrainingSessionInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("training_sessions")
    .update({
      session_date: input.date,
      technique_ids: input.techniqueRecordIds,
      game_plan_ids: input.gamePlanRecordIds,
      notes: (input.notes ?? "").trim() || null,
      xp_earned: input.xpEarned ?? 0,
    })
    .eq("id", recordId);
  if (error) throw error;
}
