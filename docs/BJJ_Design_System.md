# BJJ App — 디자인 시스템 v1.0

> 최종 업데이트: 2026-05-26  
> 레퍼런스: 피트니스 앱 UI 이미지 (딥 블랙 배경 + 회색 박스로 섹션 구분 + 퍼플 액센트)  
> 컨셉: **Premium Dark Gamification** — 고급스러운 다크 게임 앱 느낌 (Duolingo 구조 × 프리미엄 피트니스 앱 미학)

---

## 1. 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **Black Base** | 배경은 순수에 가까운 블랙(#0A0A0F). 눈에 편안하고 고급스러운 느낌 |
| **Gray Card Depth** | 콘텐츠 영역은 진회색 카드(#1A1A24)로 구분. 테두리 없이 배경 색상 차이만으로 레이어 표현 |
| **Purple Accent** | 주요 액션/강조는 퍼플(#7B61FF). 파란색보다 고급스럽고 게이미피케이션에 어울림 |
| **Capsule Stats** | 수치 데이터는 파스텔 톤 캡슐 카드로 시각화 |
| **Gradient CTA** | 주요 버튼은 그라디언트 필 스타일 (퍼플 → 바이올렛) |
| **No Border Policy** | 카드 테두리 최소화. 깊이는 배경색 차이로만 표현 |
| **Gamification** | XP, 레벨, 스트릭, 뱃지로 동기부여. 숫자와 진척도를 항상 노출 |

---

## 2. 컬러 팔레트

### 2-1. 배경 레이어 (Background Layers)

레퍼런스 이미지 핵심 패턴: **블랙 배경 → 회색 박스로 섹션 구분**

```
Layer 0 (앱 최하단 배경)  → #0A0A0F  ← 거의 순수 블랙
Layer 1 (카드/섹션 박스)  → #1A1A24  ← 진회색 (배경 대비 뚜렷)
Layer 2 (카드 내 중첩)    → #22222E  ← 좀 더 밝은 회색
Layer 3 (호버/오버레이)   → #2A2A38  ← 인터랙션 상태
```

> 포인트: Layer 0과 Layer 1의 차이가 명확해야 섹션 구분이 자연스럽게 됨.  
> 테두리 없이 회색 박스가 배경에서 "부각"되어 보이는 레퍼런스 이미지 방식 채택.

### 2-2. 텍스트

```
Primary   → #F5F7FA  (메인 텍스트, 제목)
Secondary → #B4BCC8  (서브 텍스트, 레이블)
Tertiary  → #6B7280  (힌트, 비활성 텍스트)
Disabled  → #3A3A4A  (비활성)
```

### 2-3. 브랜드 / 액센트

```
Brand Primary  → #7B61FF  (퍼플 — 주요 버튼, 강조 요소)
Brand Hover    → #6B4FEF  (hover 상태)
Brand Pressed  → #5B3FDF  (pressed 상태)
Brand Subtle   → rgba(123, 97, 255, 0.15)  (배경 틴트)
Brand Glow     → rgba(123, 97, 255, 0.3)   (glow 효과)
```

### 2-4. 그라디언트

```
CTA Button   → linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)
Belt Gold    → linear-gradient(135deg, #FFD700 0%, #FFA500 100%)
Success      → linear-gradient(135deg, #34D399 0%, #059669 100%)
Danger       → linear-gradient(135deg, #F87171 0%, #DC2626 100%)
```

### 2-5. 스트림 컬러 (BJJ Stream Colors)

각 스트림을 시각적으로 구분하는 파스텔 캡슐 컬러 (레퍼런스 이미지의 컬러드 캡슐 카드에서 차용)

| 스트림 | 카드 배경 | 텍스트 컬러 | 계열 |
|--------|-----------|-------------|------|
| 가드 포지션 | `#1A3050` | `#7EC8FF` | 스카이 블루 |
| 탑 포지션   | `#3A1F00` | `#FFB347` | 피치 오렌지 |
| 이스케이프  | `#2A1050` | `#C4A4FF` | 라일락 |
| 스탠딩      | `#2A2400` | `#FFE066` | 레몬 옐로우 |

### 2-6. 벨트 컬러

```
흰띠  → #E8E8E8
파란띠 → #2E80F0
보라띠 → #7B61FF  (브랜드 퍼플과 통일)
갈색띠 → #8C5A2E
검은띠 → #1A1A24 배경 + #F5F7FA 테두리
```

### 2-7. 시맨틱 컬러

```
Success → #34D399
Warning → #FBBF24
Danger  → #F87171
Info    → #60A5FA
```

---

## 3. 타이포그래피

폰트: **Pretendard Variable** (가변 폰트, 한국어 최적화)

### 3-1. 타입 스케일

| 토큰 | 크기 | 굵기 | 사용처 |
|------|------|------|--------|
| `display-xl` | 32px | 900 | 앱 대형 수치 (XP 총합, 레벨 숫자) |
| `display-lg` | 24px | 800 | 페이지 제목, 섹션 헤더 |
| `display-md` | 20px | 700 | 카드 제목, 기술명 |
| `title` | 17px | 700 | 서브 제목, 탭 레이블 |
| `body-lg` | 15px | 500 | 주요 본문, 설명 텍스트 |
| `body-md` | 14px | 400 | 일반 본문 |
| `body-sm` | 13px | 400 | 보조 정보, 힌트 |
| `caption` | 11px | 500 | 태그, 뱃지 텍스트, 메타 정보 |
| `micro` | 10px | 500 | 수치 단위, 레이블 |

### 3-2. 규칙

```
줄간격: 제목류 1.2 / 본문류 1.5 / 캡션 1.3
자간:   display 류 → -0.03em / body 류 → -0.01em / caption → 0
```

### 3-3. 사용 예시

```tsx
// 페이지 제목
<h1 className="text-2xl font-black tracking-tight">스킬트리</h1>

// 대형 수치 (XP)
<span className="text-[32px] font-black tracking-tighter">4,820</span>

// 카드 제목
<h2 className="text-xl font-bold tracking-tight">클로즈드 가드</h2>

// 서브 텍스트
<p className="text-sm font-medium text-text-secondary">120 XP</p>

// 캡션 / 뱃지
<span className="text-[11px] font-semibold tracking-wide uppercase">PRO</span>
```

---

## 4. 스페이싱 & 레이아웃

### 4-1. 스페이싱 단위 (8px 그리드 기반)

```
4px  → 아주 작은 간격 (아이콘-텍스트 사이)
8px  → 기본 소형 간격 (카드 내부 소항목 간)
12px → 중간 간격 (섹션 내 항목 간)
16px → 기본 패딩 (카드 내부 패딩)
20px → 카드 간 간격
24px → 섹션 간 간격
32px → 페이지 단위 대형 간격
```

### 4-2. 카드 패딩

```
소형 카드 (캡슐 통계) → px-3 py-2
일반 카드             → p-4 (16px)
대형 카드 (히어로)    → p-5 (20px)
```

### 4-3. 모바일 레이아웃

```
좌우 여백      → px-4 (16px)
최대 너비      → max-w-2xl (672px)
바텀탭 여유    → pb-24 + env(safe-area-inset-bottom)
상단 안전영역  → pt-[env(safe-area-inset-top)]
```

---

## 5. 보더 & 그림자

### 5-1. No Border Philosophy

```
원칙: 카드에 테두리 NONE. 회색 배경(Layer 1)으로 레이어 분리.

예외 허용:
- 포커스 → 2px solid #7B61FF
- 구분선 → 1px solid rgba(255,255,255,0.06) (매우 연하게)
- 강조 카드 → 1px solid rgba(123,97,255,0.3)
```

### 5-2. 그림자

```
카드 기본   → 없음 (배경색 차이로 충분)
호버 카드   → 0 4px 20px rgba(0,0,0,0.5)
모달/시트   → 0 -8px 40px rgba(0,0,0,0.7)
글로우      → 0 0 20px rgba(123,97,255,0.25)
```

---

## 6. 보더 반경 (Border Radius)

```
xs   → 4px    (소형 뱃지 내부 요소)
sm   → 8px    (버튼, 입력창, 태그)
md   → 12px   (카드 기본)
lg   → 16px   (카드 대형, 모달)
xl   → 20px   (히어로 카드, 시트)
full → 9999px (캡슐 형태 — 통계 아이템, CTA 버튼, 태그)
```

---

## 7. 컴포넌트 명세

### 7-1. CTA 버튼 (Primary — Gradient Pill)

```tsx
<button className="
  w-full py-3.5 px-6 rounded-full font-bold text-white
  bg-gradient-to-r from-[#7B61FF] to-[#B44FD4]
  shadow-[0_4px_16px_rgba(123,97,255,0.4)]
  active:scale-[0.97] transition-all duration-150
">
  오늘 훈련 기록하기
</button>
```

### 7-2. Base 카드

```tsx
// Layer 1 — 기본 카드 (검정 배경 위에 회색 박스)
<div className="bg-[#1A1A24] rounded-2xl p-4">
  {children}
</div>

// Layer 2 — 카드 내 중첩 영역
<div className="bg-[#22222E] rounded-xl p-3">
  {children}
</div>
```

### 7-3. 캡슐 통계 카드 (Stream Capsule)

레퍼런스 이미지 핵심 패턴. 스트림별 훈련 강도를 세로 캡슐로 시각화.

```tsx
const CAPSULE_STYLES = {
  "가드 포지션": { bg: "#1A3050", text: "#7EC8FF", label: "가드" },
  "탑 포지션":   { bg: "#3A1F00", text: "#FFB347", label: "탑" },
  "이스케이프":  { bg: "#2A1050", text: "#C4A4FF", label: "탈출" },
  "스탠딩":      { bg: "#2A2400", text: "#FFE066", label: "스탠" },
};

// 높이는 훈련 횟수에 비례 (min 48px / max 120px)
const height = Math.max(48, Math.min(120, count * 14));

<div
  className="flex-1 rounded-full flex flex-col items-center justify-end pb-2 pt-1"
  style={{ backgroundColor: style.bg, height: `${height}px` }}
>
  <span className="text-[10px] font-bold" style={{ color: style.text }}>
    {style.label}
  </span>
</div>
```

### 7-4. 진척도 바

```tsx
<div className="h-1.5 bg-[#22222E] rounded-full overflow-hidden">
  <div
    className="h-full bg-[#7B61FF] rounded-full transition-all duration-500"
    style={{ width: `${percent}%` }}
  />
</div>
```

### 7-5. 배지 / 태그

```tsx
// 브랜드 태그
<span className="
  px-2 py-0.5 rounded-full text-[11px] font-semibold
  bg-[rgba(123,97,255,0.15)] text-[#A78BFA]
">
  스윕
</span>

// 스트림 태그 (가드 예시)
<span className="
  px-2 py-0.5 rounded-full text-[11px] font-semibold
  bg-[#1A3050] text-[#7EC8FF]
">
  가드 포지션
</span>
```

---

## 8. 아이콘 라이브러리

### 8-1. 주요 라이브러리

| 우선순위 | 라이브러리 | 패키지 | 특징 |
|----------|-----------|--------|------|
| 1순위 | **Tabler Icons** | `@tabler/icons-react` | 4,000+ 아이콘, 선형 스타일, 무료 MIT |
| 2순위 | **Phosphor Icons** | `@phosphor-icons/react` | 굵기 조절 가능, 스포츠 카테고리 있음 |
| 현재 임시 | Lucide React | `lucide-react` | 설치됨, 마이그레이션 대상 |

### 8-2. BJJ 앱 아이콘 매핑

| 기능 | Tabler 아이콘 |
|------|-------------|
| 홈 | `IconHome` |
| 스킬트리 | `IconSitemap` |
| 훈련 기록 | `IconCalendarCheck` |
| 시퀀스 | `IconRoute` |
| 통계 | `IconChartBar` |
| 벨트/레벨 | `IconRosette` |
| XP | `IconBolt` |
| 스트릭 | `IconFlame` |
| 약점 | `IconTargetArrow` |
| 잠금 | `IconLock` |
| 완료 | `IconCircleCheck` |

### 8-3. 아이콘 사용 규칙

```
크기: 16px (캡션), 20px (기본), 24px (강조), 32px (히어로)
굵기: stroke 1.5 (Tabler 기본)
색상: text-text-secondary (기본), text-brand (강조)
간격: 텍스트와 gap-1.5 또는 gap-2
```

---

## 9. CSS 변수 변경 계획 (globals.css)

현재 → 목표:

```css
/* 배경 */
--bg-base:     #0F1115  →  #0A0A0F    /* 더 짙은 블랙 */
--bg-elevated: #161A21  →  #1A1A24    /* 카드/섹션 회색 박스 */
--bg-overlay:  #1E232B  →  #22222E    /* 중첩 레이어 */
--bg-hover:    #232934  →  #2A2A38    /* 호버 상태 */

/* 브랜드: 청록(Teal) → 퍼플 */
--brand-primary: #1FE8C5  →  #7B61FF
--brand-hover:   #16C9A9  →  #6B4FEF
--brand-pressed: #0FA88B  →  #5B3FDF
--brand-subtle:  rgba(31,232,197,0.12)  →  rgba(123,97,255,0.15)

/* 포커스 */
--border-focus: #1FE8C5  →  #7B61FF

/* 벨트 */
--belt-purple: #9C5CFF  →  #7B61FF   /* 브랜드 퍼플로 통일 */
```

---

## 10. 홈 화면 구조 (레퍼런스 기반)

```
┌─────────────────────────┐
│  [안전 영역]             │  env(safe-area-inset-top)
│  안녕하세요  [아바타]   │  헤더 — 배경 #0A0A0F
│  Aqua · 파란띠           │
│                          │
│ ┌─────────────────────┐ │
│ │  레벨 카드           │ │  Layer 1 카드 (#1A1A24)
│ │  ████░░░ 3,240 XP   │ │  + 퍼플 진척도 바
│ │  보라띠까지 1,760   │ │
│ └─────────────────────┘ │
│                          │
│ ┌─────────────────────┐ │
│ │  이번 주 훈련        │ │  캘린더 스트립
│ │  월 화 수 목 금 토 일│ │  Layer 1 카드
│ └─────────────────────┘ │
│                          │
│  스트림 강도             │  섹션 레이블
│ ┌──┐┌──┐┌──┐┌──┐       │
│ │  ││  ││  ││  │        │  4개 캡슐 카드
│ │가││탑││탈││스│        │  높이 = 훈련 강도
│ └──┘└──┘└──┘└──┘       │
│                          │
│ [그라디언트 CTA 버튼]    │  오늘 훈련 기록하기
│                          │
│ ┌─────────────────────┐ │
│ │  약점 스트림 감지    │ │  Layer 1 카드
│ │  탑 포지션 부족      │ │
│ └─────────────────────┘ │
│                          │
│  [바텀탭 + 안전 영역]    │
└─────────────────────────┘
```

---

## 11. 애니메이션 / 모션

```
Fast:   120ms ease  (탭 피드백, 토글)
Base:   200ms ease  (호버, 상태 전환)
Slow:   320ms spring (카드 등장, 진척도 바)
Spring: cubic-bezier(0.34, 1.56, 0.64, 1)

탭 피드백: active:scale-[0.97] transition-transform duration-[120ms]
진척도 바: width 0% → N% — 600ms spring
```

---

## 12. 금지 패턴 (Anti-patterns)

```
❌ 흰 배경 카드 (라이트 모드 요소)
❌ #2E80F0 파란색 주 액센트 → #7B61FF 퍼플로 교체
❌ 카드에 회색 테두리 → 배경색 레이어로만 구분
❌ #FFFFFF 흰색 텍스트 직접 사용 → #F5F7FA 사용
❌ 그림자에 유색 사용 → rgba(0,0,0,N) 그림자만
❌ 8px 미만 간격 과다 사용
❌ 아이콘에 primary 텍스트 색 → secondary 컬러 사용
```

---

## 13. 구현 우선순위 로드맵

### Phase 1 — 즉시
- [ ] `globals.css` CSS 변수 업데이트 (블랙 배경 + 퍼플 액센트)
- [ ] `HomeDashboard.tsx` 리빌드 (캡슐 카드 + 캘린더 스트립 + 그라디언트 CTA)
- [ ] `@tabler/icons-react` 설치

### Phase 2 — 단기
- [ ] 카드 전체 보더 제거 (배경색 레이어로 교체)
- [ ] BottomTabBar 퍼플 active 색상 적용
- [ ] 스킬트리 페이지 카드 스타일 통일

### Phase 3 — 중기
- [ ] 기하학적 SVG 뱃지 컴포넌트 제작
- [ ] 진척도 바 애니메이션 추가
- [ ] Lucide → Tabler 아이콘 마이그레이션

---

## 15. 홈 화면 컴포넌트 v2 (2026-05-26 업데이트)

### 15-1. 프로필 헤더

레퍼런스 이미지 기반. 상단 고정 영역.

```
┌─────────────────────────────────────┐
│ [아바타] Hello, 아쿠아 👋           [🔔] │
│         Welcome Back                │
└─────────────────────────────────────┘
```

**스펙:**
```
아바타:
  크기: 48×48px (w-12 h-12)
  형태: 원형 (rounded-full)
  배경: linear-gradient(135deg, #7B61FF, #B44FD4)
  내용: 이름 첫 글자 (흰색, font-black, text-xl)

텍스트:
  서브라인: "Hello, {이름} 👋" → text-sm, #B4BCC8
  메인: "Welcome Back" → text-[26px] font-black tracking-tight white

벨 아이콘:
  크기: 40×40px 원형
  배경: #1A1A24 (Layer 1)
  아이콘: Bell 18px, #B4BCC8
```

### 15-2. 주간 캘린더 스트립 (v2)

레퍼런스 이미지 직접 참조. 오늘이 속한 월~일 주간 표시.

```
Mon  Tue  Wed  Thu  Fri  Sat  Sun
 08   09   10  [11]  12   13   14
                ↑ 오늘: 퍼플 필 배경
```

**스펙:**
```
컨테이너:
  배경: 투명 (앱 배경 그대로)
  패딩: px-4 py-4

각 요일 셀:
  너비: flex-1 (7등분)
  구조: 상단 요일명 + 하단 날짜 필

요일명:
  오늘: #7B61FF (퍼플)
  지난날: #6B7280
  미래: #3A3A4A (비활성)
  크기: 11px font-semibold
  언어: 영문 3글자 (Mon, Tue, ...)

날짜 필 (오늘 아닐 때):
  배경: 수련O → rgba(123,97,255,0.12) / 수련X → transparent
  텍스트: 수련O → #A78BFA / 미래 → #3A3A4A / 기본 → #F5F7FA
  크기: 15px font-black

날짜 필 (오늘):
  배경: #7B61FF (solid 퍼플)
  텍스트: #FFFFFF
  형태: rounded-2xl (rounded pill)

수련 완료 점:
  오늘 아니면서 수련O인 날: 하단 1×1 퍼플 점
  크기: w-1 h-1 rounded-full #7B61FF
```

### 15-3. 오늘의 수련 카드 (Today's Training)

레퍼런스 "Today's Workout" 카드 직접 참조.

```
┌─────────────────────────────────────┐
│ TODAY'S TRAINING                [🏋] │  ← 워터마크 (opacity 6%)
│ 가드 스페셜리스트                    │
│ 바텀에서 공격하는 가드 플레이어      │
│                                     │
│ 🔥 +320 XP 이번 주  |  ⏱ 3일 수련   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       수련 기록하기              │ │  ← 그라디언트 버튼
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**스펙:**
```
카드:
  배경: #1A1A24 (Layer 1)
  형태: rounded-3xl (더 큰 반경)
  패딩: p-5
  overflow: hidden (워터마크 잘림)

워터마크:
  위치: absolute -right-4 -bottom-4
  아이콘: Dumbbell (Lucide), size=120
  색상: #FFFFFF
  opacity: 0.06

타이틀 그룹:
  레이블: "TODAY'S TRAINING" → 11px uppercase tracking-widest #6B7280
  메인: BJJ 스타일명 → text-xl font-black white
  서브: 스타일 설명 → text-sm #B4BCC8

수치 행:
  구분: | (divider 1px #2A2A38)
  아이콘 + 값 + 단위 구조

CTA 버튼:
  배경: linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)
  그림자: 0 4px 20px rgba(123,97,255,0.35)
  형태: rounded-2xl (not pill — 카드 안에서)
  텍스트: "수련 기록하기" 15px font-bold white
  탭피드백: active:scale-[0.97] duration-[120ms]

수련 완료 variant:
  동일 구조, 하단 CTA 버튼 제거
  메인: "오늘 수련 완료! ✅"
  워터마크 색상: #34D399 (success)
```

### 15-4. 개정 사항 요약

| 항목 | v1 | v2 |
|------|----|----|
| 헤더 | 날짜 + 스트릭 뱃지 | 아바타 + Welcome Back + 벨 |
| 캘린더 | 원형 체크 (Mon-Sun) | 필 스타일 pill (Mon-Sun + 날짜 숫자) |
| CTA | 별도 그라디언트 버튼 | Today's Training 카드 내 버튼 |
| 요일 표기 | 한글 (월화수...) | 영문 (Mon Tue...) |
| 카드 형태 | rounded-2xl | rounded-3xl (더 부드러움) |
