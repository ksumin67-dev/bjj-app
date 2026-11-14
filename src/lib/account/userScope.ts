const USER_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Supabase auth user id. 포뮬러·스토리지 경로에 넣기 전에 형식만 통과시킨다. */
export function assertUserId(userId: string): string {
  const id = userId.trim();
  if (!USER_ID_RE.test(id)) {
    throw new Error("invalid user id");
  }
  return id;
}

export function isUserId(userId: string | null | undefined): userId is string {
  return typeof userId === "string" && USER_ID_RE.test(userId.trim());
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "";
}

/** 이미 지워진 유저·파일·레코드. 재시도는 성공으로 본다. */
export function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { status?: number; statusCode?: number; code?: string; message?: string };
  const status = Number(e.status ?? e.statusCode);
  if (status === 404) return true;
  const code = (e.code ?? "").toLowerCase();
  if (code === "user_not_found" || code === "not_found") return true;
  const msg = errorMessage(error).toLowerCase();
  return msg.includes("not found") || msg.includes("does not exist");
}

/**
 * Airtable이 아직 없는 필드명을 거부할 때.
 * 에러 원문 객체는 요청 헤더를 포함할 수 있어 여기서는 메시지만 본다.
 */
export function isUnknownAirtableField(error: unknown): boolean {
  const msg = errorMessage(error).toLowerCase();
  if (msg.includes("unknown_field") || msg.includes("unknown field")) return true;
  const code =
    error && typeof error === "object" && "error" in error
      ? String((error as { error: unknown }).error).toLowerCase()
      : "";
  return code.includes("unknown_field");
}

export class CleanupPartialError extends Error {
  constructor(step: string, cause: unknown) {
    super(`${step} cleanup failed: ${errorMessage(cause) || "unknown error"}`);
    this.name = "CleanupPartialError";
  }
}
