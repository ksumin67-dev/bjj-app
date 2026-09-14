import "server-only";
import { airtable } from "./client";
import { TABLES, FIELDS } from "./tables";
import type { Athlete, StyleTag } from "@/types/domain";

const F = FIELDS.ATHLETE;

function toAthlete(record: { id: string; fields: Record<string, unknown> }): Athlete {
  const f = record.fields;
  return {
    recordId: record.id,
    nameKo: (f[F.NAME_KO] as string) ?? "",
    nameEn: (f[F.NAME_EN] as string) ?? "",
    beltAcademy: (f[F.BELT_ACADEMY] as string) ?? "",
    activeEra: (f[F.ACTIVE_ERA] as string) ?? "",
    styleTags: ((f[F.STYLE_TAGS] as string[] | undefined) ?? []) as StyleTag[],
    signatureSystem: (f[F.SIGNATURE_SYSTEM] as string) ?? "",
    achievements: (f[F.ACHIEVEMENTS] as string) ?? "",
    includeInLaunch: Boolean(f[F.INCLUDE_IN_LAUNCH]),
    heroStat: (f[F.HERO_STAT] as string) ?? "",
    heroLabel: (f[F.HERO_LABEL] as string) ?? "",
  };
}

/**
 * 1차 배치 포함(includeInLaunch=true) 선수만 반환.
 * 스킬트리 진입 화면(선수 목록)에서 사용.
 */
export async function getAllAthletes(): Promise<Athlete[]> {
  const records = await airtable(TABLES.ATHLETES)
    .select({
      fields: Object.values(F).filter(Boolean),
      pageSize: 100,
      returnFieldsByFieldId: true,
    })
    .all();
  return records
    .map((r) => toAthlete({ id: r.id, fields: r.fields }))
    .filter((a) => a.includeInLaunch);
}

export async function getAthleteByRecordId(recordId: string): Promise<Athlete | null> {
  const records = await airtable(TABLES.ATHLETES)
    .select({
      fields: Object.values(F).filter(Boolean),
      filterByFormula: `RECORD_ID() = '${recordId.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
      returnFieldsByFieldId: true,
    })
    .firstPage();
  if (!records[0]) return null;
  return toAthlete({ id: records[0].id, fields: records[0].fields });
}
