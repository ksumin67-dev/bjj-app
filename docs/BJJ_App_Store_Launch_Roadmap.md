# BJJ 스킬트리 앱 — 앱스토어 유료 출시 로드맵

> 작성일: 2026-07-31
> 목표: Google Play + Apple App Store 정식 출시, 멀티유저 유료 서비스
> 참고: `docs/BJJ_App_Session_Handoff_v4.md`는 코드/기능 히스토리용. 이 문서는 "출시"에 필요한 것만 다룸.

---

## 0. 지금 상태 요약 (2026-07-31 밤 기준, Phase 1 완료 후)

- **스택**: Next.js 14 + TypeScript + Tailwind
- **데이터**: 하이브리드 — Techniques/기술 콘텐츠는 Airtable(`appkUqBmwhAK9F8AX`) 유지, 유저 데이터(profiles/training_sessions/sequences)는 **Supabase Postgres**(`smgunmjpddcfgohmuawb`, ap-northeast-2)로 전환 완료
- **인증**: ✅ Supabase Auth (이메일/비밀번호 + 구글 소셜 로그인), 미들웨어로 비로그인 접근 차단
- **배포**: Vercel `bjj-app-brown.vercel.app`, GitHub main 자동배포 연결됨 (Ready 상태)
- **본인 계정**: `ksumin67@gmail.com`으로 가입, 기존 Airtable 개인 데이터(벨트 Purple Belt, 수련기록 3건) Supabase로 마이그레이션 완료
- **연동 도구**: 이 Cowork 세션에 **Supabase MCP 연결됨** → 다음 세션에서도 이미 연결되어 있으면 바로 DB 조회/쿼리 가능 (재연결 필요시 사용자가 다시 Connect)
- **네이티브 래핑**: 아직 없음. PWA manifest + 아이콘만 존재 (Phase 3에서 진행 예정)

## 1. 핵심 블로커 — 왜 지금 상태로는 스토어에 못 올리나

1. ~~**1인용 구조**~~ — ✅ 2026-07-31 해결됨 (Supabase Auth + 유저별 데이터 분리 완료)
2. ~~**Airtable은 멀티유저 프로덕션 DB로 부적합**~~ — ✅ 유저 데이터는 Supabase로 이전해서 해결. Techniques 콘텐츠는 계속 Airtable(트래픽 적어서 문제없음)
3. **결제 없음** ← 지금 여기 (Phase 2, RevenueCat 예정)
4. **네이티브 셸 없음**: 애플은 PWA만으로는 앱스토어 등록이 사실상 불가능(리젝 위험 매우 높음). 안드로이드는 PWA→TWA로 비교적 쉽게 됨. (Phase 3 예정)

---

## 2. 단계별 로드맵

### Phase 1 — 인증 + 데이터 구조 전환 ✅ 완료 (2026-07-31)

- [x] **인증 도입**: Supabase Auth (이메일/비밀번호 + 구글 소셜 로그인)
- [x] **데이터 재설계 (하이브리드)**:
  - Techniques/Sequences 마스터 콘텐츠 → Airtable 유지
  - UserProfile / TrainingSessions / Sequences(개인) → **Supabase Postgres로 이전 완료** (RLS 적용)
- [x] `src/lib/actions/*.ts` 및 관련 13개 파일 리팩터링 완료
- [x] 기존 개인 데이터(본인 기록 3건, 프로필) 마이그레이션 + 라이브 검증 완료

**실제 소요**: 하루 (예상 2~3주 대비 대폭 단축)

### Phase 2 — 결제

- [ ] **웹 결제(Stripe)** 먼저 붙이기 → 스토어 심사 기다릴 필요 없이 여기서 바로 첫 매출 가능
- [ ] 모바일 앱 결제는 애플/구글 정책상 **인앱결제(IAP) 강제** (디지털 구독 성격이면 Stripe 직접결제 불가) → RevenueCat 같은 IAP 관리 서비스 고려

### Phase 3 — 네이티브 패키징 (2026-09-10 시작, Android 진행 중)

