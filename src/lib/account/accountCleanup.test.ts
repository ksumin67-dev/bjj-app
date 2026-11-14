import { afterEach, describe, expect, it, vi } from "vitest";
import { AVATAR_LIST_PAGE, deleteUserAvatarFiles, type AvatarStorage } from "./avatarCleanup";
import {
  CUSTOM_TECHNIQUE_USER_FIELD,
  cleanupCustomTechniquesForUser,
  deleteUserCustomTechniques,
  fieldsWithTechniqueOwner,
  namesFormula,
  userScopedTechniqueFormula,
  type CustomTechniqueRow,
  type CustomTechniqueTable,
} from "./customTechniqueCleanup";
import { deleteAccountForUser } from "./deleteAccount";
import { extractCustomTechniqueNames, listOwnSessionNotes } from "./sessionNotes";
import { FIELDS } from "@/lib/airtable/tables";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const NAME_FIELD = FIELDS.CUSTOM_TECHNIQUE.NAME;

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

  it("escapes quotes in technique names", () => {
    const formula = namesFormula(["O'Brien", "O'Brien", "토네이도"]);
    expect(formula).toContain(`{${NAME_FIELD}}='O\\'Brien'`);
    expect(formula).toContain(`{${NAME_FIELD}}='토네이도'`);
    expect(formula.startsWith("OR(")).toBe(true);
    expect(formula).not.toContain(USER_B);
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
    byName?: CustomTechniqueRow[];
    legacy?: CustomTechniqueRow[];
    userError?: unknown;
    nameError?: unknown;
    destroyError?: unknown;
  }) {
    const formulas: string[] = [];
    const fieldSets: string[][] = [];
    const destroyed: string[][] = [];
    let destroyCalls = 0;
    const table: CustomTechniqueTable = {
      select(args) {
        formulas.push(args.filterByFormula);
        fieldSets.push(args.fields ?? []);
        return {
          all: async () => {
            const ownerQuery = args.filterByFormula.includes(`{${CUSTOM_TECHNIQUE_USER_FIELD}}=`);
            if (ownerQuery) {
              if (opts.userError) throw opts.userError;
              return opts.byUser ?? [];
            }
            const asksOwner = (args.fields ?? []).includes(CUSTOM_TECHNIQUE_USER_FIELD);
            if (asksOwner && opts.nameError) throw opts.nameError;
            return asksOwner ? (opts.byName ?? []) : (opts.legacy ?? []);
          },
        };
      },
      async destroy(ids) {
        destroyCalls += 1;
        destroyed.push(ids);
        if (opts.destroyError && destroyCalls === 1) throw opts.destroyError;
      },
    };
    return { table, formulas, fieldSets, destroyed };
  }

  it("deletes rows owned by this user and legacy names from their notes, not another user", async () => {
    const fake = tableFor({
      byUser: [
        { id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A } },
        { id: "rec-b", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_B } },
      ],
      byName: [
        { id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A, [NAME_FIELD]: "키락" } },
        { id: "rec-b", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_B, [NAME_FIELD]: "키락" } },
        { id: "rec-legacy", fields: { [NAME_FIELD]: "토네이도" } },
      ],
    });

    const deleted = await deleteUserCustomTechniques(fake.table, USER_A, ["키락", "토네이도", "다른사람기술"]);
    expect(fake.formulas[0]).toBe(`{${CUSTOM_TECHNIQUE_USER_FIELD}}='${USER_A}'`);
    expect(fake.formulas[0]).not.toContain(USER_B);
    expect(fake.formulas[1]).toContain("키락");
    expect(fake.formulas[1]).toContain("토네이도");
    expect(deleted).toEqual(["rec-a", "rec-legacy"]);
    expect(fake.destroyed).toEqual([["rec-a", "rec-legacy"]]);
    expect(JSON.stringify(fake.destroyed)).not.toContain("rec-b");
  });

  it("does not call destroy when nothing belongs to the user", async () => {
    const fake = tableFor({
      byUser: [],
      byName: [{ id: "rec-b", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_B } }],
    });
    await expect(deleteUserCustomTechniques(fake.table, USER_A, ["키락"])).resolves.toEqual([]);
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
    await expect(deleteUserCustomTechniques(fake.table, USER_A, [])).rejects.toThrow(
      /custom techniques cleanup failed/,
    );
    expect(fake.destroyed).toHaveLength(2);
  });

  it("treats an already-deleted record as success", async () => {
    const fake = tableFor({
      byUser: [{ id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A } }],
      destroyError: { statusCode: 404, message: "Record not found" },
    });
    await expect(deleteUserCustomTechniques(fake.table, USER_A, [])).resolves.toEqual(["rec-a"]);
  });

  it("falls back to this user's names when the owner field does not exist", async () => {
    const spy = silenceError();
    const fake = tableFor({
      userError: { error: "UNKNOWN_FIELD_NAME", message: 'Unknown field name: "User ID"' },
      nameError: { error: "UNKNOWN_FIELD_NAME", message: 'Unknown field name: "User ID"' },
      legacy: [{ id: "rec-old" }],
    });
    const deleted = await deleteUserCustomTechniques(fake.table, USER_A, ["토네이도"]);
    expect(deleted).toEqual(["rec-old"]);
    expect(spy.mock.calls.length).toBeGreaterThan(0);
    expect(fake.formulas.some((formula) => formula.includes(USER_B))).toBe(false);
  });

  it("loads notes for this user only and still deletes owned rows if notes fail", async () => {
    const notes = vi.fn(async (userId: string) => {
      expect(userId).toBe(USER_A);
      return ["[미등록: 토네이도]\n메모", null, "[미등록: 키락]"];
    });
    const fake = tableFor({
      byUser: [{ id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A } }],
      byName: [{ id: "rec-legacy", fields: { [NAME_FIELD]: "토네이도" } }],
    });
    const deleted = await cleanupCustomTechniquesForUser({
      userId: USER_A,
      table: fake.table,
      loadNotes: notes,
    });
    expect(notes).toHaveBeenCalledWith(USER_A);
    expect(fake.formulas[1]).toContain("토네이도");
    expect(fake.formulas[1]).toContain("키락");
    expect(fake.formulas[1]).not.toContain("다른사람");
    expect(deleted).toEqual(["rec-a", "rec-legacy"]);

    const spy = silenceError();
    const owned = tableFor({
      byUser: [{ id: "rec-a", fields: { [CUSTOM_TECHNIQUE_USER_FIELD]: USER_A } }],
    });
    await expect(
      cleanupCustomTechniquesForUser({
        userId: USER_A,
        table: owned.table,
        loadNotes: async () => {
          throw new Error("session read failed");
        },
      }),
    ).resolves.toEqual(["rec-a"]);
    expect(spy).toHaveBeenCalled();
    expect(owned.formulas).toHaveLength(1);
  });
});

