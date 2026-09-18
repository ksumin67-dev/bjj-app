import type { Technique, TrainingSession, Stream, Athlete } from "@/types/domain";
import { getBjjStyle, calculateStreak } from "@/types/domain";
import type { UserProfile } from "@/lib/supabase/userProfile";
import Link from "next/link";
import { Swords, Shield, Zap, Users, type LucideIcon } from "lucide-react";
import { ArrowRight, Bell, Dumbbell, Flame, Calendar, Check, Heart } from "lucide-react";

// ── 상수 ───────────────────────────────────────────────────────────────────

const USER_NAME = "아쿠아";

const STREAMS: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * 스트림별 아이콘 + 라벨 — 기술도감 포지션 탭/기술 상세 페이지와 동일한
 * lucide 아이콘 체계(Shield/Swords/Zap/Users) 재사용. (2026-09-19 리뉴얼)
 * 색은 더 이상 스트림마다 다르게 배정하지 않음 — "데이터=액센트 색 하나"
 * 원칙에 따라 최강 스트림만 brand-primary, 나머지는 중립 회색으로 표시.
 */
const CAPSULE: Record<Stream, { label: string; IconCmp: LucideIcon }> = {
  가드포지션: { label: "가드", IconCmp: Shield },
  탑포지션:   { label: "탑", IconCmp: Swords },
  이스케이프: { label: "이스케이프", IconCmp: Zap },
  스탠딩:     { label: "스탠딩", IconCmp: Users },
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
  athletes,
  trainingCountMap,
  profile,
  goalTechniqueIds,
}: {
  sessions: TrainingSession[];
  techniques: Technique[];
  athletes: Athlete[];
  trainingCountMap: Record<string, number>;
  profile: UserProfile;
  goalTechniqueIds: string[];
}) {
  const today = new Date();
  const todayKey = ymd(today);

  // ── 기본 계산
  const totalXp   = sessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const streak    = calculateStreak(sessions);
  const hasTodaySession = sessions.some((s) => s.date === todayKey);

  // 벨트는 프로필에서 직접 가져옴 (XP 계산 아님)
  const stripe = profile.stripe;

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
  const bjjStyle       = getBjjStyle(streamTotals, sessions.length);
  const weakness       = analyzeWeakness(streamTotals, techniques, trainingCountMap);
  const TodayStyleIcon = bjjStyle.dominant ? CAPSULE[bjjStyle.dominant].IconCmp : Dumbbell;

  // 요약 한 줄용 — 벨트/XP/스트릭/최강 스트림은 프로필 화면에 이미 상세
  // 버전(벨트 여정, 스트림 분포)이 있어서 홈에서는 중복 섹션 대신 한 줄
  // 요약 + 프로필 링크로 축소 (2026-09-19, IA 정리)
  const totalReps = Object.values(streamTotals).reduce((a, b) => a + b, 0);
  const topStreamForSummary = STREAMS.reduce((a, b) => (streamTotals[a] >= streamTotals[b] ? a : b));

  // ── 학습 목표(찜한 기술) — 선수 상세에서 하트로 찜한 시그니처 기술
  const athleteNameMap = new Map(athletes.map((a) => [a.recordId, a.nameKo]));
  const goalIdSet = new Set(goalTechniqueIds);
  const goalTechniques = techniques
    .filter((t) => goalIdSet.has(t.recordId))
    .map((t) => ({
      technique: t,
      athleteName: t.athleteRecordIds[0] ? athleteNameMap.get(t.athleteRecordIds[0]) ?? null : null,
      trained: (trainingCountMap[t.recordId] ?? 0) > 0,
    }));

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
            {/* 아바타 원형 — /profile 링크. 퍼플-마젠타 그라디언트 → 브랜드
                앰버 단일 색으로 통일 (2026-09-19 리뉴얼) */}
            <Link href="/profile">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform duration-fast"
                style={{ backgroundColor: "#D9772E" }}
              >
                <span className="font-bold text-lg leading-none" style={{ color: "#0A0A0F" }}>
                  {USER_NAME.charAt(0)}
                </span>
              </div>
            </Link>

            {/* 텍스트 */}
            <div className="min-w-0">
              <p className="text-xs" style={{ color: "#8A8A94" }}>
                안녕하세요, {USER_NAME}
              </p>
              <h1 className="text-[19px] font-bold tracking-tight leading-snug text-white">
                오늘도 수련하러 가볼까요
              </h1>
            </div>
          </div>

          {/* 오른쪽: 벨 아이콘 */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform duration-fast"
            style={{ backgroundColor: "#1A1A24" }}
            aria-label="알림"
          >
            <Bell size={16} style={{ color: "#8A8A94" }} />
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
                    ? "#D9772E"
                    : trained
                    ? "#D9772E24"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {/* 요일명 (pill 안) */}
                <span
                  className="text-[11px] font-semibold leading-none"
                  style={{
                    color: isToday
                      ? "rgba(10,10,15,0.65)"
                      : isFuture
                      ? "#4A4A5A"
                      : trained
                      ? "#D9772E"
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
                      ? "#0A0A0F"
                      : trained
                      ? "#D9772E"
                      : isFuture
                      ? "#4A4A5A"
                      : "#4A4A5A",
                  }}
                >
                  {dateNum}
                </span>

                {/* 수련 완료 점 (오늘 아닌 수련일) */}
                {trained && !isToday && (
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#D9772E" }} />
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
            3. 오늘의 수련 — 박스 카드 제거, 플랫 섹션 (2026-09-19 리뉴얼)
            ────────────────────────────────────────────────────────────── */}
        {!hasTodaySession ? (
          /* 미수련 → CTA 섹션 */
          <section style={{ marginBottom: "20px" }}>
            <p className="text-[10px] tracking-[0.5px] font-semibold mb-2" style={{ color: "#8A8A94" }}>
              오늘의 수련
            </p>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#1A1A24" }}
              >
                <TodayStyleIcon size={20} color="#D9772E" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-white leading-snug">
                  {bjjStyle.label}
                </h2>
                <p className="text-xs mt-0.5 truncate" style={{ color: "#8A8A94" }}>
                  {bjjStyle.desc}
                </p>
              </div>
            </div>

            {/* 수치 행 */}
            <div className="flex items-center gap-3.5 mb-3 text-xs" style={{ color: "#8A8A94" }}>
              <span className="inline-flex items-center gap-1">
                <Flame size={13} color="#D9772E" />
                이번 주 <span className="font-semibold text-white">{weekXp.toLocaleString()} XP</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                <span className="font-semibold text-white">{weekDayCount}일</span> 수련
              </span>
              {streak >= 2 && (
                <span className="inline-flex items-center gap-1">
                  <Flame size={13} color="#D9772E" />
                  <span className="font-semibold" style={{ color: "#D9772E" }}>{streak}일 스트릭</span>
                </span>
              )}
            </div>

            {/* CTA 버튼 — 브랜드 앰버 단색 (그라디언트/그림자 제거) */}
            <Link
              href="/calendar"
              className="flex items-center justify-center w-full py-3 rounded-xl font-bold text-[14px] active:scale-[0.97] transition-transform duration-fast"
              style={{ backgroundColor: "#D9772E", color: "#0A0A0F" }}
            >
              수련 기록하기
            </Link>
          </section>
        ) : (
          /* 수련 완료 섹션 */
          <section style={{ marginBottom: "20px" }}>
            <p className="text-[10px] tracking-[0.5px] font-semibold mb-2" style={{ color: "#8A8A94" }}>
              오늘의 수련
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#1A1A24" }}
              >
                <Check size={20} color="#34D399" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-white leading-snug">오늘 수련 완료!</h2>
                <p className="text-xs mt-0.5" style={{ color: "#8A8A94" }}>훌륭해요. 오늘도 도장에 나왔군요.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 text-xs" style={{ color: "#8A8A94" }}>
              <span className="inline-flex items-center gap-1">
                <Flame size={13} color="#D9772E" />
                이번 주 <span className="font-semibold text-white">{weekXp.toLocaleString()} XP</span>
              </span>
              {streak >= 2 && (
                <span className="inline-flex items-center gap-1">
                  <Flame size={13} color="#D9772E" />
                  <span className="font-semibold" style={{ color: "#D9772E" }}>{streak}일 연속</span>
                </span>
              )}
            </div>
          </section>
        )}

        {/* ── 벨트/XP/스트릭/최강스트림 한 줄 요약 — 프로필 화면에 이미
            상세 버전(벨트 여정, 스트림 분포)이 있어서 홈에서는 중복
            섹션 대신 한 줄 요약 + 링크로 축소 (2026-09-19, IA 정리) ── */}
        <Link
          href="/profile"
          className="flex items-center justify-between gap-2 py-2.5 active:opacity-70 transition-opacity duration-fast"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}
        >
          <span className="text-[11.5px]" style={{ color: "#8A8A94" }}>
            {profile.belt} · {stripe}그랄 &nbsp;·&nbsp;{" "}
            <span className="font-semibold" style={{ color: "#D9772E" }}>{totalXp.toLocaleString()} XP</span>
            &nbsp;·&nbsp; {streak}일 스트릭 &nbsp;·&nbsp; {totalReps > 0 ? CAPSULE[topStreamForSummary].label : "—"} 최강
          </span>
          <ArrowRight size={13} style={{ color: "#5A5A64" }} className="shrink-0" />
        </Link>

        {/* ── 내가 배우고 싶은 기술(학습 목표) ─────────────────────────── */}
        {goalTechniques.length > 0 && (
          <section
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart size={13} fill="#F87171" color="#F87171" />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
                내가 배우고 싶은 기술
              </p>
              <span className="text-[10px] tabular-nums font-semibold ml-auto" style={{ color: "#3A3A4A" }}>
                {goalTechniques.length}개
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {goalTechniques.map(({ technique: t, athleteName, trained }) => (
                <Link
                  key={t.recordId}
                  href={`/tree/${t.parentId ?? ""}/${t.id}`}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 active:scale-[0.98] transition-transform duration-fast"
                  style={{ backgroundColor: "#22222E" }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white truncate block">{t.nameKo}</span>
                    {athleteName && (
                      <span className="text-[10px] truncate block" style={{ color: "#6B7280" }}>{athleteName}</span>
                    )}
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                    style={{
                      backgroundColor: trained ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                      color: trained ? "#34D399" : "#6B7280",
                    }}
                  >
                    {trained ? "수련중" : "미수련"}
                  </span>
                  <ArrowRight size={12} style={{ color: "#F87171" }} className="shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

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
                          <wCap.IconCmp size={14} color="#F87171" />
                          <span className="flex-1 text-sm font-semibold text-white truncate">
                            {t.nameKo}
                          </span>
                          {t.xpValue != null && (
                            <span
                              className="text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0"
                              style={{ backgroundColor: "#D9772E26", color: "#D9772E" }}
                            >
                              XP {t.xpValue}
                            </span>
                          )}
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#8A8A94" }}
                          >
                            {cnt === 0 ? "미수련" : `${cnt}회`}
                          </span>
                          <ArrowRight size={12} style={{ color: "#8A8A94" }} className="shrink-0" />
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
