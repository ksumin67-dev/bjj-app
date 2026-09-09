import { z } from "zod";

/**
 * 클라이언트(브라우저)에서도 안전하게 쓸 수 있는 공개 환경변수.
 * 절대 `env.ts`(서버 전용)와 같은 파일에 두지 말 것 —
 * 그러면 "use client" 컴포넌트가 이 값을 import할 때 서버 전용 가드까지
 * 함께 번들되어 브라우저에서 즉시 throw되는 버그가 생김 (2026-07-31 발견/수정).
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("bjj-app"),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_URL 누락")
    .url("NEXT_PUBLIC_SUPABASE_URL은 유효한 URL이어야 합니다"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 누락"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
