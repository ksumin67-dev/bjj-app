/**
 * 도메인 타입 — Airtable 필드 → 앱 내부 표현 변환 후의 형태.
 */

export type TechniqueType =
  | "스윕"
  | "서브미션"
  | "패스"
  | "이탈"
  | "전환"
  | "컨트롤"
  | "디펜스"
  | "리텐션"
  | "혈관초크"
  | "무릎"
  | "발목"
  | "팔꿈치"
  | "어깨"
  | "셋업"
  | "포지션"
  | "이스케이프"
  | "테이크다운"
  | "가드"
  | "탑포지션"
  | "방어";

export type Stream =
  | "가드포지션"
  | "탑포지션"
  | "이스케이프"
  | "스탠딩";

export type BeltLevel = "White Belt" | "Blue Belt" | "Purple Belt" | "Brown Belt" | "Black Belt";

export type GiNogi = "기전용" | "노기전용" | "기·노기공통";

export type Difficulty = "기본" | "정착" | "트렌드";

export interface Technique {
  recordId: string;
  id: string;
  nameKo: string;
  nameEn: string;
  type: TechniqueType;
  xpValue: number;
  giNogi: GiNogi;
  videoUrl: string | null;
  notes: string | null;
  parentId: string | null;
  stream: Stream | null;
  grip: string | null;
  bodyType: string | null;
  keyPoint: string | null;
  practicalTip: string | null;
  commonMistake: string | null;
  counter: string | null;
  ytSearchGeneral: string | null;
  ytSearchKo: string | null;
  curatedInstructor: string | null;
  difficulty: Difficulty | null;
  isMainSkill: boolean;
  /** 이 기술의 대표 선수(Athletes 테이블 recordId 배열). 2026-09 선수 중심 스킬트리 신규 필드. */
  athleteRecordIds: string[];
}

// ── 선수 중심 스킬트리 (2026-09-14 추가) ─────────────────────────────────────

export type StyleTag =
  | "레그락"
  | "가드"
  | "패싱"
  | "기본기"
  | "하이브리드"
  | "50/50"
  | "백시스템";

export interface Athlete {
  recordId: string;
  nameKo: string;
  nameEn: string;
  beltAcademy: string;
  activeEra: string;
  styleTags: StyleTag[];
  signatureSystem: string;
  achievements: string;
  includeInLaunch: boolean;
  /** 카드 좌상단 히어로 숫자 — 임의 스탯이 아니라 대표 성과에서 뽑은 실제 커리어 수치 (예: "7", "50/50") */
  heroStat: string;
  /** 히어로 숫자 아래 붙는 짧은 설명 (예: "ADCC 우승") */
  heroLabel: string;
}

export const STYLE_TAG_ORDER: StyleTag[] = [
  "레그락",
  "가드",
  "패싱",
  "기본기",
  "하이브리드",
  "50/50",
  "백시스템",
];

export const STYLE_TAG_META: Record<StyleTag, { color: string; glow: string }> = {
  레그락:     { color: "#E2574A", glow: "rgba(226,87,74,0.5)" },
  가드:       { color: "#2E80F0", glow: "rgba(46,128,240,0.5)" },
  패싱:       { color: "#FF8C42", glow: "rgba(255,140,66,0.5)" },
  기본기:     { color: "#34D399", glow: "rgba(52,211,153,0.5)" },
  하이브리드: { color: "#7B61FF", glow: "rgba(123,97,255,0.5)" },
  "50/50":    { color: "#FBBF24", glow: "rgba(251,191,36,0.5)" },
  백시스템:   { color: "#A78BFA", glow: "rgba(167,139,250,0.5)" },
};

/** 알 수 없는/누락된 스타일 태그에 대한 안전한 기본값 (Airtable 값이 코드와 어긋나도 빌드가 죽지 않도록) */
export const STYLE_TAG_FALLBACK = { color: "#7B61FF", glow: "rgba(123,97,255,0.5)" };

export interface Sequence {
  recordId: string;
  seqName: string;
  startPositionRecordId?: string;
  techniquesUsedRecordIds: string[];
  stepsText: string;
  hasBranch: boolean;
  branchCondition: string | null;
  tags: string[];
  successCount: number;
  lastUsed: string | null;
}

export interface TrainingSession {
  recordId: string;
  sessionLabel: string;
  date: string;
  techniqueRecordIds: string[];
  sequenceRecordIds: string[];
  notes: string | null;
  xpEarned: number;
  createdAt: string | null;
}

/**
 * 수련 횟수 집계 — TrainingSession 배열에서 기술별 수련 횟수 계산.
 * progressMap 대체.
 */
export function buildTrainingCountMap(
  sessions: TrainingSession[],
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const session of sessions) {
    for (const id of session.techniqueRecordIds) {
      map[id] = (map[id] ?? 0) + 1;
    }
  }
  return map;
}

/**
 * 수련 횟수 → 레벨 라벨 (표시용)
 */
