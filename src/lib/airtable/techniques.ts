import "server-only";
import type { FieldSet } from "airtable";
import { airtable } from "./client";
import { TABLES, FIELDS } from "./tables";
import type {
  Technique,
  TechniqueType,
  Stream,
  GiNogi,
  Difficulty,
} from "@/types/domain";

const F = FIELDS.TECHNIQUE;

function normalizeStream(raw: string | undefined | null): Stream | null {
  if (!raw) return null;
  // Airtable 실제 값(공백 포함 가능) → 내부 Stream 타입 매핑
  const normalized = raw.replace(/\s/g, ""); // 공백 제거
  const mapping: Record<string, Stream> = {
    // 현재 DB 값 (공백 제거 후 매핑)
    "가드포지션": "가드포지션",   // "가드 포지션"
    "탑포지션":   "탑포지션",     // "탑 포지션"
    "이스케이프": "이스케이프",
    "스탠딩":     "스탠딩",
    // 구버전 이름 호환
    "가드스윕":   "가드포지션",
    "가드스윗":   "가드포지션",
    "탑패스":     "탑포지션",
    "서브미션":   "이스케이프",   // 구분류 호환
    "포지션컨트롤": "탑포지션",  // 구분류 호환
  };
  return mapping[normalized] ?? null;
}

function toTechnique(record: {
  id: string;
  fields: Record<string, unknown>;
}): Technique {
  const f = record.fields;
  return {
    recordId: record.id,
    id: (f[F.ID] as string) ?? "",
    nameKo: (f[F.NAME_KO] as string) ?? "",
    nameEn: (f[F.NAME_EN] as string) ?? "",
    type: ((f[F.TYPE] as string) ?? "컨트롤") as TechniqueType,
    xpValue: (f[F.XP_VALUE] as number) ?? 0,
    giNogi: ((f[F.GI_NOGI] as string) ?? "기·노기공통") as GiNogi,
    videoUrl: (f[F.VIDEO_URL] as string) ?? null,
    notes: (f[F.NOTES] as string) ?? null,
    // 병합 후 신규
    parentId: (f[F.PARENT_ID] as string) || null,
    // v3 신규
    stream: normalizeStream(f[F.STREAM] as string | undefined),
    grip: (f[F.GRIP] as string) ?? null,
    bodyType: (f[F.BODY_TYPE] as string) ?? null,
    keyPoint: (f[F.KEY_POINT] as string) ?? null,
    practicalTip: (f[F.PRACTICAL_TIP] as string) ?? null,
    commonMistake: (f[F.COMMON_MISTAKE] as string) ?? null,
    counter: (f[F.COUNTER] as string) ?? null,
    ytSearchGeneral: (f[F.YT_SEARCH_GENERAL] as string) ?? null,
    ytSearchKo: (f[F.YT_SEARCH_KO] as string) ?? null,
    isMainSkill: F.IS_MAIN_SKILL ? Boolean(f[F.IS_MAIN_SKILL]) : false,
    curatedInstructor: (f[F.CURATED_INSTRUCTOR] as string) ?? null,
    difficulty: ((f[F.DIFFICULTY] as string) ?? null) as Difficulty | null,
    athleteRecordIds: F.ATHLETES ? ((f[F.ATHLETES] as string[] | undefined) ?? []) : [],
  };
}

export async function getAllTechniques(): Promise<Technique[]> {
  const records = await airtable(TABLES.TECHNIQUES)
    .select({
      fields: Object.values(F).filter(Boolean),
      pageSize: 100,
      returnFieldsByFieldId: true,
    })
    .all();
  return records.map((r) => toTechnique({ id: r.id, fields: r.fields }));
}

export async function getTechniqueByTechId(
  techId: string,
): Promise<Technique | null> {
  const records = await airtable(TABLES.TECHNIQUES)
    .select({
      fields: Object.values(F).filter(Boolean),
      filterByFormula: `{${F.ID}} = '${techId.replace(/'/g, "\'")}\'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();
  if (!records[0]) return null;
  return toTechnique({ id: records[0].id, fields: records[0].fields });
}

export async function getTechniqueByRecordId(
  recordId: string,
): Promise<Technique | null> {
  const records = await airtable(TABLES.TECHNIQUES)
    .select({
      fields: Object.values(F).filter(Boolean),
      filterByFormula: `RECORD_ID() = '${recordId.replace(/'/g, "\'")}\'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();
  if (!records[0]) return null;
  return toTechnique({ id: records[0].id, fields: records[0].fields });
}

export async function getTechniquesByParentId(
  parentId: string,
): Promise<Technique[]> {
  const all = await getAllTechniques();
  return all.filter((t) => t.parentId === parentId);
}

// ── 포지션 레코드 판별 ──────────────────────────────────────────────────────

export const POSITION_TYPES: TechniqueType[] = ["가드", "탑포지션", "전환", "방어"];

export function isPositionRecord(t: Technique): boolean {
  return POSITION_TYPES.includes(t.type);
}

// ── Admin CRUD ──────────────────────────────────────────────────────────────

export type TechniqueInput = {
  id: string;
  nameKo: string;
  nameEn?: string;
  stream?: string;
  type?: string;
  giNogi?: string;
  xpValue?: number;
  parentId?: string;
  grip?: string;
  bodyType?: string;
  keyPoint?: string;
  practicalTip?: string;
  commonMistake?: string;
  counter?: string;
  ytSearchGeneral?: string;
  ytSearchKo?: string;
  curatedInstructor?: string;
  difficulty?: string;
  videoUrl?: string;
  notes?: string;
};