- [x] Capacitor 설치 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/local-notifications`, `@capacitor/splash-screen`, `@capacitor/status-bar`)
- [x] `capacitor.config.ts` 작성 — `server.url`을 라이브 URL(`https://bjj-app-brown.vercel.app`)로 설정해 원격 로드 (Next.js 코드 변경 없음)
- [x] `npx cap add android`로 `android/` 네이티브 프로젝트 생성 완료
- [x] Android Studio(Quail 3, Gradle JVM 21)에서 Gradle sync 성공, Pixel 8 / API 35 에뮬레이터 생성
- [x] **에뮬레이터에서 앱 최초 실행 성공** — 웹뷰 안에서 라이브 사이트가 정상 로드됨
- [x] **에뮬레이터 안에서 구글 로그인까지 정상 작동 확인** (네이티브 셸 안에서 OAuth 완주됨)
- [x] 앱 아이콘/스플래시 재작업: 기존 512px PWA 아이콘의 "스킬트리" 한글 텍스트가 폰트 미스매치로 깨져있던 버그(□□□□) 발견 → "BJJ" 링 로고 단독 디자인으로 재제작(`assets/icon.png`, `icon-foreground.png`, `icon-background.png`, `splash.png`), `@capacitor/assets generate --android`로 전체 해상도(mdpi~xxxhdpi) 자동 생성 완료
- [ ] **iOS**: Capacitor는 코드베이스에 이미 iOS 대응 준비되어 있음(`@capacitor/ios`만 추가하면 됨) — 그러나 Apple Developer Program 가입 전까지는 실기기/TestFlight 테스트 불가, Phase 4와 함께 진행 예정
- [ ] 로컬 알림(수련 리마인더) 기능 구현 — `@capacitor/local-notifications` 패키지는 설치돼 있으나 실제 알림 스케줄링 로직은 아직 미구현
- [ ] 실기기(에뮬레이터 아닌 본인 폰)에서 최종 테스트

### Phase 4 — 스토어 심사 준비물

- [ ] 개인정보처리방침 페이지 (필수, 결제+계정 있으면 100% 요구됨)
- [ ] 스토어 스크린샷 세트, 앱 설명, 카테고리(스포츠/건강)
- [ ] Google Play 개발자 계정 ($25 1회) / Apple Developer Program ($99/년)
- [ ] 심사 제출 → 통상 Android 수 시간~1일, iOS 1~3일 (리젝 시 반복)

### Phase 5 — 출시 후

- [ ] 버그 트래킹, 실사용자 피드백 반영
- [ ] 스토어 최적화(ASO), 초기 유저 확보 채널 (BJJ 커뮤니티, 인스타/유튜브 등 본인 관심사와 연결)

---

## 3. 결정: 앱 우선 트랙 (2026-07-31)

웹(Stripe)을 먼저 열지 않고 **앱스토어 출시를 바로 목표로 진행**하기로 결정. iOS 심사/IAP 세팅 오버헤드가 있어 3개월 목표(10월 말)는 빠듯하지만, 아래 일정대로면 9월 말 제출 → 10월 초중 출시가 현실적 목표.

## 4. 배포 현황 확인됨 (2026-07-31, Vercel 스크린샷 기준)

- **이미 라이브 상태**: Production Deployment `Ready`
- 도메인: `bjj-app-brown.vercel.app` (자동 발급 vercel.app 도메인, 커스텀 도메인 미연결)
- GitHub `main` 브랜치 push → 자동 배포 연결됨 (마지막: 6/2 커밋 4b747f2)
- Function Invocations 1회, Edge Requests 0 → **사실상 아무도 안 들어와 봄** (본인 로컬 개발 서버로만 써온 것으로 보임)
- Push Notifications, Web Analytics, Speed Insights 등 아직 미설정 (Production Checklist 1/5)

→ 인프라 자체는 살아있으니 새로 배포할 필요 없음. Phase 3 네이티브 래핑 시 이 URL(또는 커스텀 도메인)을 그대로 앱 안에서 로드하면 됨.

## 5. 네이티브 패키징 방식 — Capacitor + Remote URL

이 앱은 Server Actions를 전면적으로 씀 (`src/lib/actions/*.ts`) → 정적 export 불가능. 따라서:

- **Capacitor**로 iOS/Android 네이티브 셸을 만들고, `server.url`을 Vercel 라이브 URL로 설정해 원격 로드하는 방식 채택 (Next.js 코드 리팩터링 불필요, 서버는 계속 Vercel에서 돌림)
- 단, Apple 심사 가이드라인 4.2(최소 기능)를 통과하려면 **순수 웹뷰 느낌을 벗어나야 함** → 최소한 다음 네이티브 기능 포함 권장:
  - 로컬/푸시 알림 (수련 리마인더 — 기능적으로도 유용함)
  - 네이티브 스플래시 스크린 + 상태바 테마
  - 오프라인 캐시(기본 셸이라도)

