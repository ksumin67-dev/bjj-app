import "server-only";
import type { FieldSet } from "airtable";
import { airtable } from "./client";
import { TABLES, FIELDS } from "./tables";
import type { Stream } from "@/types/domain";

const F = FIELDS.CUSTOM_TECHNIQUE;

export interface CustomTechnique {
  recordId: string;
  name: string;
  stream: Stream | null;
  useCount: number;
  firstUsed: string | null;
  lastUsed: string | null;
  registered: boolean;
}

function toCustomTechnique(record: {
  id: string;
  fields: Record<string, unknown>;
}): CustomTechnique {
  const f = record.fields;
  return {
    recordId: record.id,
    name: (f[F.NAME] as string) ?? "",
    stream: (F.STREAM ? (f[F.STREAM] as Stream | null) : null) ?? null,
    useCount: (f[F.USE_COUNT] as number) ?? 0,
    firstUsed: (f[F.FIRST_USED] as string) ?? null,
    lastUsed: (f[F.LAST_USED] as string) ?? null,
    registered: Boolean(f[F.REGISTERED]),
  };
}

export async function getAllCustomTechniques(): Promise<CustomTechnique[]> {
  const records = await airtable(TABLES.CUSTOM_TECHNIQUES)
    .select({
      fields: Object.values(F).filter(Boolean),
      sort: [{ field: F.USE_COUNT, direction: "desc" }],
      returnFieldsByFieldId: true,
    })
    .all();
  return records.map((r) => toCustomTechnique({ id: r.id, fields: r.fields }));
}

/**
 * 미등록 기술 사용 기록.
 * - 이미 있으면 사용횟수 +1, 최근사용일 갱신, 스트림도 업데이트
 * - 없으면 신규 생성
 */
export async function recordCustomTechniqueUsage(
  name: string,
  stream?: Stream,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const trimmed = name.trim();
  if (!trimmed) return;

  const existing = await airtable(TABLES.CUSTOM_TECHNIQUES)
    .select({
      fields: Object.values(F).filter(Boolean),
      filterByFormula: `{${F.NAME}} = '${trimmed.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();

  if (existing[0]) {
    const current = toCustomTechnique({ id: existing[0].id, fields: existing[0].fields });
    const updateFields: Record<string, unknown> = {
      [F.USE_COUNT]: current.useCount + 1,
      [F.LAST_USED]: today,
    };
    // 스트림이 있고 필드 ID가 설정된 경우만 업데이트
    if (stream && F.STREAM) updateFields[F.STREAM] = stream;

    await airtable(TABLES.CUSTOM_TECHNIQUES).update([
      { id: existing[0].id, fields: updateFields as unknown as FieldSet },
    ]);
  } else {
    const createFields: Record<string, unknown> = {
      [F.NAME]: trimmed,
      [F.USE_COUNT]: 1,
      [F.FIRST_USED]: today,
      [F.LAST_USED]: today,
      [F.REGISTERED]: false,
    };
    if (stream && F.STREAM) createFields[F.STREAM] = stream;

    await airtable(TABLES.CUSTOM_TECHNIQUES).create([
      { fields: createFields as unknown as FieldSet },
    ]);
  }
}

export async function deleteCustomTechnique(recordId: string): Promise<void> {
  await airtable(TABLES.CUSTOM_TECHNIQUES).destroy([recordId]);
}