export function trainingCountLabel(count: number): string {
  if (count === 0) return "미수련";
  if (count <= 2)  return "시작";
  if (count <= 9)  return "드릴 중";
  return "익숙";
}

/**
 * 누적 XP → 띠 레벨
 */
export type BeltRank = { belt: BeltLevel; label: string; minXp: number; maxXp: number };
export const BELT_RANKS: BeltRank[] = [
  { belt: "White Belt",  label: "White Belt",  minXp: 0,      maxXp: 999   },
  { belt: "Blue Belt",   label: "Blue Belt",   minXp: 1000,   maxXp: 4999  },
  { belt: "Purple Belt", label: "Purple Belt", minXp: 5000,   maxXp: 14999 },
  { belt: "Brown Belt",  label: "Brown Belt",  minXp: 15000,  maxXp: 29999 },
  { belt: "Black Belt",  label: "Black Belt",  minXp: 30000,  maxXp: Infinity },
];

export function getBeltRank(totalXp: number): BeltRank {
  return BELT_RANKS.findLast((r) => totalXp >= r.minXp) ?? BELT_RANKS[0];
}

// ── 스트릭(연속 수련일) ──────────────────────────────────────────────────────

/**
 * 오늘 기준 연속 수련일 계산.
 * - 오늘 기록이 있으면 today부터 역산
 * - 오늘 기록이 없으면 어제부터 역산 (오늘 수련 전 상태)
 */
