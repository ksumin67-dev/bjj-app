import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/authErrors";

// 구글 소셜 로그인 등 OAuth 리다이렉트 후 세션 교환을 처리하는 라우트
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 외부 사이트로 보내는 open redirect를 막기 위해 내부 경로만 허용
  const next = safeNextPath(searchParams.get("next"), "/");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
