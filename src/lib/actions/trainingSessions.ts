"use server";

import { revalidatePath } from "next/cache";
import {
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  getAllTrainingSessions,
  type CreateTrainingSessionInput,
} from "@/lib/supabase/trainingSessions";
import { createSequence } from "@/lib/supabase/sequences";
import { recordCustomTechniqueUsage } from "@/lib/airtable/customTechniques";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { calculateNewStreak, getStreakBonus, getLevelRank } from "@/types/domain";
import type { Stream } from "@/types/domain";

export type CreateSessionFormState = {
  ok: boolean;
  error?: string;
  sessionId?: string;
  xpEarned?: number;
  streak?: number;
  streakBonus?: number;
  /** 학습 레벨(XP 게이미피케이션) 승급 — 실제 벨트와는 무관 (2026-09-19) */
  levelUp?: string | null;
};

// ── 공통 helpers ────────────────────────────────────────────────────────────

async function parseTechMap() {
  try {
    const allTechs = await getAllTechniques();
    return new Map(allTechs.map((t) => [t.recordId, t]));
  } catch {
    return new Map<string, Awaited<ReturnType<typeof getAllTechniques>>[number]>();
  }
}

function parseCustomTechs(formData: FormData): {
  names: string[];
  streams: Record<string, Stream>;
} {
  const names = formData
    .getAll("customTechniques")
    .map((v) => v.toString().trim())
    .filter(Boolean);
  const streams: Record<string, Stream> = {};
  for (const name of names) {
    const stream = formData.get(`customTechStream_${name}`) as Stream | null;
    if (stream) streams[name] = stream;
  }
  return { names, streams };
}

async function maybeCreateSequence(
  formData: FormData,
  techMap: Map<string, { nameKo: string }>,
): Promise<string | null> {
  const shouldCreate = formData.get("createSequence") === "true";
  const newSeqName   = ((formData.get("newSeqName") as string) ?? "").trim();
  const techOrder    = formData
    .getAll("newSeqTechOrder")
    .map((v) => v.toString())
    .filter(Boolean);

  if (!shouldCreate || !newSeqName || techOrder.length < 2) return null;

  try {
    const stepsText = techOrder
      .map((id) => techMap.get(id)?.nameKo || "")
      .filter(Boolean)
      .join("\n");
    return await createSequence({
      seqName: newSeqName,
      techniquesUsedRecordIds: techOrder,
      stepsText,
      hasBranch: false,
      isPrimary: false,
    });
  } catch (e) {
    console.warn("[trainingSessions] 게임플랜 생성 실패:", e);
    return null;
  }
}

// ── createTrainingSessionAction ──────────────────────────────────────────────

/**
 * Server Action — 새 수련 세션 생성.
 * XP = 기술 xpValue 합계 + 게임플랜 * 200 + 스트릭 보너스
 */
