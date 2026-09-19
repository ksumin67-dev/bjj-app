import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { GamePlan } from "@/types/domain";

type GamePlanRow = {
  id: string;
  plan_name: string;
  start_position: string | null;
  technique_ids: string[] | null;
  steps_text: string | null;
  has_branch: boolean;
  branch_condition: string | null;
  is_primary: boolean;
};

function toGamePlan(row: GamePlanRow): GamePlan {
  return {
    recordId: row.id,
    planName: row.plan_name,
    startPositionRecordId: row.start_position ?? undefined,
    techniquesUsedRecordIds: row.technique_ids ?? [],
    stepsText: row.steps_text ?? "",
    hasBranch: row.has_branch,
    branchCondition: row.branch_condition,
    isPrimary: row.is_primary,
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

export async function getAllGamePlans(): Promise<GamePlan[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("game_plans")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toGamePlan);
}

export async function getGamePlanById(
  recordId: string,
): Promise<GamePlan | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("game_plans")
    .select("*")
    .eq("id", recordId)
    .maybeSingle();
  if (error || !data) return null;
  return toGamePlan(data);
}

export type CreateGamePlanInput = {
  planName: string;
  startPositionRecordId?: string;
  techniquesUsedRecordIds: string[];
  stepsText: string;
  hasBranch: boolean;
  branchCondition?: string;
  isPrimary: boolean;
};

/**
 * 게임플랜 생성. 반환은 새 레코드 ID만.
 * 호출 측에서 redirect/revalidate 직후 fresh fetch.
 */
export async function createGamePlan(
  input: CreateGamePlanInput,
): Promise<string> {
  const userId = await requireUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("game_plans")
    .insert({
      user_id: userId,
      plan_name: input.planName,
      start_position: input.startPositionRecordId ?? null,
      technique_ids: input.techniquesUsedRecordIds,
      steps_text: input.stepsText,
      has_branch: input.hasBranch,
      branch_condition: input.branchCondition ?? null,
      is_primary: input.isPrimary,
    })
    .select("id")
    .single();

  if (error || !data) throw error ?? new Error("게임플랜 생성 실패");
  return data.id;
}

/**
 * 주력 기술 표시 토글.
 */
export async function setGamePlanPrimary(
  recordId: string,
  isPrimary: boolean,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("game_plans")
    .update({ is_primary: isPrimary })
    .eq("id", recordId);
  if (error) throw error;
}

export async function deleteGamePlan(recordId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("game_plans").delete().eq("id", recordId);
  if (error) throw error;
}