## 6.1 RevenueCat 앱 등록 시도 결과 (2026-08-01, 실측)

- 프로젝트 "bjj" 생성 완료
- **App name**: `BJJ 스킬트리`, **Bundle ID / Package name**: `com.aqua.bjjapp` (iOS/Android 공통, 확정)
- **iOS(App Store) 앱 등록은 막힘** ⚠️ — "In-app purchase key configuration"에서 App Store Connect의 P8 키/Key ID/Issuer ID를 **필수**로 요구함. 이건 애플 개발자 프로그램($99/년) 가입 후 App Store Connect에서만 발급 가능 → **Phase 4(애플 개발자 계정 가입)까지 iOS 앱 등록 자체가 불가능**. 실제로 저장 시도 시 "This field is required" / "This field needs to be a valid UUID" 검증 에러로 막힘.
- **Android(Google Play) 앱 등록은 성공** ✅ — 서비스 계정 credentials 없이도 저장됨. App ID `appfde35561e2`, Bundle ID `com.aqua.bjjapp`, Public API Key 발급 완료.
- **결론**: iOS는 Phase 4(애플 개발자 계정 가입)까지 보류, **Android부터 먼저 SDK 연동 진행**. iOS 앱 등록 마무리도 Phase 4로 이관.

## 6.2 구독 규칙 확정 (2026-08-01)

- **모델**: 프리미엄(freemium) — 기본 기능 무료, 심화 콘텐츠만 유료
  - 무료: 스킬트리 열람, 캘린더/수련 기록, 시퀀스 기본 사용
  - 유료(Entitlement `premium`): 기술 상세의 7개 심화 필드(그립/체형/핵심포인트/실전팁/흔한실수/카운터), 이후 통계(`/stats`) 페이지, 무제한 시퀀스 저장
- **가격**: 월 6,900원 / 연 49,000원 (월환산 약 4,083원, 약 41% 할인)
- **무료체험**: 7일, 카드 등록 필요(opt-out 방식 — 트라이얼→유료 전환율이 카드 미등록 방식보다 훨씬 높음)
- **페이월 노출 시점**: 가입 직후 바로 X. 앱을 한 번 써본 뒤(스킬트리 진입 등) 심화 콘텐츠 마주칠 때 자연스럽게 노출
- **코드 반영 완료 (2026-08-01)**: `profiles.subscription_status` 컬럼 추가(마이그레이션 `add_subscription_status_to_profiles`), `src/lib/supabase/userProfile.ts`에 `isPremium` 계산 필드 추가, 기술 상세 페이지(`/tree/[positionId]/[techId]`) 심화 정보 섹션 게이팅 완료, `/upgrade` 안내 스텁 페이지 생성 완료. 본인 계정(`ksumin67@gmail.com`)은 `subscription_status='active'`로 수동 설정해서 계속 전체 열람 가능. `tsc --noEmit` 통과 확인.
- **Phase 2 완료 (2026-09-09)** ✅ — Entitlement 식별자는 `premium`이 아니라 **`bjj_pro`로 최종 확정** (2026-09-01에 이미 만들어져 있던 걸 발견, 표준으로 채택. 코드의 `isPremium` 개념과는 별개 — Supabase `subscription_status` 컬럼은 계속 내부 플래그로 사용, RevenueCat 웹훅 연동 시 `bjj_pro` entitlement 여부를 이 컬럼에 반영할 예정). `bjj_pro`에 **Monthly/Yearly** 상품 연결(Test Store, 테스트용 USD $9.99/$79.99 — 실제 원화 가격/7일 무료체험은 **Phase 4에서 Play Console 실상품 만들 때 설정** 예정). `Lifetime` 상품은 detach해서 2종 구조로 정리.
- **RevenueCat 앱/키**: Android 앱 등록 완료 (Bundle ID `com.aqua.bjjapp`, Public API Key는 `.env.local`의 `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY`). iOS 앱 등록은 Phase 4(애플 개발자 계정)까지 보류.
- **다음: Phase 3 — 네이티브 패키징(Capacitor)** 시작

## 6. 결제 — RevenueCat 우선

앱 안에서 구독을 팔면 Apple/Google 정책상 인앱결제(IAP) 강제 적용 → **RevenueCat**으로 iOS/Android IAP를 한 번에 통합 관리하는 게 표준 루트. (참고: 한국은 앱마켓 외부결제를 병행 허용하는 나라라 이후 수수료 절감 목적으로 대체 결제 붙일 수 있지만, 초기엔 세팅 복잡도 낮추기 위해 RevenueCat 표준 IAP로 시작 권장)

