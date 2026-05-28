import "server-only";
import type { FieldSet } from "airtable";
import { airtable } from "./client";
import { TABLES, FIELDS } from "./tables";
import type { TrainingSession } from "@/types/domain";

const F = FIELDS.TRAINING_SESSION;

function toSession(record: {
  id: string;
  fields: Record<string, unknown>;
}): TrainingSession {
  const f = record.fields;
  return {
    recordId: record.id,
    sessionLabel: (f[F.SESSION_LABEL] as string) ?? "",
    date: (f[F.DATE] as string) ?? "",
    techniqueRecordIds: (f[F.TECHNIQUES] as string[] | undefined) ?? [],
    sequenceRecordIds: (f[F.SEQUENCES] as string[] | undefined) ?? [],
    notes: (f[F.NOTES] as string) ?? null,
    xpEarned: (f[F.XP_EARNED] as number) ?? 0,
    createdAt: (f[F.CREATED_AT] as string) ?? null,
  };
}

export async function getAllTrainingSessions(): Promise<TrainingSession[]> {
  try {
    const records = await airtable(TABLES.TRAINING_SESSIONS)
      .select({
        fields: Object.values(F),
        pageSize: 100,
        sort: [{ field: F.DATE, direction: "desc" }],
        returnFieldsByFieldId: true,
      })
      .all();
    return records.map((r) => toSession({ id: r.id, fields: r.fields }));
  } catch (e) {
    console.warn("[trainingSessions] 조회 실패, 빈 배열 반환:", e);
    return [];
  }
}

/**
 * 특정 월의 세션만. month는 1~12. dateFormat=iso 필드라 'YYYY-MM' prefix 필터로 충분.
 */
export async function getSessionsByMonth(
  year: number,
  month: number,
): Promise<TrainingSession[]> {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;
  try {
    const records = await airtable(TABLES.TRAINING_SESSIONS)
      .select({
        fields: Object.values(F),
        // {date}는 ISO 문자열 비교 가능
        filterByFormula: `AND(IS_AFTER({${F.DATE}}, '${prefix}-00'), IS_BEFORE({${F.DATE}}, '${prefix}-32'))`,
        pageSize: 100,
        sort: [{ field: F.DATE, direction: "asc" }],
        returnFieldsByFieldId: true,
      })
      .all();
    return records.map((r) => toSession({ id: r.id, fields: r.fields }));
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
  const records = await airtable(TABLES.TRAINING_SESSIONS)
    .select({
      fields: Object.values(F),
      filterByFormula: `RECORD_ID() = '${recordId.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();
  if (!records[0]) return null;
  return toSession({ id: records[0].id, fields: records[0].fields });
}

export type CreateTrainingSessionInput = {
  date: string; // YYYY-MM-DD
  techniqueRecordIds: string[];
  sequenceRecordIds: string[];
  notes?: string;
  xpEarned?: number; // 액션에서 계산된 XP (기술 xpValue 합산 + 시퀀스 * 200)
};

export async function createTrainingSession(
  input: CreateTrainingSessionInput,
): Promise<string> {
  const xp = input.xpEarned ?? input.sequenceRecordIds.length * 200;

  const techCount = input.techniqueRecordIds.length;
  const seqCount = input.sequenceRecordIds.length;
  const labelParts = [];
  if (techCount > 0) labelParts.push(`${techCount}개 기술`);
  if (seqCount > 0) labelParts.push(`${seqCount}개 시퀀스`);
  const label = `${input.date}${labelParts.length > 0 ? ` (${labelParts.join(", ")})` : ""}`;

  const fields: Record<string, unknown> = {
    [F.SESSION_LABEL]: label,
    [F.DATE]: input.date,
    [F.XP_EARNED]: xp,
    [F.CREATED_AT]: new Date().toISOString(),
  };
  if (input.techniqueRecordIds.length > 0) {
    fields[F.TECHNIQUES] = input.techniqueRecordIds;
  }
  if (input.sequenceRecordIds.length > 0) {
    fields[F.SEQUENCES] = input.sequenceRecordIds;
  }
  if (input.notes && input.notes.trim()) {
    fields[F.NOTES] = input.notes.trim();
  }

  // FieldSet 캐스팅: Airtable SDK의 create() 오버로드 타입 불일치 해결
  const created = await airtable(TABLES.TRAINING_SESSIONS).create([
    { fields: fields as unknown as FieldSet },
  ]);
  return created[0].id;
}

export async function deleteTrainingSession(recordId: string): Promise<void> {
  await airtable(TABLES.TRAINING_SESSIONS).destroy([recordId]);
}

export async function updateTrainingSession(
  recordId: string,
  input: CreateTrainingSessionInput,
): Promise<void> {
  const xp = input.xpEarned ?? 0;

  const techCount = input.techniqueRecordIds.length;
  const seqCount  = input.sequenceRecordIds.length;
  const labelParts = [];
  if (techCount > 0) labelParts.push(`${techCount}개 기술`);
  if (seqCount  > 0) labelParts.push(`${seqCount}개 시퀀스`);
  const label = `${input.date}${labelParts.length > 0 ? ` (${labelParts.join(", ")})` : ""}`;

  const fields: Record<string, unknown> = {
    [F.SESSION_LABEL]: label,
    [F.DATE]: input.date,
    [F.XP_EARNED]: xp,
  };
  fields[F.TECHNIQUES] = input.techniqueRecordIds.length > 0 ? input.techniqueRecordIds : null;
  fields[F.SEQUENCES]  = input.sequenceRecordIds.length  > 0 ? input.sequenceRecordIds  : null;
  fields[F.NOTES]      = (input.notes ?? "").trim() || null;

  await airtable(TABLES.TRAINING_SESSIONS).update([
    { id: recordId, fields: fields as unknown as FieldSet },
  ]);
}