describe("session notes", () => {
  it("reads only the custom names embedded in notes", () => {
    expect(
      extractCustomTechniqueNames([
        "[미등록: 토네이도]\n메모",
        null,
        "일반 메모",
        "[미등록:  키락 ]\n[미등록: 토네이도]",
      ]),
    ).toEqual(["토네이도", "키락"]);
  });

  it("queries training_sessions with this user id", async () => {
    const calls: Array<{ table: string; column: string; value: string; from: number; to: number }> = [];
    const supabase = {
      from(table: string) {
        return {
          select() {
            return {
              eq(column: string, value: string) {
                return {
                  async range(from: number, to: number) {
                    calls.push({ table, column, value, from, to });
                    if (from === 0) {
                      return {
                        data: [{ notes: "[미등록: 키락]" }, { notes: "[미등록: 스위프]" }],
                        error: null,
                      };
                    }
                    return { data: [{ notes: null }], error: null };
                  },
                };
              },
            };
          },
        };
      },
    };

    const notes = await listOwnSessionNotes(supabase, USER_A, 2);
    expect(notes).toEqual(["[미등록: 키락]", "[미등록: 스위프]", null]);
    expect(calls).toEqual([
      { table: "training_sessions", column: "user_id", value: USER_A, from: 0, to: 1 },
      { table: "training_sessions", column: "user_id", value: USER_A, from: 2, to: 3 },
    ]);
    expect(calls.every((call) => call.value === USER_A)).toBe(true);
  });

  it("does not query when the user id is invalid", async () => {
    const from = vi.fn();
    await expect(listOwnSessionNotes({ from }, "everyone")).rejects.toThrow(/invalid user id/);
    expect(from).not.toHaveBeenCalled();
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
