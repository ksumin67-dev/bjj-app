import "server-only";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/adminConfig";

/**
 * 서버 액션 안에서 관리자인지 확인한다.
 * 미들웨어는 /admin 페이지 이동만 막을 뿐, 서버 액션은 별도 요청으로 직접 호출될 수 있어서
 * 마스터 데이터(Airtable)를 바꾸는 액션은 반드시 여기서 한 번 더 확인해야 한다.
 * 이메일이 인증된 계정만 관리자로 인정한다.
 */
export async function requireAdmin(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL || !user.email_confirmed_at) {
    throw new Error("FORBIDDEN");
  }
}
