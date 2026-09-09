import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 구글 소셜 로그인 등 OAuth 리다이렉트 후 세션 교환을 처리하는 라우트
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
