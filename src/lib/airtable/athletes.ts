import "server-only";
import { serverEnv } from "@/lib/env";
import { airtable } from "./client";
import { AIRTABLE_ATHLETES_TAG, cachedCatalogRead } from "./catalogCache";
import { TABLES, FIELDS } from "./tables";
import type { Athlete, StyleTag } from "@/types/domain";

const F = FIELDS.ATHLETE;

function toAthlete(record: {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}): Athlete {
  const f = record.fields;
  return {
    recordId: record.id,
    createdTime: record.createdTime ?? "",
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

async function fetchAllAthletes(): Promise<Athlete[]> {
  const records = await airtable(TABLES.ATHLETES)
    .select({
      fields: Object.values(F).filter(Boolean),
      pageSize: 100,
      returnFieldsByFieldId: true,
    })
    .all();
  return records.map((r) =>
    toAthlete({
      id: r.id,
      fields: r.fields,
      createdTime: (r as unknown as { _rawJson?: { createdTime?: string } })._rawJson
        ?.createdTime,
    }),
  );
}

// includeInLaunch 필터 전의 전체 테이블. ID 조회는 런치 제외 선수도 찾는다.
const readAthleteCatalog = cachedCatalogRead({
  key: `airtable-athletes-v1-${serverEnv.AIRTABLE_BASE_ID}`,
  tag: AIRTABLE_ATHLETES_TAG,
  load: fetchAllAthletes,
});

/**
 * 1차 배치 포함(includeInLaunch=true) 선수만 반환.
 * 스킬트리 진입 화면(선수 목록)에서 사용.
 */
export async function getAllAthletes(): Promise<Athlete[]> {
  const all = await readAthleteCatalog();
  return all.filter((a) => a.includeInLaunch);
}

export async function getAthleteByRecordId(recordId: string): Promise<Athlete | null> {
  const all = await readAthleteCatalog();
  return all.find((a) => a.recordId === recordId) ?? null;
}
