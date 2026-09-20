import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * RevenueCat 웹훅 수신 엔드포인트.
 * RevenueCat 대시보드 → Project settings → Integrations → Webhooks에서
 * 이 URL(https://<도메인>/api/webhooks/revenuecat)을 등록하고,
 * "Authorization header value"에 REVENUECAT_WEBHOOK_SECRET과 동일한 값을 넣을 것.
 *
 * app_user_id는 반드시 Supabase auth 유저의 id(uuid)로 맞춰서 RevenueCat SDK를
 * 초기화해야 함 (Purchases.configure({ appUserID: supabaseUserId })) — 그래야
 * 여기서 profiles.id와 매칭 가능.
 */

type RevenueCatEvent = {
  type: string;
  app_user_id: string;
  period_type?: "TRIAL" | "INTRO" | "NORMAL";
};

// 구독을 "활성"으로 보는 이벤트
const ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "NON_RENEWING_PURCHASE",
]);

// 구독 종료로 보는 이벤트 (CANCELLATION은 자동갱신만 끈 상태라 즉시 만료 아님 — 제외)
const EXPIRED_EVENTS = new Set(["EXPIRATION"]);

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.REVENUECAT_WEBHOOK_SECRET;

  if (!expected) {
    console.error("[revenuecat webhook] REVENUECAT_WEBHOOK_SECRET 미설정");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${expected}` && authHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { event?: RevenueCatEvent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const event = body.event;
  if (!event?.type || !event?.app_user_id) {
    return NextResponse.json({ ok: true }); // TEST 이벤트 등 — 조용히 200
  }

  let nextStatus: "active" | "trialing" | "expired" | null = null;
  if (ACTIVE_EVENTS.has(event.type)) {
    nextStatus = event.period_type === "TRIAL" ? "trialing" : "active";
  } else if (EXPIRED_EVENTS.has(event.type)) {
    nextStatus = "expired";
  }

  if (nextStatus) {
    try {
      const admin = createAdminClient();
      const { error } = await admin
        .from("profiles")
        .update({ subscription_status: nextStatus })
        .eq("id", event.app_user_id);
      if (error) throw error;
    } catch (e) {
      console.error("[revenuecat webhook] profiles 업데이트 실패:", e);
      // RevenueCat이 재시도하도록 5xx 반환
      return NextResponse.json({ error: "db update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
