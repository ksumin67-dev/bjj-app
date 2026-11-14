import { assertUserId, CleanupPartialError, isNotFoundError } from "./userScope";

export const AVATAR_LIST_PAGE = 100;
const MAX_AVATAR_PAGES = 50;

export type AvatarListItem = { name: string };

export type AvatarStorage = {
  list: (
    folder: string,
    options: { limit: number; offset: number },
  ) => Promise<AvatarListItem[]>;
  remove: (paths: string[]) => Promise<unknown>;
};

/**
 * 버킷 루트가 아니라 `{userId}/파일명`만 지운다.
 * 폴더 목록에 다른 경로가 섞여 들어와도 거절한다.
 */
export function ownedAvatarPath(userId: string, name: string): string | null {
  const id = assertUserId(userId);
  if (!name || name.startsWith(".")) return null;
  if (name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  return `${id}/${name}`;
}

/**
 * avatars 버킷에서 이 사용자 폴더만 비운다.
 * 없거나 이미 지워진 파일은 성공. 일부 배치가 실패해도 남은 배치는 계속한다.
 */
export async function deleteUserAvatarFiles(
  storage: AvatarStorage,
  userId: string,
): Promise<string[]> {
  const id = assertUserId(userId);
  const removed: string[] = [];
  const failures: unknown[] = [];
  let offset = 0;

  for (let pageIndex = 0; pageIndex < MAX_AVATAR_PAGES; pageIndex += 1) {
    let page: AvatarListItem[];
    try {
      page = await storage.list(id, { limit: AVATAR_LIST_PAGE, offset });
    } catch (e) {
      failures.push(e);
      break;
    }

    if (page.length === 0) break;

    const paths: string[] = [];
    for (const item of page) {
      const path = ownedAvatarPath(id, item.name);
      if (!path) {
        console.error("[deleteAccount] skipped avatar outside user folder");
        continue;
      }
      paths.push(path);
    }

    if (paths.length > 0) {
      try {
        await storage.remove(paths);
        removed.push(...paths);
      } catch (e) {
        if (!isNotFoundError(e)) failures.push(e);
      }
    }

    if (page.length < AVATAR_LIST_PAGE) break;
    offset += page.length;
    if (pageIndex === MAX_AVATAR_PAGES - 1) {
      failures.push(new Error("avatar list exceeded page cap"));
    }
  }

  if (failures.length > 0) {
    throw new CleanupPartialError("avatar", failures[0]);
  }
  return removed;
}
