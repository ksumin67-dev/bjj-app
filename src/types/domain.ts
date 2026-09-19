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
  /**
   * Airtable 레코드 생성 시각(ISO 8601). "이달의 추천" 최신 등록순 정렬 전용.
   * heroStat은 선수마다 단위가 다른(우승 횟수/나이/포지션명) 필드라 선수 간 순위
   * 비교에 쓸 수 없음이 확인되어(2026-09-18) 정렬 기준을 이걸로 교체했다.
   */
  createdTime: string;
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
  isPrimary: boolean;
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

/** 벨트 한글 표기 — 프로필에서 직접 설정하는 실제 벨트용 (2026-09-18) */
export const BELT_LABEL_KO: Record<BeltLevel, string> = {
  "White Belt": "화이트 벨트",
  "Blue Belt": "블루 벨트",
  "Purple Belt": "퍼플 벨트",
  "Brown Belt": "브라운 벨트",
  "Black Belt": "블랙 벨트",
};

/**
 * 학습 레벨 (2026-09-19 리네이밍) — 누적 XP 기반 앱 내 게이미피케이션 트랙.
 *
 * 이전엔 이 XP 누적치를 "벨트"(White/Blue/Purple...)로 표시했는데, 실제
 * IBJJF 벨트는 인스트럭터가 승급시켜주는 것이라 사용자가 프로필에 직접
 * 설정한 진짜 벨트(BeltLevel, BELT_LABEL_KO 참고)와 정면으로 충돌했음
 * (예: 실제 퍼플벨트인 사용자가 앱 켜면 XP 0이라 화이트벨트로 뜨는 문제).
 * → 벨트는 프로필 값만 쓰고, 이 트랙은 "레벨"이라는 완전히 다른 이름으로
 * 분리해 게이미피케이션 재미는 유지하되 정체성 혼동은 없앰.
 */
export type LearningLevel = "Lv.1" | "Lv.2" | "Lv.3" | "Lv.4" | "Lv.5";
export type LevelRank = { level: LearningLevel; minXp: number; maxXp: number };
export const LEVEL_RANKS: LevelRank[] = [
  { level: "Lv.1", minXp: 0,     maxXp: 999   },
  { level: "Lv.2", minXp: 1000,  maxXp: 4999  },
  { level: "Lv.3", minXp: 5000,  maxXp: 14999 },
  { level: "Lv.4", minXp: 15000, maxXp: 29999 },
  { level: "Lv.5", minXp: 30000, maxXp: Infinity },
];

export function getLevelRank(totalXp: number): LevelRank {
  return LEVEL_RANKS.findLast((r) => totalXp >= r.minXp) ?? LEVEL_RANKS[0];
}

/**
 * 레벨 내 4단 진행률 — 기술도감 홈 화면의 "학습 레벨" 바 렌더링용.
 * 한 레벨의 XP 구간을 4등분해서 지금 몇 번째 단계를 채우는 중인지,
 * 다음 단계까지 몇 XP 남았는지 계산한다. Lv.5(상한 없음)는 isMaxLevel로 처리.
 */
export type LevelProgress = {
  levelLabel: LearningLevel;
  /** 4개 구간 각각의 채움 비율 (0~1) — 진행바 렌더링용 */
  segmentFractions: [number, number, number, number];
  /** 지금 채우고 있는 단계 (1~4) */
  currentStage: number;
  /** 다음 단계(또는 다음 레벨)까지 남은 XP */
  xpToNext: number;
  /** 다음 단계까지인지 다음 레벨까지인지 */
  nextLabel: string;
  isMaxLevel: boolean;
};

export function getLevelProgress(totalXp: number): LevelProgress {
  const rank = getLevelRank(totalXp);

  if (!Number.isFinite(rank.maxXp)) {
    return {
      levelLabel: rank.level,
      segmentFractions: [1, 1, 1, 1],
      currentStage: 4,
      xpToNext: 0,
      nextLabel: "최고 레벨",
      isMaxLevel: true,
    };
  }

  const rangeSize = rank.maxXp - rank.minXp + 1;
  const fraction = Math.min(1, Math.max(0, (totalXp - rank.minXp) / rangeSize));
  const segmentFractions = [0, 1, 2, 3].map((i) =>
    Math.min(1, Math.max(0, fraction * 4 - i)),
  ) as [number, number, number, number];

  const segIndexInProgress = Math.min(3, Math.floor(fraction * 4));
  const currentStage = segIndexInProgress + 1;
  const segmentSize = rangeSize / 4;
  const nextBoundary = rank.minXp + (segIndexInProgress + 1) * segmentSize;
  const xpToNext = Math.max(0, Math.round(nextBoundary - totalXp));
  const nextLabel = currentStage < 4 ? "다음 단계까지" : "다음 레벨까지";

  return {
    levelLabel: rank.level,
    segmentFractions,
    currentStage,
    xpToNext,
    nextLabel,
    isMaxLevel: false,
  };
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

// ── BJJ 스타일 분석 ──────────────────────────────────────────────────────────

export type BjjStyle = {
  label: string;
  desc: string;
  dominant: Stream | null;
};

/**
 * 스트림별 수련 합계 + 총 세션 수 → BJJ 스타일 자동 도출.
 * 수련 기록이 하나도 없을 때만 "탐색 중" 반환.
 */
export function getBjjStyle(streamTotals: Record<string, number>, totalSessions: number): BjjStyle {
  const noData = { label: "탐색 중", desc: "수련 기록을 등록해 스타일을 완성하세요", dominant: null };

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
    return { label: "올라운더", desc: "공격·수비 균형 잡힌 올라운더", dominant: null };
  }

  const styleMap: Record<string, BjjStyle> = {
    "가드포지션": { label: "가드 스페셜리스트",   desc: "바텀에서 공격하는 가드 플레이어",          dominant: "가드포지션" },
    "탑포지션":   { label: "탑 게임 스페셜리스트", desc: "패스·서브미션으로 압박하는 탑 플레이어", dominant: "탑포지션"   },
    "이스케이프": { label: "이스케이프 아티스트",   desc: "어떤 위기에서도 빠져나오는 서바이버",       dominant: "이스케이프" },
    "스탠딩":     { label: "레슬러",               desc: "테이크다운으로 주도권을 잡는 레슬러",       dominant: "스탠딩"     },
  };

  return styleMap[top[0]] ?? { label: "올라운더", desc: "나만의 스타일 형성 중", dominant: null };
}

// ── 난이도 ────────────────────────────────────────────────────────────────
// 2026-09-14: 포지션 드릴다운 레벨링(Lv.1~4, 70% 클리어 규칙)과 선수 상세의
// 난이도별 그룹핑을 선수 중심 스킬트리 개편에 맞춰 제거함. `Difficulty` 타입과
// Technique.difficulty 필드/Airtable 데이터는 그대로 남겨둠(추후 다른 용도로
// 재사용 가능성 대비) — 다만 UI에서 노출하거나 레벨을 계산하는 코드는 없음.
// 이전 로직은 git 히스토리(commit 이전) 참고.
//
// (2026-09-19) 예전엔 여기 실제 벨트(BeltLevel) 등급 인덱스를 매기는
// beltIndex()가 있었는데, XP 기반 BELT_RANKS를 참조하고 있어 학습 레벨/실제
// 벨트 이원화 과정에서 제거함. 어디서도 import되지 않아 사용처 없음을 확인.
// 실제 벨트의 순서가 필요하면 ProfileEditor.tsx의 BELTS 배열 참고.
