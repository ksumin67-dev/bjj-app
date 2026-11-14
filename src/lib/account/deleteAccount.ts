import { assertUserId, errorMessage, isNotFoundError } from "./userScope";

export type DeleteAccountDeps = {
  deleteAvatars: (userId: string) => Promise<unknown>;
  deleteCustomTechniques: (userId: string) => Promise<unknown>;
  deleteAuthUser: (userId: string) => Promise<unknown>;
};

export type DeleteAccountOutcome = { ok: true } | { ok: false; error: string };

/**
 * 계정 삭제 순서: 아바타 → 커스텀 기술명 → auth.users.
 * 앞 단계가 실패해도 로그를 남기고 다음 단계로 간다.
 * auth 유저가 이미 없으면 성공(재시도 가능). 그 외 auth 실패만 사용자에게 돌려준다.
 * 스토리지·Airtable은 사용자 id로만 호출한다.
 */
export async function deleteAccountForUser(
  userId: string,
  deps: DeleteAccountDeps,
): Promise<DeleteAccountOutcome> {
  const id = assertUserId(userId);

  try {
    await deps.deleteAvatars(id);
  } catch (e) {
    console.error("[deleteAccount] avatar cleanup failed:", errorMessage(e));
  }

  try {
    await deps.deleteCustomTechniques(id);
  } catch (e) {
    console.error("[deleteAccount] airtable cleanup failed:", errorMessage(e));
  }

  try {
    await deps.deleteAuthUser(id);
  } catch (e) {
    if (isNotFoundError(e)) {
      console.warn("[deleteAccount] auth user already absent");
    } else {
      console.error("[deleteAccount] auth delete failed:", errorMessage(e));
      return {
        ok: false,
        error: "계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }
  }

  return { ok: true };
}
