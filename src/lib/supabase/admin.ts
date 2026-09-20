import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/publicEnv";

/**
 * 관리자(service_role) 권한 Supabase 클라이언트 — RLS를 우회하므로
 * 반드시 서버 전용 코드(Server Action 등)에서만, 그리고 신중하게 사용할 것.
 * 현재 유일한 용도: 계정 삭제(auth.users 레코드 자체 삭제, ON DELETE CASCADE로
 * profiles/training_sessions/game_plans/technique_goals까지 함께 정리됨).
 *
 * SUPABASE_SERVICE_ROLE_KEY는 Supabase 대시보드 → Settings → API →
 * service_role secret에서 확인 가능. .env.local과 Vercel 프로젝트 환경변수에
 * 직접 추가할 것 (커밋 금지, NEXT_PUBLIC_ 접두사 붙이지 말 것).
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local / Vercel 환경변수를 확인하세요.",
    );
  }

  return createSupabaseClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
