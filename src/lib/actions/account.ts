"use server";

import { deleteUserAvatarFiles, type AvatarStorage } from "@/lib/account/avatarCleanup";
import {
  deleteUserCustomTechniques,
  type CustomTechniqueTable,
} from "@/lib/account/customTechniqueCleanup";
import { deleteAccountForUser } from "@/lib/account/deleteAccount";
import { airtable } from "@/lib/airtable/client";
import { TABLES } from "@/lib/airtable/tables";
import { AVATAR_BUCKET } from "@/lib/avatars";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type DeleteAccountResult = { ok: boolean; error?: string };

function avatarStorage(admin: ReturnType<typeof createAdminClient>): AvatarStorage {
  const bucket = admin.storage.from(AVATAR_BUCKET);
  return {
    async list(folder, options) {
      const { data, error } = await bucket.list(folder, {
        limit: options.limit,
        offset: options.offset,
      });
      if (error) throw error;
      return (data ?? [])
        .filter((item) => Boolean(item.id) && Boolean(item.name) && !item.name.startsWith("."))
        .map((item) => ({ name: item.name }));
    },
    async remove(paths) {
      const { error } = await bucket.remove(paths);
      if (error) throw error;
    },
  };
}

function customTechniqueTable(): CustomTechniqueTable {
  const table = airtable(TABLES.CUSTOM_TECHNIQUES);
  return {
    select(args) {
      const query = table.select({
        filterByFormula: args.filterByFormula,
        ...(args.fields ? { fields: args.fields } : {}),
      });
      return {
        all: async () => {
          const records = await query.all();
          return records.map((record) => ({
            id: record.id,
            fields: record.fields as Record<string, unknown>,
          }));
        },
      };
    },
    async destroy(ids) {
      await table.destroy(ids);
    },
  };
}

/**
 * 계정 완전 삭제. 인앱 프로필과 /account/delete 가 같은 함수를 쓴다.
 * 아바타 파일(Storage)과 본인 커스텀 기술명(Airtable)을 지운 뒤
 * auth.users 를 삭제한다. CASCADE 로 profiles·수련·게임플랜·목표가 함께 정리된다.
 * Airtable 키와 service role 키는 이 서버 액션 안에만 둔다.
 */
export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  try {
    const admin = createAdminClient();
    const result = await deleteAccountForUser(user.id, {
      deleteAvatars: (userId) => deleteUserAvatarFiles(avatarStorage(admin), userId),
      deleteCustomTechniques: (userId) =>
        deleteUserCustomTechniques(customTechniqueTable(), userId),
      deleteAuthUser: async (userId) => {
        const { error } = await admin.auth.admin.deleteUser(userId);
        if (error) throw error;
      },
    });
    if (!result.ok) return result;
  } catch (e) {
    console.error("[deleteAccountAction] failed:", e instanceof Error ? e.message : "unknown error");
    return {
      ok: false,
      error: "계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("[deleteAccountAction] signOut failed:", e instanceof Error ? e.message : "unknown error");
  }
  return { ok: true };
}
