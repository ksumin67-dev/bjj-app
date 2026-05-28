# BJJ App — Design System v1.1

> 컨셉: **Premium Dark Gamification**
> 배경: 딥 블랙 / 카드: 진회색 / 액센트: 퍼플

---

## 1. 색상 토큰

### 배경 레이어 (4단계)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `bg-bg-base` | `#0A0A0F` | 앱 배경 |
| `bg-bg-elevated` | `#1A1A24` | 카드/섹션 (표준) |
| `bg-bg-overlay` | `#22222E` | 카드 내 중첩 |
| `bg-bg-hover` | `#2A2A38` | 호버 상태 |

### 텍스트 계층
| 토큰 | 값 | 용도 |
|------|-----|------|
| `text-text-primary` | `#F5F7FA` | 제목, 본문 |
| `text-text-secondary` | `#B4BCC8` | 보조 텍스트 |
| `text-text-tertiary` | `#6B7280` | 힌트, 섹션 레이블 |
| `text-text-disabled` | `#3A3A4A` | 비활성 |

### 브랜드 (퍼플)
| 토큰 | 값 |
|------|-----|
| `bg-brand-primary` | `#7B61FF` |
| `bg-brand-subtle` | `rgba(123,97,255,0.15)` |
| Gradient CTA | `linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)` |

### Stream 색상 *(v1.1 추가 — CSS 토큰)*
| CSS 변수 | Tailwind 클래스 | 값 | 스트림 |
|------|------|-----|------|
| `--stream-guard` | `text-stream-guard` | `#2E80F0` | 가드포지션 |
| `--stream-top` | `text-stream-top` | `#FF8C42` | 탑포지션 |
| `--stream-escape` | `text-stream-escape` | `#A78BFA` | 이스케이프 |
| `--stream-standing` | `text-stream-standing` | `#FBBF24` | 스탠딩 |

---

## 2. 타이포그래피 규격

| 역할 | 클래스 |
|------|--------|
| Page Title (h1) | `text-2xl font-black tracking-tight` |
| Section Title | `text-sm font-bold text-text-primary` |
| **Section Label** | `text-[10px] uppercase tracking-widest font-semibold text-text-tertiary` |
| Body | `text-sm text-text-secondary` |
| Caption | `text-[11px] text-text-tertiary` |
| Micro | `text-[9px]` |
| Number 강조 | `text-lg font-black tabular-nums` |

> **규칙**: 헤딩은 `font-black`, 보조 강조는 `font-semibold`. `font-bold` 사용 지양.

---

## 3. 카드 & 스페이싱

### 카드 표준
```
rounded-2xl p-4 bg-bg-elevated
```

### 섹션 간격
- 섹션 사이: `marginBottom: 20px` (inline style, Tailwind JIT 불안정)
- 카드 내부: `gap: 10px`
- 스탯 그리드: `grid grid-cols-3 gap-2`

### Radius 스케일
| 클래스 | px | 용도 |
|------|-----|------|
| `rounded-sm` | 8px | 소형 인풋 |
| `rounded-xl` | 12px (Tailwind) | 버튼, 소형 카드 |
| `rounded-2xl` | 16px | **카드 표준** |
| `rounded-full` | 999px | 알약형, FAB |

---

## 4. 컴포넌트 패턴

### 카드
```tsx
<div className="rounded-2xl p-4 bg-bg-elevated">...</div>
```

### 섹션 레이블
```tsx
<p className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">
  섹션 이름
</p>
```

### Primary 버튼
```tsx
// 일반
<button className="w-full py-3 rounded-xl bg-brand-primary text-white text-[14px] font-bold">
// 핵심 CTA (홈 등)
style={{ background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)" }}
```

### 스탯 칩
```tsx
<div className="rounded-xl p-3 bg-bg-elevated border border-border-subtle">
  <p className="text-[10px] text-text-tertiary">{label}</p>
  <p className="text-lg font-black tabular-nums">{value}</p>
</div>
```

---

## 5. 아이콘 시스템 (lucide-react)

| Stream | 아이콘 | 색상 |
|--------|--------|------|
| 탑포지션 | `<Swords />` | `#FF8C42` |
| 가드포지션 | `<Shield />` | `#2E80F0` |
| 이스케이프 | `<Zap />` | `#A78BFA` |
| 스탠딩 | `<Users />` | `#FBBF24` |

아이콘 size 기준: 라벨 옆 14–16px / 카드 강조 20px / FAB 24–28px

---

## 6. 미정의 항목 (TODO)

| 항목 | 현황 | 권장 |
|------|------|------|
| Stream 색상 사용 | 파일마다 하드코딩 잔존 | `var(--stream-guard)` 등 CSS 토큰으로 순차 교체 |
| Avatar 그라디언트 | 하드코딩 | `--avatar-gradient` 토큰 추가 |
| Empty State | 파일마다 다름 | 공통 `<EmptyState>` 컴포넌트 추출 |
| Toast 패턴 | 미정의 | `toast-success / toast-error` 패턴 정의 |
| Skeleton Loader | 미구현 | 카드 형태 skeleton 추가 |
| 라이트 모드 | 다크 전용 | 라이트 모드 변수 세트 추가 여부 결정 |

---

*최종 업데이트: 2026-05-28*
