import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Sequence } from "@/types/domain";

type SequenceRow = {
  id: string;
  seq_name: string;
  start_position: string | null;
  technique_ids: string[] | null;
  steps_text: string | null;
  has_branch: boolean;
  branch_condition: string | null;
  is_primary: boolean;
};

function toSequence(row: SequenceRow): Sequence {
  return {
    recordId: row.id,
    seqName: row.seq_name,
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

export async function getAllSequences(): Promise<Sequence[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toSequence);
}

export async function getSequenceById(
  recordId: string,
): Promise<Sequence | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .eq("id", recordId)
    .maybeSingle();
  if (error || !data) return null;
  return toSequence(data);
}

export type CreateSequenceInput = {
  seqName: string;
  startPositionRecordId?: string;
  techniquesUsedRecordIds: string[];
  stepsText: string;
  hasBranch: boolean;
  branchCondition?: string;
  isPrimary: boolean;
};

/**
 * 시퀀스 생성. 반환은 새 레코드 ID만.
 * 호출 측에서 redirect/revalidate 직후 fresh fetch.
 */
export async function createSequence(
  input: CreateSequenceInput,
): Promise<string> {
  const userId = await requireUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sequences")
    .insert({
      user_id: userId,
      seq_name: input.seqName,
      start_position: input.startPositionRecordId ?? null,
      technique_ids: input.techniquesUsedRecordIds,
      steps_text: input.stepsText,
      has_branch: input.hasBranch,
      branch_condition: input.branchCondition ?? null,
      is_primary: input.isPrimary,
    })
    .select("id")
    .single();

  if (error || !data) throw error ?? new Error("시퀀스 생성 실패");
  return data.id;
}

/**
 * 주력 기술 표시 토글.
 */
export async function setSequencePrimary(
  recordId: string,
  isPrimary: boolean,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("sequences")
    .update({ is_primary: isPrimary })
    .eq("id", recordId);
  if (error) throw error;
}

export async function deleteSequence(recordId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("sequences").delete().eq("id", recordId);
  if (error) throw error;
}
