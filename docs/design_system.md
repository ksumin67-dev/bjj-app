# 기술도감 디자인 시스템 (Amber Minimal)

2026-09-19, 기술도감 - 선수 탭 리뉴얼 작업에서 확정된 원칙을 정리.
앞으로 다른 화면에 디자인을 적용할 때 이 문서를 기준으로 삼는다.
새 화면 작업 전에는 반드시 시안(mockup)을 먼저 공유하고 승인받은 뒤 코드로 옮긴다.

## 레퍼런스

Whoop / Oura 스타일의 "미니멀 프리미엄 피트니스 앱" 톤. 화려한 장식보다
데이터 밀도와 여백, 타이포그래피 대비로 고급스러움을 낸다.

## 컬러 원칙

- **서페이스 4단계**: `bg-base`(#0A0A0F, 페이지 배경) → `bg-elevated`(#1A1A24, 아이콘 배지/트랙) → `bg-overlay` → `bg-hover`.
- **액센트는 하나만**: `brand-primary`(#D9772E, 앰버). "데이터를 표시하는 색은 이 색 하나"가 원칙 — 카테고리별로 색을 다르게 칠하지 않는다.
  - ❌ 스트림별 파랑/주황/보라/노랑, 선수별 스타일 태그 색으로 히어로 숫자 칠하기
  - ✅ 모든 리스트의 "히어로 스탯"(진행률, 우승 횟수, XP 등)은 항상 `brand-primary` 하나
  - 이 원칙이 깨지면 화면이 "무지개색 AI 목업"처럼 보인다는 게 이번 세션에서 반복 확인된 피드백.
- **테두리**: `border-subtle`(rgba(255,255,255,0.05))는 카드 테두리가 아니라 구분선(hairline divider) 용도로 우선 사용.
- **텍스트**: `text-primary`(제목) / `text-tertiary`(캡션·보조 라벨) / `text-inverse`(액센트 배경 위 흰 글자).

## 레이아웃 원칙

- **박스 카드 지양**: `rounded-2xl border bg-elevated p-4` 같은 카드가 반복되면 "AI가 만든 느낌"이 강해진다. 대신 **헤어라인 구분선 플랫 리스트**(`border-b border-border-subtle`, 마지막 행만 `last:border-b-0`)를 우선 사용.
- **리스트 행 표준 구조**(선수 리스트, 포지션 리스트 등 모든 목록에 동일 적용):
  `[아이콘/아바타 원형] — [제목 + 보조텍스트 (flex-1, truncate)] — [히어로 스탯 숫자 (brand-primary, 우측 정렬, 굵게) + 작은 라벨]`
- **스크롤**: 화면 전체를 `height: 100dvh`로 고정하고 리스트만 내부 `overflow-y-auto`로 가두는 구조는 쓰지 않는다. 일반 문서 스크롤이 기본. 화면 전환용 탭 스위처처럼 항상 보여야 하는 요소만 `position: sticky`로 상단 고정.
- **섹션 라벨**: `text-[10px] tracking-[0.5px] font-semibold text-text-tertiary` 캡션 한 줄로 통일 (예: "전체 선수 · 12명", "가드 포지션 · 14개").

## 필터 / 탭 원칙

- **인라인 필터 칩**(스타일 태그, 스트림 등): 기본은 아웃라인(`border border-border-subtle text-text-tertiary`), 활성 시 `bg-brand-primary text-text-inverse`로 단색 전환. 카테고리마다 다른 색을 채우지 않는다.
- **화면 전환 세그먼트 탭**(선수/포지션 같은 상위 탭): `bg-bg-elevated` 트랙 안에 활성 배경이 `layoutId`로 부드럽게 슬라이드하는 필(pill) 형태.

## 모션 원칙

프레이머 모션으로 다음 5가지를 기본 세트로 삼는다.

1. **숫자 카운트업**: XP 등 헤드라인 숫자는 마운트 시 0→실제값으로 애니메이션.
2. **진행바 채움**: 0→값으로 순차 딜레이(세그먼트별 `delay: i * 0.08`)를 주며 채워짐.
3. **필터 전환 크로스페이드**: `AnimatePresence mode="wait"` + `key`를 필터 상태로 지정.
4. **리스트 순차 등장**: 각 행 `initial={{opacity:0,y:8}}`, `delay: Math.min(i,12) * 0.02`.
5. **탭/칩 프레스 피드백**: `active:scale-[0.94~0.99]` + `active:opacity-70`.

## 알려진 인프라 함정 (반드시 피할 것)

- `tailwind.config.ts`의 커스텀 테마 색(`bg-base`, `border-subtle` 등)은 전부 `var(--x)` 형태의 평범한 CSS 변수 참조라서 **`/NN` 오퍼시티 모디파이어가 동작하지 않는다** (`bg-bg-base/95`, `border-border-subtle/70` 등). Tailwind가 조용히 실패해서 배경이 완전 투명해지거나 테두리가 Tailwind 기본 밝은 회색으로 대체된다.
  - 반투명이 필요 없으면 모디파이어 없이 그대로 사용 (`bg-bg-base`, `border-border-subtle`).
  - 이미 알파가 베이크된 토큰(`border-subtle` 등)에는 추가 모디파이어를 아예 쓰지 않는다.
  - 정말 다른 투명도가 필요하면 arbitrary value로 명시 (`bg-[rgba(10,10,15,0.9)]`).
- `overflow-x-hidden`은 CSS 스펙상 `overflow-y`를 강제로 `auto`로 승격시켜 `position: sticky`를 깨뜨릴 수 있다 (AppShell에서 실제 발생). 가로 스크롤 방지가 필요하면 `overflow-x-clip`을 사용한다.

## 적용 현황

- [x] 기술도감 - 선수 탭 (`AthleteEntryScreen.tsx`)
- [x] 기술도감 - 포지션 탭 (`SkillTreeBrowser.tsx`)
- [ ] 선수 상세 페이지 (`/tree/athlete/[athleteId]`)
- [ ] 포지션 상세 페이지 (`/tree/position/[positionId]`)
- [ ] 기술 상세 페이지 (`/tree/[positionId]/[techId]`)
- [ ] 기술도감 밖 화면 (홈, 캘린더, 프로필, 시퀀스)

## 작업 프로세스

1. 대상 화면의 현재 코드/데이터 구조 파악
2. 위 원칙을 적용한 시안을 mockup으로 먼저 공유 (코드 수정 전)
3. 사용자 피드백 반영해 시안 확정
4. 확정된 시안대로 실제 코드 반영 + `tsc --noEmit` 통과 확인
5. 커밋 후 사용자에게 푸시 요청 → 배포 확인
