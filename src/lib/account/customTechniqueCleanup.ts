import { FIELDS } from "@/lib/airtable/tables";
import { extractCustomTechniqueNames } from "./sessionNotes";
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
 * 기술 목록 조회 전체가 실패한다.
 */
export const CUSTOM_TECHNIQUE_USER_FIELD = "User ID";

const NAME_FIELD = FIELDS.CUSTOM_TECHNIQUE.NAME;
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

function escapeFormula(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function namesFormula(names: string[]): string {
  const safe = names
    .map((name) => name.trim().replace(/\s+/g, " "))
    .filter((name) => name.length > 0 && name.length <= 80 && !/[\u0000-\u001f]/.test(name));
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const name of safe) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(name);
    if (unique.length >= 100) break;
  }
  if (unique.length === 0) {
    throw new Error("no custom technique names");
  }
  const parts = unique.map((name) => `{${NAME_FIELD}}='${escapeFormula(name)}'`);
  return parts.length === 1 ? parts[0] : `OR(${parts.join(",")})`;
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

async function selectAll(
  table: CustomTechniqueTable,
  filterByFormula: string,
  fields: string[],
): Promise<CustomTechniqueRow[]> {
  return table.select({ filterByFormula, fields }).all();
}

/**
 * 이 사용자의 커스텀 기술명만 삭제한다.
 * 1) User ID가 이 사용자인 행
 * 2) 본인 수련 메모의 `[미등록: 이름]`과 같고, 소유자가 비어 있거나 본인인 행
 * 다른 사용자 ID가 적힌 행은 이름이 같아도 지우지 않는다.
 */
export async function deleteUserCustomTechniques(
  table: CustomTechniqueTable,
  userId: string,
  legacyNames: string[],
): Promise<string[]> {
  const id = assertUserId(userId);
  const failures: unknown[] = [];
  const deleted = new Set<string>();

  try {
    const owned = await selectAll(table, userScopedTechniqueFormula(id), [
      NAME_FIELD,
      CUSTOM_TECHNIQUE_USER_FIELD,
    ]);
    for (const row of owned) {
      const owner = ownerOf(row.fields);
      if (owner && !sameUser(owner, id)) continue;
      if (row.id) deleted.add(row.id);
    }
  } catch (e) {
    if (isUnknownAirtableField(e)) {
      console.error(
        "[deleteAccount] Airtable User ID field missing; owner filter skipped",
      );
    } else {
      failures.push(e);
    }
  }

  const names = legacyNames
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  if (names.length > 0) {
    let formula = "";
    try {
      formula = namesFormula(names);
    } catch {
      formula = "";
    }
    if (formula) {
      try {
        const matched = await selectAll(table, formula, [
          NAME_FIELD,
          CUSTOM_TECHNIQUE_USER_FIELD,
        ]);
        for (const row of matched) {
          const owner = ownerOf(row.fields);
          if (owner && !sameUser(owner, id)) continue;
          if (row.id) deleted.add(row.id);
        }
      } catch (e) {
        if (!isUnknownAirtableField(e)) {
          failures.push(e);
        } else {
          console.error(
            "[deleteAccount] Airtable User ID field missing; deleting this user's session names only",
          );
          try {
            const matched = await selectAll(table, formula, [NAME_FIELD]);
            for (const row of matched) {
              if (row.id) deleted.add(row.id);
            }
          } catch (retryError) {
            failures.push(retryError);
          }
        }
      }
    }
  }

  const ids = [...deleted].sort();
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

/**
 * 메모 조회가 실패해도 소유자 필터 삭제는 계속한다.
 * 메모는 auth 유저 삭제(CASCADE) 전에 읽어야 한다.
 */
export async function cleanupCustomTechniquesForUser(args: {
  userId: string;
  table: CustomTechniqueTable;
  loadNotes: (userId: string) => Promise<Array<string | null>>;
}): Promise<string[]> {
  const id = assertUserId(args.userId);
  let names: string[] = [];
  try {
    const notes = await args.loadNotes(id);
    names = extractCustomTechniqueNames(notes);
  } catch (e) {
    console.error(
      "[deleteAccount] training session lookup failed:",
      e instanceof Error ? e.message : "unknown error",
    );
  }
  return deleteUserCustomTechniques(args.table, id, names);
}
