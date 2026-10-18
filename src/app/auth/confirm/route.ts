import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/authErrors";

/**
 * 이메일 링크(회원가입 확인 / 비밀번호 재설정) 확인 라우트.
 *
 * token_hash 방식이라 링크를 요청한 브라우저와 클릭한 브라우저가 달라도 동작한다.
 * (앱 웹뷰에서 요청 → 메일 링크는 폰의 기본 브라우저에서 열리는 경우에 필수.
 *  PKCE code 방식은 요청한 브라우저에 저장된 verifier가 필요해서 실패함.)
 *
 * Supabase 대시보드의 이메일 템플릿 링크는 아래 형식이어야 한다:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password
 */
const ALLOWED_TYPES: EmailOtpType[] = [
  "signup",
  "recovery",
  "email",
  "invite",
  "magiclink",
  "email_change",
];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // 비밀번호 재설정은 항상 재설정 화면으로, 그 외는 next(기본 홈)로
  const defaultNext = type === "recovery" ? "/auth/reset-password" : "/";
  const next = safeNextPath(searchParams.get("next"), defaultNext);

  if (tokenHash && type && ALLOWED_TYPES.includes(type)) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
