import type { Technique, TrainingSession, Stream } from "@/types/domain";
import { getBjjStyle, calculateStreak } from "@/types/domain";
import type { UserProfile } from "@/lib/supabase/userProfile";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import Link from "next/link";
import { Swords, Shield, Zap, Users, type LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowRight, Bell, Dumbbell } from "lucide-react";

// ── 상수 ───────────────────────────────────────────────────────────────────

const USER_NAME = "아쿠아";

const STREAMS: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * 홈 화면 히어로 카드 컷코너 — 스킬트리 AthleteHeroCard와 동일한 시각 언어.
 * 시안(Concept A)과 동일하게 카드 크기에 비례하는 %기반 대각선 컷 사용
 * (고정 px는 넓은 풀블리드 카드에서 컷이 거의 안 보이는 문제가 있어 2026-09-14 수정).
 */
const HERO_CLIP_TR_BL =
  "polygon(0 0, 85% 0, 100% 16%, 100% 100%, 15% 100%, 0 84%)";
const HERO_CLIP_TL =
  "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 15%)";

/** 레퍼런스 파스텔 캡슐 컬러 */
const CAPSULE: Record<Stream, { bg: string; text: string; bar: string; label: string; emoji: string; IconCmp: LucideIcon }> = {
  가드포지션: { bg: "#1A3050", text: "#7EC8FF", bar: "#2E80F0", label: "가드",   emoji: "🛡", IconCmp: Shield },
  탑포지션:   { bg: "#3A1F00", text: "#FFB347", bar: "#FF8C42", label: "탑",     emoji: "⚔️", IconCmp: Swords },
  이스케이프: { bg: "#2A1050", text: "#C4A4FF", bar: "#A78BFA", label: "이스케이프", emoji: "🏃", IconCmp: Zap },
  스탠딩:     { bg: "#2A2400", text: "#FFE066", bar: "#FBBF24", label: "스탠딩", emoji: "🥋", IconCmp: Users },
};



// ── 유틸 ───────────────────────────────────────────────────────────────────

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function padDate(n: number) {
  return String(n).padStart(2, "0");
}

// ── 약점 분석 ──────────────────────────────────────────────────────────────

type StreamStats = { stream: Stream; total: number; pct: number };
type WeaknessResult = {
  weakestStream: Stream;
  topStream: Stream;
  weakTotal: number;
  topTotal: number;
  gapPct: number;
  recommendations: Technique[];
};

/**
 * 약점 스트림 감지 — 두 조건을 모두 만족해야 카드 표시
 * 1) 전체 수련 합계 5회 이상
 * 2) 최강 스트림이 최약(수련 있는) 스트림의 3배 이상, 또는 수련이 전혀 없는 스트림 존재
 */
function analyzeWeakness(
  streamTotals: Record<Stream, number>,
  techniques: Technique[],
  countMap: Record<string, number>,
): WeaknessResult | null {
  const grandTotal = Object.values(streamTotals).reduce((a, b) => a + b, 0);

  // 최소 데이터 기준 미달 → 숨김
  if (grandTotal < 5) return null;

  const sorted = [...STREAMS].sort((a, b) => streamTotals[b] - streamTotals[a]);
  const topStream    = sorted[0];
  const topTotal     = streamTotals[topStream];

  // 수련이 0인 스트림: 가장 앞에 있는 것을 약점으로
  const zeroStreams   = sorted.filter((s) => streamTotals[s] === 0);
  const weakestStream = zeroStreams.length > 0
    ? zeroStreams[0]
    : sorted[sorted.length - 1];
  const weakTotal     = streamTotals[weakestStream];

  // 격차 조건: 최강이 최약(0 제외 시 최소값)의 3배 이상이거나, 0인 스트림 존재
  const nonZeroSorted = sorted.filter((s) => streamTotals[s] > 0);
  const minNonZero    = nonZeroSorted.length > 0 ? streamTotals[nonZeroSorted[nonZeroSorted.length - 1]] : 0;
  const hasGap        = zeroStreams.length > 0 || (minNonZero > 0 && topTotal / minNonZero >= 3);

  if (!hasGap) return null;

  // 격차 계산 (퍼센트포인트)
  const topPct    = grandTotal > 0 ? Math.round((topTotal / grandTotal) * 100) : 0;
  const weakPct   = grandTotal > 0 ? Math.round((weakTotal / grandTotal) * 100) : 0;
  const gapPct    = topPct - weakPct;

  // 추천 기술: 약점 스트림에서 XP가 높은 순 → 미수련 우선
  const recs = techniques
    .filter((t) => t.stream === weakestStream)
    .sort((a, b) => {
      const aCount = countMap[a.recordId] ?? 0;
      const bCount = countMap[b.recordId] ?? 0;
      // 미수련(0) 우선, 그 다음 XP 높은 순
      if (aCount === 0 && bCount > 0) return -1;
      if (aCount > 0 && bCount === 0) return 1;
      return (b.xpValue ?? 0) - (a.xpValue ?? 0);
    })
    .slice(0, 3);

  return { weakestStream, topStream, weakTotal, topTotal, gapPct, recommendations: recs };
}

