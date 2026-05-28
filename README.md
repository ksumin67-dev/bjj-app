# bjj-app

BJJ 스킬트리 앱 — 포지션별 기술 트리, 수련 기록, 시퀀스 관리.

## 빠른 시작

```bash
# 1. 환경변수 설정
cp .env.example .env.local
# .env.local 열어서 AIRTABLE_API_KEY 값에 본인 PAT 토큰 붙여넣기

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev
# → http://localhost:3000
```

## 환경변수

| 키 | 설명 |
|---|---|
| `AIRTABLE_API_KEY` | Airtable Personal Access Token (`pat`로 시작) |
| `AIRTABLE_BASE_ID` | `appkUqBmwhAK9F8AX` (BJJ 스킬트리 베이스) |
| `NEXT_PUBLIC_APP_NAME` | 앱 이름 (기본값 bjj-app) |

PAT 토큰 발급: https://airtable.com/create/tokens
- Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`
- Access: 베이스 `appkUqBmwhAK9F8AX` 추가

## 폴더 구조

```
src/
├── app/                # Next.js App Router 라우트
│   ├── layout.tsx      # 루트 레이아웃 (다크 테마, 폰트)
│   ├── globals.css     # 디자인 토큰 CSS 변수
│   ├── page.tsx        # / (홈)
│   ├── tree/           # /tree (스킬트리)
│   ├── sequences/      # /sequences (시퀀스)
│   ├── log/            # /log (수련 기록)
│   └── stats/          # /stats (통계, P2)
├── components/
│   └── layout/         # AppShell, BottomTabBar
├── lib/
│   ├── airtable/       # 서버 전용 Airtable 클라이언트
│   ├── env.ts          # zod 검증된 환경변수
│   └── utils.ts        # cn() 등 유틸
└── types/
    └── domain.ts       # 도메인 타입 (Position, Technique 등)
```

## 빌드 단계

- [x] **Phase 0**: 디자인 스펙 (`../BJJ_App_Design_Spec.md` 참조)
- [x] **Phase 1**: 프로젝트 스캐폴딩 (현재)
- [ ] **Phase 2**: 스킬트리 화면 (포지션→기술 목록)
- [ ] **Phase 3**: 시퀀스 화면
- [ ] **Phase 4**: 수련 기록 입력 폼
- [ ] **Phase 5**: Vercel 배포

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm typecheck    # 타입 검증
```