export async function createTrainingSessionAction(
  _prevState: CreateSessionFormState,
  formData: FormData,
): Promise<CreateSessionFormState> {
  const date = ((formData.get("date") as string) ?? "").trim();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)." };
  }

  const techniqueRecordIds = formData
    .getAll("techniques")
    .map((v) => v.toString())
    .filter(Boolean);

  const { names: customTechniqueNames, streams: customTechStreams } =
    parseCustomTechs(formData);

  if (techniqueRecordIds.length === 0 && customTechniqueNames.length === 0) {
    return { ok: false, error: "기술을 최소 하나는 태그해야 합니다." };
  }

  const notes = ((formData.get("notes") as string) ?? "").trim();

  // 기술 데이터 로드
  const techMap = await parseTechMap();

  // 새 게임플랜 생성 (수련에서 직접 만들기)
  const sequenceRecordIds: string[] = [];
  const newSeqId = await maybeCreateSequence(formData, techMap);
  if (newSeqId) sequenceRecordIds.push(newSeqId);

  // XP 계산
  let baseXp = 0;
  for (const id of techniqueRecordIds) {
    baseXp += techMap.get(id)?.xpValue ?? 100;
  }
  baseXp += sequenceRecordIds.length * 200;

  // 스트릭 보너스 + 벨트 승급 감지 (기존 세션 한 번만 로드)
  let streak = 1;
  let streakBonus = 0;
  let existingSessions: Awaited<ReturnType<typeof getAllTrainingSessions>> = [];
  try {
    existingSessions = await getAllTrainingSessions();
    streak = calculateNewStreak(existingSessions);
    streakBonus = getStreakBonus(streak);
  } catch {
    // 스트릭 계산 실패해도 세션은 저장
  }

  const xpEarned  = baseXp + streakBonus;
  const existingXp = existingSessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const previousLevel = getLevelRank(existingXp).level;
  const newLevel       = getLevelRank(existingXp + xpEarned).level;
  const levelUp        = previousLevel !== newLevel ? newLevel : null;

  const input: CreateTrainingSessionInput = {
    date,
    techniqueRecordIds,
    sequenceRecordIds,
    notes: notes || undefined,
    xpEarned,
  };

  let sessionId: string;
  try {
    sessionId = await createTrainingSession(input);
  } catch (e) {
    console.error("[createTrainingSessionAction] failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "세션 저장 실패" };
  }

  // 커스텀 기술 저장 (fire & forget)
  if (customTechniqueNames.length > 0) {
    Promise.allSettled(
      customTechniqueNames.map((name) =>
        recordCustomTechniqueUsage(name, customTechStreams[name]),
      ),
    ).catch((e) => console.warn("[customTechniques] 저장 실패:", e));
  }

  revalidatePath("/", "layout");
  return { ok: true, sessionId, xpEarned, streak, streakBonus, levelUp };
}

// ── updateTrainingSessionAction ──────────────────────────────────────────────

/**
 * Server Action — 기존 수련 세션 수정.
 * recordId는 hidden input "sessionRecordId"로 전달.
 * 스트릭 보너스는 재계산하지 않고 기술 xpValue 합산만.
 */
export async function updateTrainingSessionAction(
  _prevState: CreateSessionFormState,
  formData: FormData,
): Promise<CreateSessionFormState> {
  const recordId = ((formData.get("sessionRecordId") as string) ?? "").trim();
  if (!recordId) return { ok: false, error: "세션 ID가 없습니다." };

  const date = ((formData.get("date") as string) ?? "").trim();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)." };
  }

  const techniqueRecordIds = formData
    .getAll("techniques")
    .map((v) => v.toString())
    .filter(Boolean);

  const { names: customTechniqueNames, streams: customTechStreams } =
    parseCustomTechs(formData);

  if (techniqueRecordIds.length === 0 && customTechniqueNames.length === 0) {
    return { ok: false, error: "기술을 최소 하나는 태그해야 합니다." };
  }

  const notes = ((formData.get("notes") as string) ?? "").trim();

  // 기술 데이터 로드
  const techMap = await parseTechMap();

  // 새 게임플랜 생성 (수련에서 직접 만들기)
  const sequenceRecordIds: string[] = [];
  const newSeqId = await maybeCreateSequence(formData, techMap);
  if (newSeqId) sequenceRecordIds.push(newSeqId);

  // XP 재계산 (스트릭 보너스 없이)
  let xpEarned = 0;
  for (const id of techniqueRecordIds) {
    xpEarned += techMap.get(id)?.xpValue ?? 100;
  }
  xpEarned += sequenceRecordIds.length * 200;

  const input: CreateTrainingSessionInput = {
    date,
    techniqueRecordIds,
    sequenceRecordIds,
    notes: notes || undefined,
    xpEarned,
  };

  try {
    await updateTrainingSession(recordId, input);
  } catch (e) {
    console.error("[updateTrainingSessionAction] failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "수정 저장 실패" };
  }

  // 커스텀 기술 저장 (fire & forget)
  if (customTechniqueNames.length > 0) {
    Promise.allSettled(
      customTechniqueNames.map((name) =>
        recordCustomTechniqueUsage(name, customTechStreams[name]),
      ),
    ).catch((e) => console.warn("[customTechniques] 저장 실패:", e));
  }

  revalidatePath("/", "layout");
  return { ok: true, sessionId: recordId, xpEarned };
}

// ── deleteTrainingSessionAction ──────────────────────────────────────────────

export async function deleteTrainingSessionAction(
  recordId: string,
): Promise<void> {
  await deleteTrainingSession(recordId);
  revalidatePath("/", "layout");
}
