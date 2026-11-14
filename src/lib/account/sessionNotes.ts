import { assertUserId } from "./userScope";

const PAGE_SIZE_DEFAULT = 1000;

export type SessionNotesClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        range: (
          from: number,
          to: number,
        ) => PromiseLike<{
          data: Array<{ notes: string | null }> | null;
          error: { message?: string } | null;
        }>;
      };
    };
  };
};

/** 수련 메모에 남은 `[미등록: 이름]`만 모은다. 순서는 처음 나온 순. */
export function extractCustomTechniqueNames(notes: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const note of notes) {
    if (!note) continue;
    for (const match of note.matchAll(/\[미등록:\s*([^\]]+)\]/g)) {
      const name = (match[1] ?? "").trim().replace(/\s+/g, " ");
      if (!name || name.length > 80) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(name);
      if (names.length >= 100) return names;
    }
  }
  return names;
}

/**
 * 서비스 롤로 읽더라도 user_id 조건은 코드에 고정한다.
 * 조건 없이 전체 메모를 읽으면 다른 사용자의 기술명이 삭제 대상이 된다.
 */
export async function listOwnSessionNotes(
  supabase: SessionNotesClient,
  userId: string,
  pageSize = PAGE_SIZE_DEFAULT,
): Promise<Array<string | null>> {
  const id = assertUserId(userId);
  const size = Math.min(Math.max(pageSize, 1), PAGE_SIZE_DEFAULT);
  const notes: Array<string | null> = [];

  for (let from = 0; ; from += size) {
    const { data, error } = await supabase
      .from("training_sessions")
      .select("notes")
      .eq("user_id", id)
      .range(from, from + size - 1);
    if (error) throw error;
    const rows = data ?? [];
    for (const row of rows) notes.push(row.notes ?? null);
    if (rows.length < size) break;
  }

  return notes;
}
