import "server-only";
import { airtable } from "./client";
import { USER_PROFILE } from "./tables";
import type { BeltLevel } from "@/types/domain";

export interface UserProfile {
  recordId: string;
  name: string;
  nickname: string;
  belt: BeltLevel;
  stripe: number;   // 0~4 (Black Belt: 0~6)
}

const F = USER_PROFILE.FIELDS;

export async function getUserProfile(): Promise<UserProfile> {
  const base  = airtable;
  const table = base(USER_PROFILE.TABLE_ID);

  try {
    // find()는 returnFieldsByFieldId 옵션 미지원 → select()로 대체
    const records = await table
      .select({
        filterByFormula: `RECORD_ID() = '${USER_PROFILE.RECORD_ID}'`,
        maxRecords: 1,
        returnFieldsByFieldId: true,
      })
      .firstPage();

    const rec = records[0];
    if (!rec) throw new Error("no record");

    return {
      recordId: rec.id,
      name:     (rec.fields[F.NAME]     as string) ?? "아쿠아",
      nickname: (rec.fields[F.NICKNAME] as string) ?? "아쿠아",
      belt:     ((rec.fields[F.BELT]    as string) ?? "White Belt") as BeltLevel,
      stripe:   (rec.fields[F.STRIPE]   as number) ?? 0,
    };
  } catch {
    // 레코드 없으면 기본값 반환
    return { recordId: "", name: "아쿠아", nickname: "아쿠아", belt: "White Belt", stripe: 0 };
  }
}

export async function updateUserProfile(
  belt: BeltLevel,
  stripe: number,
  nickname?: string,
): Promise<void> {
  const base  = airtable;
  const table = base(USER_PROFILE.TABLE_ID);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields: Record<string, any> = {
    [F.BELT]:   belt,
    [F.STRIPE]: stripe,
  };
  if (nickname !== undefined) fields[F.NICKNAME] = nickname;
  await table.update(USER_PROFILE.RECORD_ID, fields);
}
