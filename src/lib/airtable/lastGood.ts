export type CatalogLog = (
  level: "error" | "warn",
  message: string,
  error?: unknown,
) => void;

const processMemory = new Map<string, unknown>();

const defaultLog: CatalogLog = (level, message, error) => {
  if (level === "error") console.error(message, error);
  else console.warn(message);
};

/**
 * 성공한 값만 기억한다. 실패한 호출은 저장하지 않고, 이전에 성공한 값이
 * 있으면 그 값을 돌려준다. 한 번도 성공한 적이 없으면 에러를 다시 던진다.
 */
export async function readWithLastGood<T>(
  key: string,
  load: () => Promise<T>,
  memory: Map<string, T> = processMemory as Map<string, T>,
  log: CatalogLog = defaultLog,
): Promise<T> {
  try {
    const value = await load();
    memory.set(key, value);
    return value;
  } catch (error) {
    log("error", `[airtable] ${key} 조회 실패`, error);
    if (memory.has(key)) {
      log("warn", `[airtable] ${key} 조회에 실패해 마지막 성공 캐시를 사용합니다`);
      return memory.get(key) as T;
    }
    throw error;
  }
}
