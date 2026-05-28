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
  isMainSkill: boolean;
}

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
