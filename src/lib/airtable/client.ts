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
export const airtable = new Airtable({
  apiKey: serverEnv.AIRTABLE_API_KEY,
}).base(serverEnv.AIRTABLE_BASE_ID);
