# 결제(RevenueCat) 연동 + 플레이스토어 출시 가이드

2026-09-20 작성. 이미 있는 것: RevenueCat 계정. 없는 것: 구글 플레이 콘솔
개발자 계정. 아래 순서대로 진행하면 됨.

## 왜 이 순서인가

- 플레이 콘솔에 **신규 개인 계정**(2023-11-13 이후 생성)은 프로덕션(전체 공개)
  전환 전에 **테스터 12명이 14일 연속으로 참여하는 비공개 테스트**를 반드시
  거쳐야 함(2024년 12월부터 20명→12명으로 완화됨). 이 14일은 무조건 걸리는
  시간이라, "3개월 내 첫 수익" 목표라면 **가장 먼저 시작해야 하는 항목**임.
- 구독 상품(월간/연간)은 **플레이 콘솔에 빌드를 최소 한 번 업로드해야만**
  만들 수 있음(내부 테스트 트랙이면 충분, 공개 불필요).

## Phase 0 — 지금 바로 (5분)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` 환경변수를 `.env.local`과 Vercel 프로젝트
      환경변수에 추가 (Supabase 대시보드 → Settings → API → service_role
      secret). 계정 삭제 기능과 RevenueCat 웹훅이 이 키에 의존함.

## Phase 1 — 구글 플레이 콘솔 개발자 계정 생성 (오늘 시작)

- [ ] https://play.google.com/console 에서 등록 (1회성 $25)
- [ ] 개인/조직 계정 여부 선택, 본인 인증(정부 발급 ID 등) — 심사에 며칠
      걸릴 수 있음
- [ ] 앱 생성: 이름 "그래플로그", 패키지명은 이미 정해진 `com.aqua.bjjapp`
      그대로 사용

## Phase 2 — 서명된 빌드를 내부 테스트에 업로드

- [ ] `npx cap sync android` → Android Studio에서 **서명된 AAB** 생성
      (Play App Signing 사용 권장)
- [ ] Play Console → Release → Testing → **Internal testing**에 업로드
      (전 세계 공개 아님, 추가한 테스터에게만 보임)
- [ ] 이 빌드가 있어야 다음 단계(구독 상품 생성)가 가능해짐

## Phase 3 — 비공개 테스트 트랙 시작 (14일 카운트다운 시작)

- [ ] Release → Testing → **Closed testing**로 승격, 테스터 12명 이상 옵트인
      (친구/지인 이메일로 충분, 실제로 써볼 필요는 없고 옵트인 상태 유지가
      중요)
- [ ] 여기서부터 14일 연속 유지 → 이후 프로덕션(전체 공개) 신청 가능해짐
- [ ] **이 단계는 다른 Phase와 동시에 진행 가능** — 기다리는 동안 아래 결제
      연동 작업을 병행할 것

## Phase 4 — 구독 상품 만들기 (Play Console)

- [ ] Monetize with Play → Products → **Subscriptions**
- [ ] Base plan 2개 생성: 월간(₩6,900), 연간(₩49,000) — 이미 `/upgrade`
      페이지에 표시해둔 가격과 동일하게
- [ ] 연간 base plan에 **7일 무료체험 offer** 추가
- [ ] 상품을 Active로 전환

## Phase 5 — RevenueCat ↔ Play Console 연동

이 부분이 가장 손이 많이 감. Google Cloud Console 작업 포함.

- [ ] Google Cloud Console에서 프로젝트 선택/생성 후 3개 API 활성화:
      Google Play Android Developer API, Google Play Developer Reporting
      API, **Cloud Pub/Sub API** (Pub/Sub을 빼먹으면 나중에 에러남)
- [ ] IAM & Admin → Service Accounts → 서비스 계정 생성, 역할 부여:
      **Pub/Sub Admin**, **Monitoring Viewer**
- [ ] 해당 서비스 계정의 Keys → Add Key → JSON 다운로드
- [ ] Play Console → Users and permissions → 방금 만든 서비스 계정 이메일
      초대 → 권한: "재무 데이터/주문내역/취소 열람" + "구독·주문 관리" 체크
- [ ] RevenueCat 대시보드 → 앱 설정 → Service credentials (Google Play)에
      JSON 업로드 → Validate Credentials
- [ ] ⚠️ 권한 전파에 **최대 24~36시간** 걸릴 수 있음. "Invalid credentials"
      떠도 재설정하지 말고 하루 기다렸다가 다시 확인

## Phase 6 — RevenueCat 상품 구성

- [ ] Product Catalog → Products → Import Products (Play Console 구독이
      자동으로 들어옴)
- [ ] Entitlements → New Entitlement → 식별자 `premium` 생성 → 방금 가져온
      상품 연결(Attach)
- [ ] Offerings → 기본 `default` Offering에 Package 2개(monthly, annual)
      추가, 각각 대응하는 상품 연결

## Phase 7 — 코드 연동 (나와 함께, 로컬에서 1번만)

- [ ] 로컬에서 실행: `pnpm add @revenuecat/purchases-capacitor && npx cap sync android`
- [ ] 완료되면 알려주기 — `/upgrade` 페이지에 실제 구매 버튼과 SDK 초기화
      코드를 마저 붙일 것 (지금은 웹훅만 완성된 상태)
- [ ] 환경변수 추가 (Vercel + `.env.local`):
  - `NEXT_PUBLIC_REVENUECAT_API_KEY` — RevenueCat 대시보드 → API Keys →
    Google Play Store 앱의 **Public API key**
  - `REVENUECAT_WEBHOOK_SECRET` — 아무 임의 문자열(예: 32자 랜덤 문자열),
    RevenueCat 웹훅 설정에도 동일 값 입력
- [ ] RevenueCat 대시보드 → Project settings → Integrations → Webhooks →
      URL `https://<배포 도메인>/api/webhooks/revenuecat` 등록, Authorization
      header에 `REVENUECAT_WEBHOOK_SECRET` 값 입력 (이미 구현된
      `src/app/api/webhooks/revenuecat/route.ts`가 이 값을 검증함)

## Phase 8 — 테스트 (= 할 일 #9 실기기 테스트와 결합)

- [ ] Play Console → Settings → License testing에 본인 구글 계정 추가,
      응답을 RESPOND_NORMALLY로 설정
- [ ] **실제 안드로이드 기기**에서 앱 설치 후 구매 시도 → "Test order"로
      표시되고 실제 결제는 안 됨 (에뮬레이터에서는 라이선스 테스트가 안
      되니 반드시 실기기 필요)
- [ ] 빠르게 로직만 먼저 확인하고 싶으면 계정 셋업 없이도 **RevenueCat Test
      Store**로 구매 성공/실패/취소 시나리오를 먼저 검증 가능 (Phase 1~6 기다리는
      동안 바로 시작 가능)

## 참고 링크

- [RevenueCat Google Play 연동 코드랩](https://revenuecat.github.io/codelabs/google-play.html)
- [Google Play 서비스 계정 생성 가이드](https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials)
- [신규 개인 계정 테스트 요건 안내](https://support.google.com/googleplay/android-developer/answer/14151465)
