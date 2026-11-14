import {
  assertUserId,
  CleanupPartialError,
  isNotFoundError,
  isUnknownAirtableField,
  isUserId,
} from "./userScope";

/**
 * CUSTOM_TECHNIQUES 소유자 칸의 필드명.
 * FIELDS 객체에 넣지 않는다. 베이스에 칸이 없을 때 select fields에 포함되면
 * 기술 목록 조회 전체가 실패한다. 프로덕션 베이스에는 이 칸을 만들지 않는다.
 */
export const CUSTOM_TECHNIQUE_USER_FIELD = "User ID";

const DESTROY_BATCH = 10;

export type CustomTechniqueRow = {
  id: string;
  fields?: Record<string, unknown>;
};

export type CustomTechniqueTable = {
  select: (args: { filterByFormula: string; fields?: string[] }) => {
    all: () => Promise<CustomTechniqueRow[]>;
  };
  destroy: (ids: string[]) => Promise<unknown>;
};

export function userScopedTechniqueFormula(userId: string): string {
  const id = assertUserId(userId);
  return `{${CUSTOM_TECHNIQUE_USER_FIELD}}='${id}'`;
}

/** 신규 레코드에만 소유자를 붙인다. 기존 행 수정 시에는 호출하지 않는다. */
export function fieldsWithTechniqueOwner(
  fields: Record<string, unknown>,
  userId: string | undefined,
): Record<string, unknown> {
  if (!isUserId(userId)) return { ...fields };
  return { ...fields, [CUSTOM_TECHNIQUE_USER_FIELD]: userId.trim() };
}

/**
 * User ID 칸이 없는 베이스에서도 생성이 성공하게 한다.
 * 칸이 없으면 첫 쓰기가 UNKNOWN_FIELD_NAME(422)로 실패하고, 소유자 없이 한 번 더 만든다.
 */
export async function createRecordWithOptionalOwner(
  create: (fields: Record<string, unknown>) => Promise<unknown>,
  fields: Record<string, unknown>,
  userId?: string,
): Promise<void> {
  const withOwner = fieldsWithTechniqueOwner(fields, userId);
  const stamped =
    CUSTOM_TECHNIQUE_USER_FIELD in withOwner && !(CUSTOM_TECHNIQUE_USER_FIELD in fields);
  try {
    await create(withOwner);
  } catch (e) {
    if (stamped && isUnknownAirtableField(e)) {
      console.warn("[customTechniques] User ID 필드가 없어 소유자 없이 저장합니다.");
      await create(fields);
      return;
    }
    throw e;
  }
}

function ownerOf(fields: Record<string, unknown> | undefined): string | null {
  const raw = fields?.[CUSTOM_TECHNIQUE_USER_FIELD];
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sameUser(owner: string, userId: string): boolean {
  return owner.toLowerCase() === userId.toLowerCase();
}

function chunks(ids: string[]): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < ids.length; i += DESTROY_BATCH) {
    out.push(ids.slice(i, i + DESTROY_BATCH));
  }
  return out;
}

/**
 * `{User ID}`가 이 사용자와 같은 행만 삭제한다.
 * 소유자가 비어 있는 행은 익명 집계로 남긴다. 수련 메모의 기술명과는 맞추지 않는다.
 * 칸이 아직 없으면 한 번만 로그하고 빈 결과로 끝낸다. 계정 삭제 자체는 계속된다.
 */
export async function deleteUserCustomTechniques(
  table: CustomTechniqueTable,
  userId: string,
): Promise<string[]> {
  const id = assertUserId(userId);
  let rows: CustomTechniqueRow[];
  try {
    rows = await table
      .select({
        filterByFormula: userScopedTechniqueFormula(id),
        fields: [CUSTOM_TECHNIQUE_USER_FIELD],
      })
      .all();
  } catch (e) {
    if (isUnknownAirtableField(e)) {
      console.error("[deleteAccount] Airtable User ID field missing; owner filter skipped");
      return [];
    }
    throw new CleanupPartialError("custom techniques", e);
  }

  const ids = [
    ...new Set(
      rows
        .filter((row) => {
          const owner = ownerOf(row.fields);
          return Boolean(row.id) && owner !== null && sameUser(owner, id);
        })
        .map((row) => row.id),
    ),
  ].sort();

  const failures: unknown[] = [];
  for (const batch of chunks(ids)) {
    try {
      await table.destroy(batch);
    } catch (e) {
      if (!isNotFoundError(e)) failures.push(e);
    }
  }
  if (failures.length > 0) {
    throw new CleanupPartialError("custom techniques", failures[0]);
  }
  return ids;
}
