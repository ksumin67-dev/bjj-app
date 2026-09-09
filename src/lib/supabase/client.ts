import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/publicEnv";

/**
 * 브라우저(Client Component)에서 사용하는 Supabase 클라이언트.
 * publishable key는 공개되어도 안전한 키 (RLS로 데이터 보호됨).
 */
export function createClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
