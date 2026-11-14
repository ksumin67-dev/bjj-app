import { afterEach, describe, expect, it, vi } from "vitest";
import { AVATAR_LIST_PAGE, deleteUserAvatarFiles, type AvatarStorage } from "./avatarCleanup";
import {
  CUSTOM_TECHNIQUE_USER_FIELD,
  createRecordWithOptionalOwner,
  deleteUserCustomTechniques,
  fieldsWithTechniqueOwner,
  userScopedTechniqueFormula,
  type CustomTechniqueRow,
  type CustomTechniqueTable,
} from "./customTechniqueCleanup";
import { deleteAccountForUser } from "./deleteAccount";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const UNKNOWN_FIELD = {
  statusCode: 422,
  error: "UNKNOWN_FIELD_NAME",
  message: 'Unknown field name: "User ID"',
};

afterEach(() => {
  vi.restoreAllMocks();
});

function silenceError() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

describe("user scoping formulas", () => {
  it("pins the Airtable filter to one user id", () => {
    const formula = userScopedTechniqueFormula(USER_A);
    expect(formula).toBe(`{${CUSTOM_TECHNIQUE_USER_FIELD}}='${USER_A}'`);
    expect(formula).not.toContain(USER_B);
  });

  it("rejects ids that could break out of the formula string", () => {
    expect(() => userScopedTechniqueFormula(`${USER_A}' OR '1'='1`)).toThrow(/invalid user id/);
    expect(() => userScopedTechniqueFormula("")).toThrow(/invalid user id/);
  });

  it("stamps an owner only for a real user id", () => {
    const base = { Name: "키락" };
    expect(fieldsWithTechniqueOwner(base, USER_A)).toEqual({
      Name: "키락",
      [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A,
    });
    expect(fieldsWithTechniqueOwner(base, "not-a-uuid")).toEqual({ Name: "키락" });
    expect(base).toEqual({ Name: "키락" });
  });
});

describe("avatar cleanup", () => {
  function storageFor(pages: string[][], removeError?: unknown) {
    const listed: Array<{ folder: string; offset: number }> = [];
    const removed: string[][] = [];
    const storage: AvatarStorage = {
      async list(folder, options) {
        listed.push({ folder, offset: options.offset });
        const index = options.offset / options.limit;
        return (pages[index] ?? []).map((name) => ({ name }));
      },
      async remove(paths) {
        removed.push(paths);
        if (removeError) throw removeError;
      },
    };
    return { storage, listed, removed };
  }

  it("lists and removes only that user's folder", async () => {
    silenceError();
    const fake = storageFor([["one.jpg", "../other/secret.jpg", "two.jpg", "", ".keep"]]);
    const removed = await deleteUserAvatarFiles(fake.storage, USER_A);
    expect(fake.listed).toEqual([{ folder: USER_A, offset: 0 }]);
    expect(removed).toEqual([`${USER_A}/one.jpg`, `${USER_A}/two.jpg`]);
    expect(fake.removed).toEqual([[`${USER_A}/one.jpg`, `${USER_A}/two.jpg`]]);
    expect(JSON.stringify(fake.removed)).not.toContain(USER_B);
  });

  it("is idempotent when the folder is already empty", async () => {
    const fake = storageFor([[]]);
    await expect(deleteUserAvatarFiles(fake.storage, USER_A)).resolves.toEqual([]);
    expect(fake.removed).toEqual([]);
  });

  it("treats a missing object as success and keeps going after a failed batch", async () => {
    const page = Array.from({ length: AVATAR_LIST_PAGE }, (_, i) => `${i}.jpg`);
    const listed: Array<{ folder: string; offset: number }> = [];
    const removed: string[][] = [];
    let calls = 0;
    const storage: AvatarStorage = {
      async list(folder, options) {
        listed.push({ folder, offset: options.offset });
        if (options.offset === 0) return page.map((name) => ({ name }));
        return [{ name: "last.jpg" }];
      },
      async remove(paths) {
        calls += 1;
        removed.push(paths);
        if (calls === 1) throw { statusCode: 500, message: "storage down" };
      },
    };
    await expect(deleteUserAvatarFiles(storage, USER_A)).rejects.toThrow(/avatar cleanup failed/);
    expect(listed.map((call) => call.folder)).toEqual([USER_A, USER_A]);
    expect(removed).toHaveLength(2);
    expect(removed[1]).toEqual([`${USER_A}/last.jpg`]);

    const missing = storageFor([["gone.jpg"]], { statusCode: 404, message: "Not found" });
    await expect(deleteUserAvatarFiles(missing.storage, USER_A)).resolves.toEqual([]);
  });

  it("does not list anything for an invalid id", async () => {
    const fake = storageFor([["one.jpg"]]);
    await expect(deleteUserAvatarFiles(fake.storage, "../avatars")).rejects.toThrow(/invalid user id/);
    expect(fake.listed).toEqual([]);
  });
});

describe("airtable custom technique cleanup", () => {
  function tableFor(opts: {
    byUser?: CustomTechniqueRow[];
    userError?: unknown;
    destroyError?: unknown;
  }) {
    const formulas: string[] = [];
    const destroyed: string[][] = [];
    let destroyCalls = 0;
    const table: CustomTechniqueTable = {
      select(args) {
        formulas.push(args.filterByFormula);
        return {
          all: async () => {
            if (!args.filterByFormula.includes(`{${CUSTOM_TECHNIQUE_USER_FIELD}}=`)) {
              throw new Error(`unexpected formula: ${args.filterByFormula}`);
            }
            if (opts.userError) throw opts.userError;
            return opts.byUser ?? [];
          },
        };
      },
      async destroy(ids) {
        destroyCalls += 1;
        destroyed.push(ids);
        if (opts.destroyError && destroyCalls === 1) throw opts.destroyError;
      },
    };
    return { table, formulas, destroyed };
  }

  it("deletes only rows whose User ID is this user", async () => {
    const fake = tableFor({
      byUser: [
        { id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A, Name: "키락" } },
        { id: "rec-b", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_B, Name: "키락" } },
        // 수련 메모의 [미등록: 토네이도]와 이름이 같아도 소유자가 없으면 집계 데이터로 남긴다.
        { id: "rec-ownerless", fields: { Name: "토네이도" } },
      ],
    });

    const deleted = await deleteUserCustomTechniques(fake.table, USER_A);
    expect(fake.formulas).toEqual([`{${CUSTOM_TECHNIQUE_USER_FIELD}}='${USER_A}'`]);
    expect(fake.formulas[0]).not.toContain(USER_B);
    expect(fake.formulas[0]).not.toContain("토네이도");
    expect(deleted).toEqual(["rec-a"]);
    expect(fake.destroyed).toEqual([["rec-a"]]);
    expect(JSON.stringify(fake.destroyed)).not.toContain("rec-b");
    expect(JSON.stringify(fake.destroyed)).not.toContain("rec-ownerless");
  });

  it("does not delete an ownerless row whose name matches the user's notes", async () => {
    const fake = tableFor({
      byUser: [{ id: "rec-ownerless", fields: { Name: "토네이도" } }],
    });
    const deleted = await deleteUserCustomTechniques(fake.table, USER_A);
    expect(deleted).toEqual([]);
    expect(fake.destroyed).toEqual([]);
    expect(fake.formulas).toHaveLength(1);
  });

  it("does not call destroy when nothing belongs to the user", async () => {
    const fake = tableFor({
      byUser: [{ id: "rec-b", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_B } }],
    });
    await expect(deleteUserCustomTechniques(fake.table, USER_A)).resolves.toEqual([]);
    expect(fake.destroyed).toEqual([]);
  });

  it("keeps deleting later batches when one destroy fails, then reports the failure", async () => {
    const rows = Array.from({ length: 11 }, (_, i) => ({
      id: `rec-${String(i).padStart(2, "0")}`,
      fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A },
    }));
    const fake = tableFor({
      byUser: rows,
      destroyError: { statusCode: 500, message: "airtable down" },
    });
    await expect(deleteUserCustomTechniques(fake.table, USER_A)).rejects.toThrow(
      /custom techniques cleanup failed/,
    );
    expect(fake.destroyed).toHaveLength(2);
  });

  it("treats an already-deleted record as success", async () => {
    const fake = tableFor({
      byUser: [{ id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A } }],
      destroyError: { statusCode: 404, message: "Record not found" },
    });
    await expect(deleteUserCustomTechniques(fake.table, USER_A)).resolves.toEqual(["rec-a"]);
  });

  it("logs once and deletes nothing when the User ID field is missing", async () => {
    const spy = silenceError();
    const fake = tableFor({ userError: UNKNOWN_FIELD });
    const auth = vi.fn(async () => undefined);
    const result = await deleteAccountForUser(USER_A, {
      deleteAvatars: async () => [],
      deleteCustomTechniques: (id) => deleteUserCustomTechniques(fake.table, id),
      deleteAuthUser: auth,
    });

    expect(result).toEqual({ ok: true });
    expect(auth).toHaveBeenCalledWith(USER_A);
    expect(fake.formulas).toEqual([`{${CUSTOM_TECHNIQUE_USER_FIELD}}='${USER_A}'`]);
    expect(fake.destroyed).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(String(spy.mock.calls[0]?.[0])).toContain("User ID field missing");
  });
});

