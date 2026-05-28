import "server-only";
import type { FieldSet } from "airtable";
import { airtable } from "./client";
import { TABLES, FIELDS } from "./tables";
import type { Sequence } from "@/types/domain";

const F = FIELDS.SEQUENCE;

function toSequence(record: {
  id: string;
  fields: Record<string, unknown>;
}): Sequence {
  const f = record.fields;
  return {
    recordId: record.id,
    seqName: (f[F.SEQ_NAME] as string) ?? "",
    startPositionRecordId: (f[F.START_POSITION] as string[] | undefined)?.[0],
    techniquesUsedRecordIds:
      (f[F.TECHNIQUES_USED] as string[] | undefined) ?? [],
    stepsText: (f[F.STEPS_TEXT] as string) ?? "",
    hasBranch: Boolean(f[F.HAS_BRANCH]),
    branchCondition: (f[F.BRANCH_CONDITION] as string) ?? null,
    tags: (f[F.TAGS] as string[] | undefined) ?? [],
    successCount: (f[F.SUCCESS_COUNT] as number) ?? 0,
    lastUsed: (f[F.LAST_USED] as string) ?? null,
  };
}

export async function getAllSequences(): Promise<Sequence[]> {
  const records = await airtable(TABLES.SEQUENCES)
    .select({
      fields: Object.values(F),
      pageSize: 100,
      sort: [{ field: F.LAST_USED, direction: "desc" }],
      returnFieldsByFieldId: true,
    })
    .all();
  return records.map((r) => toSequence({ id: r.id, fields: r.fields }));
}

/**
 * find() 대신 select() + RECORD_ID() 필터.
 * find()는 returnFieldsByFieldId 옵션을 지원하지 않아 필드 이름 기반으로
 * 키가 반환되는 함정이 있음. 일관성 유지를 위해 select 사용.
 */
export async function getSequenceById(
  recordId: string,
): Promise<Sequence | null> {
  const records = await airtable(TABLES.SEQUENCES)
    .select({
      fields: Object.values(F),
      filterByFormula: `RECORD_ID() = '${recordId.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();
  if (!records[0]) return null;
  return toSequence({ id: records[0].id, fields: records[0].fields });
}

export type CreateSequenceInput = {
  seqName: string;
  startPositionRecordId?: string;
  techniquesUsedRecordIds: string[];
  stepsText: string;
  hasBranch: boolean;
  branchCondition?: string;
  tags: string[];
};

/**
 * 시퀀스 생성. 반환은 새 레코드 ID만.
 * 호출 측에서 redirect/revalidate 직후 fresh fetch.
 */
export async function createSequence(
  input: CreateSequenceInput,
): Promise<string> {
  const fields: Record<string, unknown> = {
    [F.SEQ_NAME]: input.seqName,
    [F.STEPS_TEXT]: input.stepsText,
    [F.HAS_BRANCH]: input.hasBranch,
    [F.SUCCESS_COUNT]: 0,
  };
  if (input.startPositionRecordId) {
    fields[F.START_POSITION] = [input.startPositionRecordId];
  }
  if (input.techniquesUsedRecordIds.length > 0) {
    fields[F.TECHNIQUES_USED] = input.techniquesUsedRecordIds;
  }
  if (input.branchCondition) {
    fields[F.BRANCH_CONDITION] = input.branchCondition;
  }
  if (input.tags.length > 0) {
    fields[F.TAGS] = input.tags;
  }

  // FieldSet 캐스팅: Airtable SDK의 create() 오버로드 타입 불일치 해결
  const created = await airtable(TABLES.SEQUENCES).create([
    { fields: fields as unknown as FieldSet },
  ]);
  return created[0].id;
}

/**
 * 성공 카운트 +1, last_used 갱신.
 * Airtable는 atomic increment 미지원 — read-then-write (단일 사용자 전제).
 */
export async function incrementSuccessCount(
  recordId: string,
): Promise<void> {
  const current = await getSequenceById(recordId);
  if (!current) throw new Error(`Sequence not found: ${recordId}`);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await airtable(TABLES.SEQUENCES).update([
    {
      id: recordId,
      fields: {
        [F.SUCCESS_COUNT]: current.successCount + 1,
        [F.LAST_USED]: today,
      },
    },
  ]);
}

export async function deleteSequence(recordId: string): Promise<void> {
  await airtable(TABLES.SEQUENCES).destroy([recordId]);
}
