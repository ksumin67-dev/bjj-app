import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/publicEnv";

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ["/login", "/auth/callback"];
// 가입 직후 온보딩(벨트/주간 목표/선호 스타일 설정) 경로 — 이메일 가입/구글
// 로그인 어느 쪽으로 들어와도 여기서 한 번에 처리하기 위해 미들웨어에서 확인.
const ONBOARDING_PATH = "/onboarding";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 로그인은 했지만 온보딩을 안 끝낸 사용자는 어느 화면에 들어오든
  // 온보딩부터 보여줌 (이메일 가입/구글 로그인 둘 다 여기서 커버됨).
  if (
    user &&
    !isPublicPath &&
    !request.nextUrl.pathname.startsWith(ONBOARDING_PATH)
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile && profile.onboarding_completed === false) {
      const url = request.nextUrl.clone();
      url.pathname = ONBOARDING_PATH;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