---

## 7. 실행 일정 (앱 우선 트랙, 2026-07-31 시작 기준)

| 주차 | 기간 | Phase | 할 일 |
|---|---|---|---|
| W1 | 8/1~8/7 | Phase 1 | Supabase 프로젝트 생성, Auth(**이메일/비밀번호 + 구글 소셜 로그인** 확정, 2026-07-31) 세팅, 유저 데이터 스키마 설계(UserProfile/TrainingSessions/Sequences 진행분) |
| W2 | 8/8~8/14 | Phase 1 | `src/lib/actions/userProfile.ts`, `trainingSessions.ts`, `progress.ts` Supabase 연동 리팩터링 |
| W3 | 8/15~8/21 | Phase 1 | 로그인 게이트(미들웨어), 기존 본인 데이터 첫 계정으로 마이그레이션, 라이브 검증 |
| W4 | 8/22~8/28 | Phase 2 | RevenueCat 계정/앱 등록, 구독 플랜·가격 설계, 구독 상태로 기능 게이팅 로직 |
| W5 | 8/29~9/4 | Phase 3 | Capacitor 설치, iOS/Android 프로젝트 생성, remote URL 연결, 앱 아이콘/스플래시, 로컬 알림(수련 리마인더) 추가 |
| W6 | 9/5~9/11 | Phase 4 | Apple Developer Program 가입($99/년), Google Play 개발자 계정($25), 개인정보처리방침 페이지, 스크린샷/설명문구 |
| W7 | 9/12~9/18 | 테스트 | TestFlight 내부 테스트, Google Play 내부 테스트 트랙, 버그 수정 |
| W8 | 9/19~9/25 | Phase 5 | 스토어 심사 제출 (Android 먼저 — 심사 빠름, iOS 동시) |
| W9 | 9/26~10/2 | 버퍼 | 리젝 대응/재제출 버퍼 |
| 목표 | 10월 초~중 | 출시 | 스토어 출시 + 첫 유료 전환 |

**당장 이번 주(W1) 투두**:
- [x] Supabase 프로젝트 생성 (2026-07-31, 프로젝트 URL/publishable key 전달받음)
- [x] Auth 방식 결정 — 이메일/비밀번호 + 구글 소셜 로그인
- [x] 유저별로 분리해야 할 테이블 확정 및 스키마 작성 → `docs/supabase_schema.sql`
- [x] Supabase client/server 헬퍼, 로그인 페이지(`/login`), OAuth 콜백, 인증 미들웨어 코드 작성 완료
- [x] **아쿠아 님 할 일 ①**: `docs/supabase_schema.sql` 실행 완료 (profiles/training_sessions/sequences 테이블 + RLS 생성됨, Supabase MCP로 확인)
- [x] **아쿠아 님 할 일 ②**: Google OAuth 클라이언트 생성 + Supabase Provider 등록 완료 (2026-07-31)
- [x] **아쿠아 님 할 일 ③**: `pnpm install` + `pnpm dev`로 `/login` 페이지 정상 동작 확인 완료 (2026-07-31, 중간에 발견된 blank-screen 버그도 수정 완료 — 부록 9번 참고)
- [x] **다음 단계 완료 (2026-07-31)**: `userProfile`/`trainingSessions`/`sequences`를 Airtable → Supabase로 완전 전환. `src/lib/supabase/{userProfile,trainingSessions,sequences}.ts` 신규 작성, 13개 파일의 import 경로 교체, 옛 `src/lib/airtable/{userProfile,trainingSessions,sequences}.ts` 삭제. `tsc --noEmit` 통과 확인.
- [x] **데이터 마이그레이션 완료 (2026-07-31)**: Supabase MCP 연결 후 직접 실행+검증. Airtable UserProfile(벨트 Purple Belt, stripe 0) → `profiles` 갱신. TrainingSessions 3건(2026-05-22, 05-26, 07-30, 기술 링크·메모·XP 전부 보존) → `training_sessions` insert. 쿼리로 재조회해서 값 일치 확인함.
- [x] **Phase 1 최종 확인 완료 (2026-07-31)**: 로그인 상태에서 캘린더 화면에 마이그레이션된 벨트/수련 기록이 정상 노출 확인됨. **→ Phase 1(인증+DB 전환) 전체 완료. 원래 W1~W3(8/1~8/21) 3주 예정이었으나 하루 만에 끝남 — 일정보다 대폭 앞섬.**
- [ ] **출시 전 보안 점검 항목 (Supabase 보안 어드바이저 결과, 지금 당장은 급하지 않음)**:
  - `handle_new_user()` 트리거 함수가 SECURITY DEFINER로 외부에서 직접 호출 가능한 상태 — RPC 노출 제한 검토
  - Leaked Password Protection(유출된 비밀번호 차단) 기능이 꺼져있음 — Authentication 설정에서 켜기 권장
