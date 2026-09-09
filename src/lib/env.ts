import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  AIRTABLE_API_KEY: z
    .string()
    .min(1, "AIRTABLE_API_KEY 누락")
    .startsWith("pat", "AIRTABLE_API_KEY는 'pat'로 시작해야 합니다"),
  AIRTABLE_BASE_ID: z
    .string()
    .min(1, "AIRTABLE_BASE_ID 누락")
    .startsWith("app", "AIRTABLE_BASE_ID는 'app'로 시작해야 합니다"),
});

/**
 * 서버 전용 환경변수 (Airtable 등 비밀 키).
 * "server-only" 패키지가 클라이언트 번들에 섞이면 빌드 타임에러를 내줌.
 * 공개 환경변수(NEXT_PUBLIC_*)는 반드시 `publicEnv.ts`에서 가져올 것 —
 * 이 파일에 섞지 말 것 (클라이언트 컴포넌트에서 못 쓰게 됨).
 */
export const serverEnv = serverEnvSchema.parse({
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
});
