/**
 * Supabase Auth 에러를 사용자용 한국어 문구로 변환.
 * (원문 영어 메시지를 그대로 노출하지 않기 위함)
 */
export function authErrorMessage(
  error: { message?: string; code?: string } | null | undefined,
): string {
  if (!error) return "";
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || msg.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  }
  if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
    return "이메일 인증이 아직 완료되지 않았어요. 받은 메일의 링크를 눌러주세요.";
  }
  if (code === "user_already_exists" || msg.includes("already registered")) {
    return "이미 가입된 이메일이에요. 로그인하거나 비밀번호를 재설정해 주세요.";
  }
  if (code === "weak_password" || msg.includes("password should be at least") || msg.includes("weak")) {
    return "비밀번호가 너무 짧거나 쉬워요. 6자 이상, 더 복잡하게 만들어 주세요.";
  }
  if (code === "same_password" || msg.includes("different from the old password")) {
    return "이전과 다른 비밀번호를 사용해 주세요.";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("for security purposes")
  ) {
    return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  }
  if (code === "email_address_invalid" || msg.includes("invalid format") || msg.includes("invalid email")) {
    return "이메일 형식을 확인해 주세요.";
  }
  if (code === "session_not_found" || msg.includes("auth session missing")) {
    return "링크가 만료되었거나 유효하지 않아요. 다시 요청해 주세요.";
  }
  if (code === "signup_disabled") {
    return "지금은 회원가입을 받지 않고 있어요.";
  }
  return "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
}

/** 콜백/확인 라우트가 /login?error=... 로 돌려보낸 사유 문구 */
export function authRedirectErrorMessage(reason: string | null): string | null {
  if (!reason) return null;
  if (reason === "expired") {
    return "인증 링크가 만료되었거나 이미 사용됐어요. 다시 요청해 주세요.";
  }
  return "인증을 완료하지 못했어요. 다시 시도해 주세요.";
}

/** open redirect 방지: 사이트 내부 경로(/로 시작, //·\ 제외)만 허용 */
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
