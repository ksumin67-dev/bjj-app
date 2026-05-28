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

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("bjj-app"),
});

/**
 * 서버 전용 환경변수.
 * 클라이언트 컴포넌트에서 import하면 빌드 타임 에러를 내도록 의도된 사용.
 */
export const serverEnv = (() => {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv는 서버 측에서만 사용 가능합니다.");
  }
  return serverEnvSchema.parse({
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  });
})();

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});
