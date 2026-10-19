import "server-only";
import Airtable from "airtable";
import { serverEnv } from "@/lib/env";

/**
 * Airtable 클라이언트.
 * 서버 전용 — 'server-only' import로 클라이언트 번들 진입 차단.
 *
 * 사용 예:
 *   import { airtable } from "@/lib/airtable/client";
 *   const records = await airtable(TABLES.POSITIONS).select().all();
 */
// requestTimeout: SDK 기본값이 5분이라 Airtable 지연 시 페이지가 300초간 멈췄다가
// Vercel 타임아웃이 났음(2026-10-19 확인). 15초로 줄여 빨리 에러 화면(다시 시도)으로 넘긴다.
export const airtable = new Airtable({
  apiKey: serverEnv.AIRTABLE_API_KEY,
  requestTimeout: 15_000,
}).base(serverEnv.AIRTABLE_BASE_ID);