export function calculateStreak(sessions: TrainingSession[]): number {
  if (sessions.length === 0) return 0;
  const allDates = new Set(sessions.map((s) => s.date));
  const today = new Date().toISOString().slice(0, 10);

  let cursor = new Date(today);
  if (!allDates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!allDates.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * 수련 후 새 스트릭 계산 (오늘 세션 추가 기준).
 */
export function calculateNewStreak(existingSessions: TrainingSession[]): number {
  if (existingSessions.length === 0) return 1;
  const allDates = new Set(existingSessions.map((s) => s.date));
  const today = new Date().toISOString().slice(0, 10);
  // 오늘 포함해서 역산
  allDates.add(today);

  let cursor = new Date(today);
  let streak = 0;
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!allDates.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** 스트릭 보너스 XP */
export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 500;
  if (streak >= 7)  return 150;
  if (streak >= 3)  return 50;
  return 0;
}

/** 스트릭 표시 텍스트 */
export function streakLabel(streak: number): string {
  if (streak === 0) return "";
  if (streak >= 30) return `🔥 ${streak}일 연속 · 전설`;
  if (streak >= 7)  return `🔥 ${streak}일 연속 · 불꽃`;
  if (streak >= 3)  return `🔥 ${streak}일 연속`;
  return `${streak}일 연속`;
}

// ── BJJ 스타일 분석 ──────────────────────────────────────────────────────────

export type BjjStyle = {
  label: string;
  emoji: string;
  desc: string;
  dominant: Stream | null;
};

/**
 * 스트림별 수련 합계 + 총 세션 수 → BJJ 스타일 자동 도출.
 * 수련 기록이 하나도 없을 때만 "탐색 중" 반환.
 */
export function getBjjStyle(streamTotals: Record<string, number>, totalSessions: number): BjjStyle {
  const noData = { label: "탐색 중", emoji: "🌱", desc: "수련 기록을 등록해 스타일을 완성하세요", dominant: null };

  if (totalSessions === 0) return noData;

  const total = Object.values(streamTotals).reduce((a, b) => a + b, 0);
  if (total === 0) return noData;

  const sorted = Object.entries(streamTotals)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return noData;

  const top    = sorted[0];
  const topPct = top[1] / total;

  // 올라운더: 최다 스트림이 50% 미만
  if (topPct < 0.5) {
    return { label: "올라운더", emoji: "🥋", desc: "공격·수비 균형 잡힌 올라운더", dominant: null };
  }

  const styleMap: Record<string, BjjStyle> = {
    "가드포지션": { label: "가드 스페셜리스트", emoji: "🛡",  desc: "바텀에서 공격하는 가드 플레이어",          dominant: "가드포지션" },
    "탑포지션":   { label: "탑 게임 스페셜리스트", emoji: "⚔️", desc: "패스·서브미션으로 압박하는 탑 플레이어", dominant: "탑포지션"   },
    "이스케이프": { label: "이스케이프 아티스트", emoji: "🏃", desc: "어떤 위기에서도 빠져나오는 서바이버",       dominant: "이스케이프" },
    "스탠딩":     { label: "레슬러",              emoji: "🤼", desc: "테이크다운으로 주도권을 잡는 레슬러",       dominant: "스탠딩"     },
  };

  return styleMap[top[0]] ?? { label: "올라운더", emoji: "🥋", desc: "나만의 스타일 형성 중", dominant: null };
}

// ── 난이도 메타 ──────────────────────────────────────────────────────────────

export const DIFFICULTY_ORDER: Difficulty[] = ["기본", "정착", "트렌드"];

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; emoji: string; color: string; bg: string; desc: string }
> = {
  기본:   { label: "기본",   emoji: "🟢", color: "#34D399", bg: "rgba(52,211,153,0.12)", desc: "처음 익혀야 할 토대 기술" },
  정착:   { label: "정착",   emoji: "🔵", color: "#60A5FA", bg: "rgba(96,165,250,0.12)", desc: "현대 주짓수의 표준 기술" },
  트렌드: { label: "트렌드", emoji: "🟣", color: "#A78BFA", bg: "rgba(167,139,250,0.12)", desc: "최신 메타·고레벨 트렌드 기술" },
};

// ── 포지션 도달형 레벨 (스킬트리 게임화) ─────────────────────────────────────
//
// 규칙: 해당 난이도 기술의 70%를 "3회 이상(드릴 중+)" 수련하면
//       다음 Lv 도달 → 다음 난이도 공개(추천).
//   Lv.1 기본 단계 → (기본 70% 클리어) → Lv.2 정착 공개
//                  → (정착 70% 클리어) → Lv.3 트렌드 공개
//                  → (트렌드 70% 클리어) → 마스터

export const DRILL_THRESHOLD = 3; // "3회+" = 드릴 중 이상
export const LEVEL_RATIO = 0.7;   // 난이도의 70% 드릴 시 레벨업

// 난이도 → 공개에 필요한 레벨 (소프트 잠금 힌트용)
export const DIFFICULTY_UNLOCK_LEVEL: Record<Difficulty, number> = {
  기본: 1,
  정착: 2,
  트렌드: 3,
};

type DiffStat = { total: number; drilled: number; met: boolean; needed: number };

export type PositionLevel = {
  level: number;                 // 1..4 (4 = 마스터)
  label: string;                 // "Lv.1" … "Lv.3" / "마스터"
  unlocked: Difficulty[];        // 추천(공개)된 난이도
  targetDifficulty: Difficulty | null; // 지금 클리어해야 할 난이도
  unlockNextLevel: number | null;      // target 클리어 시 도달 레벨
  remaining: number;             // target에서 70% 채우기까지 남은 기술 수
  recommendedRecordId: string | null;  // "다음 추천" 기술
};

type LvTech = { recordId: string; difficulty: Difficulty | null; id?: string };

/** 포지션 자식 기술 + 수련 횟수맵 → 도달형 레벨 계산 */
export function computePositionLevel(
  techs: LvTech[],
  countMap: Record<string, number>,
): PositionLevel {
  const stat = (d: Difficulty): DiffStat => {
    const list = techs.filter((t) => t.difficulty === d);
    const total = list.length;
    const drilled = list.filter((t) => (countMap[t.recordId] ?? 0) >= DRILL_THRESHOLD).length;
    const need = Math.ceil(LEVEL_RATIO * total);
    return { total, drilled, met: total === 0 ? true : drilled >= need, needed: Math.max(0, need - drilled) };
  };

  const base = stat("기본");
  const est  = stat("정착");
  const trd  = stat("트렌드");

  let level = 1;
  if (base.met) level = 2;
  if (level >= 2 && est.met) level = 3;
  if (level >= 3 && trd.met) level = 4;

  const unlocked: Difficulty[] = ["기본"];
  if (level >= 2) unlocked.push("정착");
  if (level >= 3) unlocked.push("트렌드");

  // 클리어해야 할 가장 낮은 난이도 (실제 기술이 있는 것만)
  let targetDifficulty: Difficulty | null = null;
  for (const [d, s] of [["기본", base], ["정착", est], ["트렌드", trd]] as const) {
    if (s.total > 0 && !s.met) { targetDifficulty = d; break; }
  }

  // "다음 추천": target 난이도에서 가장 덜 수련한 기술
  let recommendedRecordId: string | null = null;
  if (targetDifficulty) {
    const pool = techs.filter((t) => t.difficulty === targetDifficulty);
    pool.sort((a, b) =>
      (countMap[a.recordId] ?? 0) - (countMap[b.recordId] ?? 0) ||
      (a.id ?? "").localeCompare(b.id ?? "", undefined, { numeric: true }),
    );
    recommendedRecordId = pool[0]?.recordId ?? null;
  }

  const targetStat = targetDifficulty === "기본" ? base : targetDifficulty === "정착" ? est : targetDifficulty === "트렌드" ? trd : null;

  return {
    level,
    label: level >= 4 ? "마스터" : `Lv.${level}`,
    unlocked,
    targetDifficulty,
    unlockNextLevel: targetDifficulty ? DIFFICULTY_UNLOCK_LEVEL[targetDifficulty] + 1 : null,
    remaining: targetStat ? targetStat.needed : 0,
    recommendedRecordId,
  };
}

/** 벨트 등급 인덱스 (White=0 … Black=4) */
export function beltIndex(belt: BeltLevel): number {
  return BELT_RANKS.findIndex((r) => r.belt === belt);
}