// ══════════════════════════════════════════════════════════════════════════
//  메인 컴포넌트
// ══════════════════════════════════════════════════════════════════════════

export function HomeDashboard({
  sessions,
  techniques,
  trainingCountMap,
  profile,
}: {
  sessions: TrainingSession[];
  techniques: Technique[];
  trainingCountMap: Record<string, number>;
  profile: UserProfile;
}) {
  const today = new Date();
  const todayKey = ymd(today);

  // ── 기본 계산
  const totalXp   = sessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const streak    = calculateStreak(sessions);
  const hasTodaySession = sessions.some((s) => s.date === todayKey);

  // 벨트는 프로필에서 직접 가져옴 (XP 계산 아님)
  const beltCfg = BELT_CONFIG[profile.belt] ?? BELT_CONFIG["White Belt"];
  const stripe  = profile.stripe;

  // XP 바: 이번 달 수련 활동 지표로 활용
  const thisMonthKey = todayKey.slice(0, 7); // "YYYY-MM"
  const monthXp = sessions
    .filter((s) => s.date?.startsWith(thisMonthKey))
    .reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const monthXpGoal = 2000; // 월 목표 XP
  const monthProgress = Math.min(100, (monthXp / monthXpGoal) * 100);

  // ── 주간 7일 (오늘 기준 Mon-Sun 정렬)
  // 오늘이 속한 주의 월요일부터 일요일까지
  const todayDow = today.getDay(); // 0=일 1=월 ... 6=토
  const mondayOffset = (todayDow === 0 ? -6 : 1 - todayDow); // 월요일까지 오프셋
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    weekDays.push(ymd(d));
  }
  const sessionDateSet = new Set(sessions.map((s) => s.date));

  // ── 이번 주 통계
  const weekSessions   = sessions.filter((s) => weekDays.includes(s.date));
  const weekXp         = weekSessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const weekDayCount   = new Set(weekSessions.map((s) => s.date)).size;

  // ── 스트림 훈련 합계 (캡슐 높이)
  const streamTotals: Record<Stream, number> = {
    가드포지션: 0, 탑포지션: 0, 이스케이프: 0, 스탠딩: 0,
  };
  for (const t of techniques) {
    if (t.stream && t.stream in streamTotals) {
      streamTotals[t.stream as Stream] += trainingCountMap[t.recordId] ?? 0;
    }
  }
  const maxStreamTotal = Math.max(...Object.values(streamTotals), 1);
  const bjjStyle       = getBjjStyle(streamTotals, sessions.length);
  const weakness       = analyzeWeakness(streamTotals, techniques, trainingCountMap);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  렌더
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A0F" }}>

      {/* ════════════════════════════════════════════════════════════════
          1. 프로필 헤더  (레퍼런스: avatar + "Hello, Name" + "Welcome Back" + 벨)
          ════════════════════════════════════════════════════════════════ */}
      <header
        className="px-4 shrink-0"
        style={{ paddingTop: "max(20px, env(safe-area-inset-top) + 12px)", paddingBottom: "12px" }}
      >
        <div className="flex items-center justify-between gap-3">

          {/* 왼쪽: 아바타 + 텍스트 */}
          <div className="flex items-center gap-3 min-w-0">
            {/* 아바타 원형 — /profile 링크 */}
            <Link href="/profile">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform duration-fast"
                style={{ background: "linear-gradient(135deg, #7B61FF, #B44FD4)" }}
              >
                <span className="text-white font-black text-xl leading-none">
                  {USER_NAME.charAt(0)}
                </span>
              </div>
            </Link>

            {/* 텍스트 */}
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: "#B4BCC8" }}>
                Hello, {USER_NAME} 👋
              </p>
              <h1 className="text-[26px] font-black tracking-tight leading-tight text-white">
                Welcome Back
              </h1>
            </div>
          </div>

          {/* 오른쪽: 벨 아이콘 */}
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform duration-fast"
            style={{ backgroundColor: "#1A1A24" }}
            aria-label="알림"
          >
            <Bell size={18} style={{ color: "#B4BCC8" }} />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          2. 주간 캘린더 스트립  (레퍼런스: Mon-Sun + 날짜 + 오늘 퍼플 필)
          ════════════════════════════════════════════════════════════════ */}
      <div className="px-4 pt-1 pb-3 shrink-0">
        <div className="flex gap-1">
          {weekDays.map((dateStr) => {
            const d          = new Date(dateStr + "T12:00:00");
            const dayLabel   = DAY_EN[d.getDay()];
            const dateNum    = padDate(d.getDate());
            const isToday    = dateStr === todayKey;
            const trained    = sessionDateSet.has(dateStr);
            const isFuture   = dateStr > todayKey;

            return (
              /* 요일 + 날짜를 하나의 pill 컨테이너 안에 — 레퍼런스 동일 구조 */
              <div
                key={dateStr}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl"
                style={{
                  backgroundColor: isToday
                    ? "#7B61FF"
                    : trained
                    ? "rgba(123,97,255,0.16)"
                    : "rgba(255,255,255,0.04)",
                }}
              >
                {/* 요일명 (pill 안) */}
                <span
                  className="text-[11px] font-semibold leading-none"
                  style={{
                    color: isToday
                      ? "rgba(255,255,255,0.75)"
                      : isFuture
                      ? "#4A4A5A"
                      : trained
                      ? "#A78BFA"
                      : "#4A4A5A",
                  }}
                >
                  {dayLabel}
                </span>

                {/* 날짜 숫자 (pill 안) */}
                <span
                  className="text-[15px] font-black tabular-nums leading-none"
                  style={{
                    color: isToday
                      ? "#FFFFFF"
                      : trained
                      ? "#A78BFA"
                      : isFuture
                      ? "#4A4A5A"
                      : "#4A4A5A",
                  }}
                >
                  {dateNum}
                </span>

                {/* 수련 완료 점 (오늘 아닌 수련일) */}
                {trained && !isToday && (
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#7B61FF" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          스크롤 콘텐츠
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-2"
        style={{ paddingBottom: "max(96px, env(safe-area-inset-bottom) + 80px)" }}
      >

        {/* ──────────────────────────────────────────────────────────────
            3. 오늘의 수련 카드  (레퍼런스: Today's Workout 카드)
            ────────────────────────────────────────────────────────────── */}
        {!hasTodaySession ? (
          /* 미수련 → CTA 카드 — 히어로카드 스타일(컷코너+네온글로우) */
          <div
            style={{
              clipPath: HERO_CLIP_TR_BL,
              background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)",
              padding: "1.5px",
              marginBottom: "20px",
              filter: "drop-shadow(0 0 18px rgba(123,97,255,0.4))",
            }}
          >
          <section
            className="p-4 overflow-hidden relative"
            style={{
              clipPath: HERO_CLIP_TR_BL,
              background: "linear-gradient(160deg, rgba(123,97,255,0.22) 0%, #1A1A24 55%)",
            }}
          >
            {/* 배경 워터마크 아이콘 */}
            <div
              className="absolute -right-4 -bottom-4 pointer-events-none select-none"
              style={{ opacity: 0.08 }}
            >
              <Dumbbell size={120} color="#FFFFFF" />
            </div>

            {/* 콘텐츠 */}
            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                 style={{ color: "#6B7280" }}>
                Today&apos;s Training
              </p>

              {/* A안: 아이콘 배지 + 스타일명 */}
              <div className="flex items-center gap-3.5 mb-4">
                {/* 아이콘 배지 */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(123,97,255,0.15)",
                  }}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{bjjStyle.emoji}</span>
                </div>
                {/* 텍스트 */}
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-white leading-snug">
                    {bjjStyle.label}
                  </h2>
                  <p className="text-sm mt-0.5 truncate" style={{ color: "#B4BCC8" }}>
                    {bjjStyle.desc}
                  </p>
                </div>
              </div>

              {/* 수치 행 */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🔥</span>
                  <span className="text-sm font-bold" style={{ color: "#F5F7FA" }}>
                    {weekXp > 0 ? `+${weekXp.toLocaleString()} XP` : "0 XP"}
                  </span>
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>이번 주</span>
                </div>
                <div className="w-px h-4" style={{ backgroundColor: "#2A2A38" }} />
                <div className="flex items-center gap-1.5">
                  <span className="text-base">⏱</span>
                  <span className="text-sm font-bold" style={{ color: "#F5F7FA" }}>
                    {weekDayCount}일
                  </span>
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>수련</span>
                </div>
                {streak >= 2 && (
                  <>
                    <div className="w-px h-4" style={{ backgroundColor: "#2A2A38" }} />
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🔥</span>
                      <span className="text-sm font-bold" style={{ color: "#FF7800" }}>
                        {streak}일 스트릭
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* 그라디언트 CTA 버튼 — w-full */}
              <Link
                href="/calendar"
                className="flex items-center justify-center w-full py-3 rounded-xl font-bold text-white text-[14px] hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
                style={{
                  background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)",
                  boxShadow: "0 0 16px rgba(180,79,212,0.5)",
                }}
              >
                수련 기록하기
              </Link>
            </div>
          </section>
          </div>
        ) : (
          /* 수련 완료 → 완료 카드 — 그린 톤 히어로카드 */
          <div
            style={{
              clipPath: HERO_CLIP_TR_BL,
              background: "linear-gradient(135deg, #34D399 0%, #0F6E56 100%)",
              padding: "1.5px",
              marginBottom: "20px",
              filter: "drop-shadow(0 0 18px rgba(52,211,153,0.35))",
            }}
          >
          <section
            className="p-4 overflow-hidden relative"
            style={{
              clipPath: HERO_CLIP_TR_BL,
              background: "linear-gradient(160deg, rgba(52,211,153,0.18) 0%, #1A1A24 55%)",
            }}
          >
            <div className="absolute -right-4 -bottom-4 pointer-events-none select-none" style={{ opacity: 0.08 }}>
              <Dumbbell size={120} color="#34D399" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6B7280" }}>
                Today&apos;s Training
              </p>
              <h2 className="text-lg font-black text-white mb-1">오늘 수련 완료! ✅</h2>
              <p className="text-sm mb-4" style={{ color: "#B4BCC8" }}>훌륭해요. 오늘도 도장에 나왔군요.</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>🔥</span>
                  <span className="text-sm font-bold text-white">{weekXp.toLocaleString()} XP</span>
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>이번 주</span>
                </div>
                {streak >= 2 && (
                  <>
                    <div className="w-px h-4" style={{ backgroundColor: "#2A2A38" }} />
                    <div className="flex items-center gap-1.5">
                      <span>🔥</span>
                      <span className="text-sm font-bold" style={{ color: "#FF7800" }}>{streak}일 연속</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
          </div>
        )}

        {/* ── 벨트 레벨 카드 — 히어로카드 스타일(컷코너+벨트색 글로우, 큰 XP 숫자) ── */}
        <Link href="/profile">
          <div
            style={{
              clipPath: HERO_CLIP_TL,
              background: `linear-gradient(135deg, ${beltCfg.bodyGrad[0]}, ${beltCfg.bodyGrad[1]})`,
              padding: "1.5px",
              marginBottom: "20px",
              filter: `drop-shadow(0 0 16px ${beltCfg.bodyGrad[1]}66)`,
            }}
            className="active:scale-[0.98] transition-transform duration-fast"
          >
          <section
            className="p-4"
            style={{
              clipPath: HERO_CLIP_TL,
              background: `linear-gradient(150deg, ${beltCfg.bodyGrad[0]}26 0%, #1A1A24 60%)`,
            }}
          >
            {/* 상단: 히어로 스탯(총 XP)이 좌측 지배적 요소, 벨트명은 보조 정보로 우측 */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className="font-black tabular-nums tracking-tight leading-none"
                  style={{
                    fontSize: 44,
                    color: beltCfg.textColor,
                    textShadow: `0 0 20px ${beltCfg.bodyGrad[1]}, 0 0 42px ${beltCfg.bodyGrad[1]}80`,
                  }}
                >
                  {totalXp.toLocaleString()}
                </p>
                <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5"
                   style={{ color: beltCfg.bodyGrad[1] }}>Total XP</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5"
                   style={{ color: "#6B7280" }}>Current Belt</p>
                <p className="text-base font-black" style={{ color: beltCfg.textColor }}>
                  {profile.belt}
                </p>
              </div>
            </div>

            {/* 벨트 형태 시각화 */}
            <BeltDisplay
              belt={profile.belt}
              stripe={stripe}
              height={20}
              tipWidth={48}
              className="mb-3"
            />

            {/* 이번 달 활동 바 */}
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${monthProgress}%`,
                    background: `linear-gradient(90deg, ${beltCfg.bodyGrad[0]}, ${beltCfg.bodyGrad[1]})`,
                    boxShadow: `0 0 8px ${beltCfg.bodyGrad[1]}`,
                    transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px]">
                <span style={{ color: "#6B7280" }}>이번 달 활동</span>
                <span style={{ color: beltCfg.textColor }}>
                  {monthXp.toLocaleString()} / {monthXpGoal.toLocaleString()} XP
                </span>
              </div>
            </div>
          </section>
          </div>
        </Link>

        {/* ── 스트림 강도 ─────────────────────────────────────────────── */}
        <section className="rounded-2xl p-4" style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" }}>

          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
              스트림 강도
            </p>
            <span className="text-[10px] tabular-nums font-semibold" style={{ color: "#3A3A4A" }}>
              총 {Object.values(streamTotals).reduce((a, b) => a + b, 0)}회
            </span>
          </div>

          {/* 가로 바 행 — 횟수 기준 내림차순 */}
          {(() => {
            const totalAll  = Object.values(streamTotals).reduce((a, b) => a + b, 0);
            const sorted    = [...STREAMS].sort((a, b) => streamTotals[b] - streamTotals[a]);
            const topStream = sorted[0];

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {sorted.map((stream) => {
                  const cap    = CAPSULE[stream];
                  const cnt    = streamTotals[stream];
                  const isTop  = stream === topStream && cnt > 0;
                  const pct    = totalAll > 0 ? Math.round((cnt / totalAll) * 100) : 0;
                  const barPct = maxStreamTotal > 0 ? (cnt / maxStreamTotal) * 100 : 0;
                  const minPct = cnt > 0 ? 6 : 3;

                  return (
                    <div key={stream} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* 라벨 */}
                      <div style={{ width: "52px", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                        <cap.IconCmp size={15} color={isTop ? cap.text : "#4A4A5A"} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: isTop ? cap.text : "#4A4A5A" }}>
                          {cap.label}
                        </span>
                      </div>

                      {/* 바 트랙 */}
                      <div style={{ flex: 1, height: "28px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${Math.max(barPct, minPct)}%`,
                            height: "100%",
                            borderRadius: "999px",
                            background: isTop
                              ? `linear-gradient(90deg, ${cap.bar}, ${cap.text})`
                              : cnt > 0 ? cap.bar + "70" : "rgba(255,255,255,0.04)",
                            boxShadow: isTop ? `0 0 14px ${cap.bar}90` : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingRight: cnt > 0 ? "10px" : "0",
                            transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                          }}
                        >
                          {cnt > 0 && (
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                              {cnt}회
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 퍼센트 */}
                      <span style={{ width: "28px", fontSize: "10px", fontWeight: 700, textAlign: "right", flexShrink: 0, color: isTop ? cap.text : "#3A3A4A" }}>
                        {cnt > 0 ? `${pct}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* 구분선 */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "12px" }} />

          {/* 3개 스탯 칩 */}
          {(() => {
            const totalAll  = Object.values(streamTotals).reduce((a, b) => a + b, 0);
            const topStream = STREAMS.reduce((a, b) => streamTotals[a] >= streamTotals[b] ? a : b);
            const topCap    = CAPSULE[topStream];
            return (
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#F5F7FA", lineHeight: 1.2 }}>
                    {totalAll}
                  </div>
                  <div style={{ fontSize: "9px", color: "#6B7280", marginTop: "3px" }}>총 수련</div>
                </div>
                <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, lineHeight: 1.2, color: totalAll > 0 ? topCap.text : "#3A3A4A" }}>
                    {totalAll > 0 ? topCap.label : "—"}
                  </div>
                  <div style={{ fontSize: "9px", color: "#6B7280", marginTop: "3px" }}>최강 스트림</div>
                </div>
                <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#F5F7FA", lineHeight: 1.2 }}>
                    {weekDayCount}
                  </div>
                  <div style={{ fontSize: "9px", color: "#6B7280", marginTop: "3px" }}>이번 주 수련일</div>
                </div>
              </div>
            );
          })()}

        </section>

        {/* ── 약점 스트림 카드 ───────────────────────────────────────── */}
        {weakness && (() => {
          const wCap   = CAPSULE[weakness.weakestStream];
          const topCap = CAPSULE[weakness.topStream];
          return (
            <section
              className="rounded-2xl p-4"
              style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" }}
            >
              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#F87171", flexShrink: 0 }} />
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
                  약점 스트림 감지
                </p>
              </div>

              {/* 격차 강조 행 */}
              <div
                className="flex items-center justify-between rounded-xl px-3 py-3 mb-4"
                style={{ backgroundColor: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)" }}
              >
                <div className="flex items-center gap-3">
                  <wCap.IconCmp size={24} color="#FCA5A5" />
                  <div>
                    <p className="text-sm font-black leading-tight" style={{ color: "#FCA5A5" }}>
                      {wCap.label} 강화 필요
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
                      {topCap.label} 대비 수련 비율 격차
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black tabular-nums" style={{ color: "#F87171" }}>
                    −{weakness.gapPct}%p
                  </p>
                  <p className="text-[9px]" style={{ color: "#6B7280" }}>격차</p>
                </div>
              </div>

              {/* 추천 기술 */}
              {weakness.recommendations.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#6B7280" }}>
                    지금 연습하면 좋은 기술
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {weakness.recommendations.map((t) => {
                      const cnt = trainingCountMap[t.recordId] ?? 0;
                      return (
                        <Link
                          key={t.recordId}
                          href={`/tree/${t.parentId ?? ""}/${t.recordId}`}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 active:scale-[0.98] transition-transform duration-fast"
                          style={{ backgroundColor: "#22222E" }}
                        >
                          <wCap.IconCmp size={14} color={wCap.text} />
                          <span className="flex-1 text-sm font-semibold text-white truncate">
                            {t.nameKo}
                          </span>
                          {t.xpValue != null && (
                            <span
                              className="text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0"
                              style={{ backgroundColor: "rgba(167,139,250,0.18)", color: "#A78BFA" }}
                            >
                              XP {t.xpValue}
                            </span>
                          )}
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                            style={{ backgroundColor: wCap.bg, color: wCap.text }}
                          >
                            {cnt === 0 ? "미수련" : `${cnt}회`}
                          </span>
                          <ArrowRight size={12} style={{ color: wCap.bar }} className="shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })()}
      </div>
    </div>
  );
}