function toFields(input: TechniqueInput): Record<string, unknown> {
  const f: Record<string, unknown> = {
    [F.ID]: input.id,
    [F.NAME_KO]: input.nameKo,
  };
  if (input.nameEn !== undefined)          f[F.NAME_EN]           = input.nameEn;
  if (input.stream !== undefined)          f[F.STREAM]            = input.stream || null;
  if (input.type !== undefined)            f[F.TYPE]              = input.type;
  if (input.giNogi !== undefined)          f[F.GI_NOGI]           = input.giNogi;
  if (input.xpValue !== undefined)         f[F.XP_VALUE]          = input.xpValue;
  if (input.parentId !== undefined)        f[F.PARENT_ID]         = input.parentId || null;
  if (input.grip !== undefined)            f[F.GRIP]              = input.grip || null;
  if (input.bodyType !== undefined)        f[F.BODY_TYPE]         = input.bodyType || null;
  if (input.keyPoint !== undefined)        f[F.KEY_POINT]         = input.keyPoint || null;
  if (input.practicalTip !== undefined)    f[F.PRACTICAL_TIP]     = input.practicalTip || null;
  if (input.commonMistake !== undefined)   f[F.COMMON_MISTAKE]    = input.commonMistake || null;
  if (input.counter !== undefined)         f[F.COUNTER]           = input.counter || null;
  if (input.ytSearchGeneral !== undefined) f[F.YT_SEARCH_GENERAL] = input.ytSearchGeneral || null;
  if (input.ytSearchKo !== undefined)      f[F.YT_SEARCH_KO]      = input.ytSearchKo || null;
  if (input.curatedInstructor !== undefined) f[F.CURATED_INSTRUCTOR] = input.curatedInstructor || null;
  if (input.difficulty !== undefined)      f[F.DIFFICULTY]        = input.difficulty || null;
  if (input.videoUrl !== undefined)        f[F.VIDEO_URL]         = input.videoUrl || null;
  if (input.notes !== undefined)           f[F.NOTES]             = input.notes || null;
  return f;
}

export async function createTechnique(input: TechniqueInput): Promise<string> {
  const created = await airtable(TABLES.TECHNIQUES).create([
    { fields: toFields(input) as unknown as FieldSet },
  ]);
  return created[0].id;
}

export async function updateTechnique(
  recordId: string,
  input: Partial<TechniqueInput>,
): Promise<void> {
  const f: Record<string, unknown> = {};
  if (input.id !== undefined)              f[F.ID]                = input.id;
  if (input.nameKo !== undefined)          f[F.NAME_KO]           = input.nameKo;
  if (input.nameEn !== undefined)          f[F.NAME_EN]           = input.nameEn;
  if (input.stream !== undefined)          f[F.STREAM]            = input.stream || null;
  if (input.type !== undefined)            f[F.TYPE]              = input.type;
  if (input.giNogi !== undefined)          f[F.GI_NOGI]           = input.giNogi;
  if (input.xpValue !== undefined)         f[F.XP_VALUE]          = input.xpValue;
  if (input.parentId !== undefined)        f[F.PARENT_ID]         = input.parentId || null;
  if (input.grip !== undefined)            f[F.GRIP]              = input.grip || null;
  if (input.bodyType !== undefined)        f[F.BODY_TYPE]         = input.bodyType || null;
  if (input.keyPoint !== undefined)        f[F.KEY_POINT]         = input.keyPoint || null;
  if (input.practicalTip !== undefined)    f[F.PRACTICAL_TIP]     = input.practicalTip || null;
  if (input.commonMistake !== undefined)   f[F.COMMON_MISTAKE]    = input.commonMistake || null;
  if (input.counter !== undefined)         f[F.COUNTER]           = input.counter || null;
  if (input.ytSearchGeneral !== undefined) f[F.YT_SEARCH_GENERAL] = input.ytSearchGeneral || null;
  if (input.ytSearchKo !== undefined)      f[F.YT_SEARCH_KO]      = input.ytSearchKo || null;
  if (input.curatedInstructor !== undefined) f[F.CURATED_INSTRUCTOR] = input.curatedInstructor || null;
  if (input.difficulty !== undefined)      f[F.DIFFICULTY]        = input.difficulty || null;
  if (input.videoUrl !== undefined)        f[F.VIDEO_URL]         = input.videoUrl || null;
  if (input.notes !== undefined)           f[F.NOTES]             = input.notes || null;
  await airtable(TABLES.TECHNIQUES).update([
    { id: recordId, fields: f as unknown as FieldSet },
  ]);
}

export async function deleteTechnique(recordId: string): Promise<void> {
  await airtable(TABLES.TECHNIQUES).destroy([recordId]);
}

/**
 * 주력 기술 토글 (isMainSkill ON/OFF).
 * Airtable IS_MAIN_SKILL 필드 ID가 설정된 경우에만 작동.
 */
export async function toggleMainSkill(
  recordId: string,
  value: boolean,
): Promise<void> {
  if (!FIELDS.TECHNIQUE.IS_MAIN_SKILL) {
    console.warn("[techniques] IS_MAIN_SKILL field ID not set in tables.ts");
    return;
  }
  await airtable(TABLES.TECHNIQUES).update([
    {
      id: recordId,
      fields: {
        [FIELDS.TECHNIQUE.IS_MAIN_SKILL]: value,
      } as unknown as import("airtable").FieldSet,
    },
  ]);
}