- [ ] **출시 전 필수: Supabase 무료 티어 자동 일시정지 이슈** ⚠️ — 무료 프로젝트는 트래픽 없으면 자동 pause됨(실제로 한번 걸림, MCP로 restore함). 실사용자 받기 전에 **Pro 플랜(월 $25)으로 업그레이드 필수** — 안 하면 서비스가 랜덤하게 먹통됨

---

## 부록 — 알아두면 좋은 기술 함정 (v2~v4 개발 중 축적, 옛 핸드오프 문서에서 이관)

Airtable/코드 작업 재개할 때 아래 함정들 여전히 유효함:

1. **`returnFieldsByFieldId: true`** — Airtable select 호출 시 항상 필수
2. **`find()` 메서드 미지원** — `select()` + `filterByFormula RECORD_ID()` 조합으로 대체
3. **multipleRecordLinks 레코드 ID는 formula로 비교 불가** — 메모리 필터링 필요
4. **`lib/airtable/*.ts`에 `import "server-only"` 필수** — 클라이언트 번들 유출 방지
5. **`typecast:true` + 한글 singleSelect 조합 위험** ⚠️ — 유니코드가 다른 동음이의 옵션이 새로 생성될 수 있음 (예: "포지션컨트롤"(컨=U+CE90)이 "포지션콘트롤"(콘=U+CF58)로 분리 생성된 사례 있음). 기존 옵션에 정확히 매칭해야 할 땐 `typecast:false` + 정확한 문자열 사용
6. **sandbox(`mcp__workspace__bash`)에서 `api.airtable.com` 직접 호출 403** — 반드시 Airtable MCP 도구로 접근
7. **Cowork 커넥트 폴더 삭제는 기본 차단** — `allow_cowork_file_delete` 승인 후 가능 (한 번 승인하면 폴더 전체에 적용됨)
8. **한글 경로에서 Edit/Write 도구가 가끔 blocked** — 발생 시 `mcp__workspace__bash`의 `cat > file << 'EOF'` 직접 쓰기로 우회
9. **`server-only` 가드 파일에 `publicEnv`를 같이 두면 클라이언트 화면이 통째로 빈 화면(검은 배경만)이 됨** ⚠️ (2026-07-31 발견) — `env.ts`에 서버 전용 값(`serverEnv`, window 체크로 throw)과 공개 값(`publicEnv`, NEXT_PUBLIC_*)을 같은 파일에 두면, "use client" 컴포넌트가 `publicEnv`만 쓰려고 import해도 그 파일의 다른 top-level 코드(`serverEnv` throw 가드)까지 브라우저에서 같이 실행되어 즉시 크래시함. **대응**: 공개 환경변수는 항상 별도 파일(`publicEnv.ts`)로 분리, 서버 전용 파일엔 `import "server-only"` 명시
10. **sandbox(`mcp__workspace__bash`)는 `supabase.co`도 직접 호출 불가** (Airtable과 동일) — DB 조회/쿼리/마이그레이션은 반드시 Supabase MCP(`mcp__<uuid>__execute_sql` 등) 사용. `pnpm install`/`pnpm dev`는 실제로는 마운트된 폴더라 sandbox에서 실행해도 사용자 실제 파일에 반영되지만, 네이티브 바이너리(SWC 등) 아키텍처 이슈 우려로 `pnpm install`은 사용자가 직접 로컬에서 실행하도록 안내하는 게 안전함
11. **pnpm이 `sharp` 같은 네이티브 모듈의 postinstall 빌드 스크립트를 기본적으로 차단함** (pnpm 9+ 보안 기본값) — `@capacitor/assets`가 내부적으로 `sharp`를 쓰는데, 그냥 `pnpm install`만 하면 "Cannot find module .../sharp-darwin-arm64v8.node" 에러 발생. **대응**: `package.json`에 `"pnpm": { "onlyBuiltDependencies": ["sharp"] }` 추가해서 사전 승인 (또는 사용자가 직접 `pnpm approve-builds` 실행)
12. **sandbox(`mcp__workspace__bash`)는 `registry.npmjs.org`도 직접 호출 불가**(403) — 새 npm 패키지를 실제로 설치/실행해야 하는 작업(`npx @capacitor/assets generate` 등)은 package.json에 의존성만 추가해두고 사용자가 로컬 터미널에서 `pnpm install` 등을 실행하도록 안내. 이미지 생성(PNG 아이콘 등) 자체는 sandbox의 Python/PIL/ImageMagick로 직접 가능 — 마운트된 폴더라 결과물이 바로 사용자 실제 파일에 반영됨

