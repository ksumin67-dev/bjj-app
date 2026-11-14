/**
 * 인앱 결제(RevenueCat) 화면 스위치.
 *
 * Android 무료 출시에서는 기본으로 꺼져 있다.
 * 다음 버전에서 결제를 다시 켤 때는 환경변수만 true로 바꾸면 된다.
 *
 *   NEXT_PUBLIC_PAYMENTS_ENABLED=true
 *
 * "true"가 아니면(미설정 포함) 항상 꺼짐.
 * 꺼져 있을 때 /upgrade 는 홈으로 보내고, 이용약관의 유료 구독 문장은
 * 렌더하지 않는다.
 *
 * 웹훅 라우트(src/app/api/webhooks/revenuecat)와
 * profiles.subscription_status / isPremium 계산은 이 플래그와 무관하게 유지한다.
 * 아직 화면에서 구독 상태를 보여 주거나 기능을 잠그지 않는다.
 */
export const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