describe("custom technique create without a User ID field", () => {
  it("retries without the field when Airtable returns UNKNOWN_FIELD_NAME 422", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const calls: Record<string, unknown>[] = [];
    await createRecordWithOptionalOwner(
      async (fields) => {
        calls.push(fields);
        if (CUSTOM_TECHNIQUE_USER_FIELD in fields) throw UNKNOWN_FIELD;
      },
      { Name: "키락" },
      USER_A,
    );
    expect(calls).toEqual([
      { Name: "키락", [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A },
      { Name: "키락" },
    ]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("does not retry a different create error", async () => {
    const calls: Record<string, unknown>[] = [];
    await expect(
      createRecordWithOptionalOwner(
        async (fields) => {
          calls.push(fields);
          throw { statusCode: 422, error: "INVALID_VALUE_FOR_COLUMN", message: "invalid value" };
        },
        { Name: "키락" },
        USER_A,
      ),
    ).rejects.toMatchObject({ error: "INVALID_VALUE_FOR_COLUMN" });
    expect(calls).toHaveLength(1);
  });
});

describe("deleteAccountForUser", () => {
  it("runs avatar, airtable, then auth deletion for the same user", async () => {
    const order: string[] = [];
    const result = await deleteAccountForUser(USER_A, {
      deleteAvatars: async (id) => {
        order.push(`avatar:${id}`);
      },
      deleteCustomTechniques: async (id) => {
        order.push(`airtable:${id}`);
      },
      deleteAuthUser: async (id) => {
        order.push(`auth:${id}`);
      },
    });
    expect(result).toEqual({ ok: true });
    expect(order).toEqual([`avatar:${USER_A}`, `airtable:${USER_A}`, `auth:${USER_A}`]);
  });

  it("logs partial failures and still deletes the auth user", async () => {
    const spy = silenceError();
    const auth = vi.fn(async (id: string) => {
      expect(id).toBe(USER_A);
    });
    const result = await deleteAccountForUser(USER_A, {
      deleteAvatars: async () => {
        throw new Error("storage down");
      },
      deleteCustomTechniques: async () => {
        throw new Error("airtable down");
      },
      deleteAuthUser: auth,
    });
    expect(result).toEqual({ ok: true });
    expect(auth).toHaveBeenCalledWith(USER_A);
    const logs = spy.mock.calls.map((call) => String(call[0]));
    expect(logs.some((line) => line.includes("avatar cleanup failed"))).toBe(true);
    expect(logs.some((line) => line.includes("airtable cleanup failed"))).toBe(true);
  });

  it("is idempotent when the auth user is already gone", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await deleteAccountForUser(USER_A, {
      deleteAvatars: async () => [],
      deleteCustomTechniques: async () => [],
      deleteAuthUser: async () => {
        throw { status: 404, message: "User not found" };
      },
    });
    expect(result).toEqual({ ok: true });
  });

  it("returns an error when auth deletion fails for another reason", async () => {
    silenceError();
    const result = await deleteAccountForUser(USER_A, {
      deleteAvatars: async () => [],
      deleteCustomTechniques: async () => [],
      deleteAuthUser: async () => {
        throw new Error("permission denied");
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("계정 삭제");
  });

  it("does not call cleanup for an invalid user id", async () => {
    const avatar = vi.fn();
    await expect(
      deleteAccountForUser("not-a-user", {
        deleteAvatars: avatar,
        deleteCustomTechniques: async () => undefined,
        deleteAuthUser: async () => undefined,
      }),
    ).rejects.toThrow(/invalid user id/);
    expect(avatar).not.toHaveBeenCalled();
  });
});