## 8. 라이브 배포 트러블슈팅 (2026-09-09)

Phase 1~2 코드가 실제로는 한 달 가까이 커밋만 되고 push가 안 되어 있었던 걸 발견 → push 및 배포 과정에서 아래 문제들을 순서대로 발견/해결함. 다음에 또 이런 증상이 보이면 아래부터 의심할 것.

1. **Vercel 프로덕션 env var 누락**: `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 Vercel에 "Config" 타입으로 추가 안 해서 빌드 자체가 실패(ZodError). → 추가 후 해결.
2. **`middleware.ts` 위치 오류(핵심 버그)**: `src/app` 구조를 쓰는 프로젝트인데 `middleware.ts`를 프로젝트 루트에 둬서 Next.js가 아예 인식을 못 함(빌드 로그에 미들웨어 언급 전무, edge-middleware 런타임 로그 0건) → **로그인 게이트가 처음부터 한 번도 작동한 적이 없었음**(비로그인 상태로 모든 페이지 접근 가능했던 상태). `src/middleware.ts`로 이동해서 해결. **교훈: src 디렉토리 구조를 쓰면 middleware.ts도 반드시 src/ 안에 있어야 함.**
3. **Supabase 무료 티어 자동 일시정지 재발**: 이미 알던 이슈지만 또 걸림(`DNS_PROBE_FINISHED_NXDOMAIN`까지 뜸 — pause가 길어지면 도메인 자체가 안 뜨는 수준까지 감). `restore_project`로 복구.
4. **Supabase Auth "Site URL"이 여전히 `http://localhost:3000`으로 설정**: 초기 개발 때(7/31) localhost 기준으로 등록해둔 게 프로덕션 배포 후에도 그대로 남아있어서, 구글 로그인은 성공하는데 최종 리다이렉트가 로컬로 튕겨서 "로그인이 안 되는" 것처럼 보였음. Supabase 대시보드 → Authentication → URL Configuration에서 Site URL을 `https://bjj-app-brown.vercel.app`로, Redirect URLs에 `https://bjj-app-brown.vercel.app/auth/callback` 추가해서 해결. **로그(`auth_logs`, Supabase MCP `query_logs`)로 `/authorize`→`/callback`→`/token`→`/user` 흐름 끝까지 200/302로 완주하는 것까지 확인 완료.**

→ 위 4가지 전부 해결 후 **실제 라이브 사이트에서 구글 로그인 → 세션 유지 → 기존 데이터(벨트/수련기록) 정상 노출까지 최종 확인 완료 (2026-09-09).**

---

## 다음 세션 시작점

Phase 1(인증) + Phase 2(구독 게이팅/RevenueCat Android) + 라이브 배포 검증까지 전부 완료. 다음은 **Phase 3 — 네이티브 패키징(Capacitor)**.

새 대화에서 이어갈 때 참고할 것:
- Supabase 프로젝트: `smgunmjpddcfgohmuawb` (ap-northeast-2) — MCP 연결되어 있으면 바로 쿼리 가능. **무료 티어라 트래픽 없으면 또 자동 일시정지될 수 있음** — 안 되면 `restore_project`부터 시도.
- 로그인 테스트 계정: `ksumin67@gmail.com` (구글 소셜 로그인 정상 작동 확인됨, 2026-09-09)
- 라이브 URL: `https://bjj-app-brown.vercel.app` — Vercel MCP 연결되어 있으면 배포 상태/로그 바로 확인 가능
- 콘텐츠(Techniques)는 Airtable(`appkUqBmwhAK9F8AX`)에, 유저 데이터는 Supabase에 있는 하이브리드 구조 유지 중
- Phase 3 시작 시 필요: Capacitor 설치, iOS/Android 프로젝트 생성, `server.url`을 라이브 URL로 설정, 앱 아이콘/스플래시, 로컬 알림(수련 리마인더) — 위 "5. 네이티브 패키징 방식" 섹션 참고
