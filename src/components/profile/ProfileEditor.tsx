"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/userProfile";
import { useToast } from "@/contexts/ToastContext";
import type { UserProfile } from "@/lib/supabase/userProfile";
import type { BeltLevel, Stream, Technique, TrainingSession } from "@/types/domain";
import { calculateStreak, getBjjStyle, getStreakBonus } from "@/types/domain";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import { TrainingReminderToggle } from "@/components/profile/TrainingReminderToggle";
import {
  Loader2, Pencil, Check, Flame, Trophy, CalendarCheck,
  Swords, Shield, Zap, Users, ChevronRight, type LucideIcon,
} from "lucide-react";

// ── 상수 ──────────────────────────────────────────────────────────────────

const BELTS: { value: BeltLevel; label: string }[] = [
  { value: "White Belt",  label: "White"  },
  { value: "Blue Belt",   label: "Blue"   },
  { value: "Purple Belt", label: "Purple" },
  { value: "Brown Belt",  label: "Brown"  },
  { value: "Black Belt",  label: "Black"  },
];

const STREAMS: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

const CAPSULE: Record<Stream, { text: string; bar: string; label: string; Icon: LucideIcon }> = {
  가드포지션: { text: "#7EC8FF", bar: "#2E80F0", label: "가드",       Icon: Shield },
  탑포지션:   { text: "#FFB347", bar: "#FF8C42", label: "탑",         Icon: Swords },
  이스케이프: { text: "#C4A4FF", bar: "#A78BFA", label: "이스케이프", Icon: Zap    },
  스탠딩:     { text: "#FFE066", bar: "#FBBF24", label: "스탠딩",     Icon: Users  },
};

// 공통 카드 스타일 (홈/캘린더 디자인 시스템과 동일)
const CARD = {
  backgroundColor: "#1A1A24",
  border: "1px solid rgba(255,255,255,0.1)",
} as const;

const SECTION_GAP = { marginBottom: "20px" } as const;

// ── 컴포넌트 ──────────────────────────────────────────────────────────────

export function ProfileEditor({
  profile,
  sessions,
  techniques,
  trainingCountMap,
}: {
  profile: UserProfile;
  sessions: TrainingSession[];
  techniques: Technique[];
  trainingCountMap: Record<string, number>;
}) {
  const [belt,     setBelt]     = useState<BeltLevel>(profile.belt);
  const [stripe,   setStripe]   = useState(profile.stripe);
  const [nickname, setNickname] = useState(profile.nickname);
  const [editing,  setEditing]  = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const maxStripe = belt === "Black Belt" ? 6 : 4;
  const cfg       = BELT_CONFIG[belt] ?? BELT_CONFIG["White Belt"];

  // ── 통계 계산 ────────────────────────────────────────────────────────────
  const totalXp    = sessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const totalDays  = new Set(sessions.map((s) => s.date)).size;
  const streak     = calculateStreak(sessions);
  const streakBonus = getStreakBonus(streak);

  const streamTotals: Record<Stream, number> = { 가드포지션: 0, 탑포지션: 0, 이스케이프: 0, 스탠딩: 0 };
  for (const t of techniques) {
    if (t.stream && t.stream in streamTotals) {
      streamTotals[t.stream as Stream] += trainingCountMap[t.recordId] ?? 0;
    }
  }
  const totalReps   = Object.values(streamTotals).reduce((a, b) => a + b, 0);
  const maxStream   = Math.max(...Object.values(streamTotals), 1);
  const bjjStyle    = getBjjStyle(streamTotals, sessions.length);
  const topStream   = STREAMS.reduce((a, b) => (streamTotals[a] >= streamTotals[b] ? a : b));
  const topCap      = CAPSULE[topStream];
  const sortedStreams = [...STREAMS].sort((a, b) => streamTotals[b] - streamTotals[a]);

  const beltIndex = BELTS.findIndex((b) => b.value === belt);

  function handleBeltChange(b: BeltLevel) {
    setBelt(b);
    const max = b === "Black Belt" ? 6 : 4;
    if (stripe > max) setStripe(max);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updateProfileAction(belt, stripe, nickname);
      if (res.ok) {
        toast.show("success", "프로필이 저장됐습니다.");
        setEditing(false);
        router.refresh();
      } else {
        toast.show("error", res.error ?? "저장에 실패했습니다.");
      }
    });
  }

  function handleCancel() {
    setBelt(profile.belt);
    setStripe(profile.stripe);
    setNickname(profile.nickname);
    setEditing(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── 헤더 ───────────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between" style={SECTION_GAP}>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">프로필</h1>
          <p className="text-sm mt-1" style={{ color: "#B4BCC8" }}>
            나의 주짓수 여정과 기록
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 active:scale-95 transition-all duration-fast"
            style={{ backgroundColor: "rgba(123,97,255,0.15)" }}
          >
            <Pencil size={13} style={{ color: "#A78BFA" }} />
            <span className="text-[12px] font-bold" style={{ color: "#A78BFA" }}>수정</span>
          </button>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════════
          1. 히어로 카드 — 아바타 + 닉네임 + 벨트 + 스타일
          ════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl p-4 overflow-hidden relative" style={{ ...CARD, ...SECTION_GAP }}>
        {/* 배경 글로우 */}
        <div
          className="absolute -right-10 -top-10 pointer-events-none"
          style={{
            width: 160, height: 160, borderRadius: "50%",
            background: `radial-gradient(circle, ${cfg.bodyGrad[0]}33 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {/* 아바타 */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-2xl font-black"
              style={{
                background: "linear-gradient(135deg, #7B61FF, #B44FD4)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(123,97,255,0.35)",
              }}
            >
              {(nickname.charAt(0) || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-black text-white truncate leading-tight">
                {nickname || "아쿠아"}
              </p>
              <p className="text-sm font-bold mt-1" style={{ color: cfg.textColor }}>
                {belt}{stripe > 0 ? ` · ${stripe} Stripe` : ""}
              </p>
              {/* 스타일 배지 */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mt-2"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <span style={{ fontSize: 13 }}>{bjjStyle.emoji}</span>
                <span className="text-[11px] font-semibold" style={{ color: "#B4BCC8" }}>
                  {bjjStyle.label}
                </span>
              </div>
            </div>
          </div>

          {/* 벨트 시각화 */}
          <BeltDisplay belt={belt} stripe={stripe} height={28} tipWidth={64} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. 통계 그리드 (2x2)
          ════════════════════════════════════════════════════════════════ */}
      <div style={{ ...SECTION_GAP }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "#6B7280" }}>
          나의 기록
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<Trophy size={16} style={{ color: "#FBBF24" }} />}
            label="누적 XP"
            value={totalXp.toLocaleString()}
            accent="#FBBF24"
          />
          <StatCard
            icon={<CalendarCheck size={16} style={{ color: "#A78BFA" }} />}
            label="총 수련일"
            value={`${totalDays}일`}
            accent="#A78BFA"
          />
          <StatCard
            icon={<Flame size={16} style={{ color: "#FF7800" }} />}
            label="연속 스트릭"
            value={`${streak}일`}
            accent="#FF7800"
            sub={streakBonus > 0 ? `보너스 +${streakBonus} XP` : undefined}
          />
          <StatCard
            icon={<topCap.Icon size={16} style={{ color: topCap.text }} />}
            label="최강 스트림"
            value={totalReps > 0 ? topCap.label : "—"}
            accent={topCap.text}
            sub={totalReps > 0 ? `${streamTotals[topStream]}회 수련` : "기록 없음"}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. 스트림 분포
          ════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl p-4" style={{ ...CARD, ...SECTION_GAP }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
            스트림 분포
          </p>
          <span className="text-[10px] tabular-nums font-semibold" style={{ color: "#3A3A4A" }}>
            총 {totalReps}회
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sortedStreams.map((stream) => {
            const cap    = CAPSULE[stream];
            const cnt    = streamTotals[stream];
            const isTop  = stream === topStream && cnt > 0;
            const pct    = totalReps > 0 ? Math.round((cnt / totalReps) * 100) : 0;
            const barPct = (cnt / maxStream) * 100;
            const minPct = cnt > 0 ? 6 : 3;
            return (
              <div key={stream} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "52px", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                  <cap.Icon size={15} color={isTop ? cap.text : "#4A4A5A"} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: isTop ? cap.text : "#4A4A5A" }}>
                    {cap.label}
                  </span>
                </div>
                <div style={{ flex: 1, height: "26px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.max(barPct, minPct)}%`,
                      height: "100%",
                      borderRadius: "999px",
                      backgroundColor: isTop ? cap.bar : cnt > 0 ? cap.bar + "70" : "rgba(255,255,255,0.04)",
                      boxShadow: isTop ? `0 0 12px ${cap.bar}50` : "none",
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
                <span style={{ width: "28px", fontSize: "10px", fontWeight: 700, textAlign: "right", flexShrink: 0, color: isTop ? cap.text : "#3A3A4A" }}>
                  {cnt > 0 ? `${pct}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. 벨트 여정
          ════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl p-4" style={{ ...CARD, ...SECTION_GAP }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: "#6B7280" }}>
          벨트 여정
        </p>
        <div className="flex items-end justify-between gap-1.5">
          {BELTS.map((b, i) => {
            const bCfg     = BELT_CONFIG[b.value];
            const isCurrent = i === beltIndex;
            const isPast    = i < beltIndex;
            const reached   = i <= beltIndex;
            return (
              <div key={b.value} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
                {/* 색상 스왓치 바 */}
                <div
                  style={{
                    width: "100%",
                    height: isCurrent ? "40px" : "26px",
                    borderRadius: "8px",
                    background: reached
                      ? `linear-gradient(180deg, ${bCfg.bodyGrad[0]}, ${bCfg.bodyGrad[1]})`
                      : "rgba(255,255,255,0.05)",
                    opacity: isPast ? 0.55 : 1,
                    border: isCurrent ? `1.5px solid ${bCfg.bodyGrad[0]}` : "1.5px solid transparent",
                    boxShadow: isCurrent ? `0 0 14px ${bCfg.bodyGrad[0]}66` : "none",
                    transition: "all 0.4s ease",
                  }}
                />
                <span
                  className="text-[10px] font-bold leading-none"
                  style={{ color: isCurrent ? bCfg.textColor : reached ? "#6B7280" : "#3A3A4A" }}
                >
                  {b.label}
                </span>
                {isCurrent && (
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded-full font-bold leading-none"
                    style={{ backgroundColor: `${bCfg.bodyGrad[0]}22`, color: bCfg.textColor }}
                  >
                    NOW
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. 알림 설정 (네이티브 앱에서만 노출)
          ════════════════════════════════════════════════════════════════ */}
      <TrainingReminderToggle />

      {/* ════════════════════════════════════════════════════════════════
          6. 편집 영역 (수정 모드에서만 노출)
          ════════════════════════════════════════════════════════════════ */}
      {editing && (
        <>
          {/* 닉네임 */}
          <section className="rounded-2xl p-4 space-y-3" style={{ ...CARD, ...SECTION_GAP }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
              Nickname
            </p>
            <input
              type="text"
              value={nickname}
              maxLength={20}
              onChange={(e) => { setNickname(e.target.value); }}
              className="w-full h-11 rounded-xl px-4 text-sm font-medium text-text-primary placeholder:text-text-disabled outline-none transition-colors duration-fast"
              style={{ backgroundColor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="닉네임 입력"
            />
          </section>

          {/* 벨트 선택 */}
          <section className="rounded-2xl p-4 space-y-4" style={{ ...CARD, ...SECTION_GAP }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
              Belt
            </p>
            <div className="space-y-2.5">
              {BELTS.map((b) => {
                const active = belt === b.value;
                const bCfg   = BELT_CONFIG[b.value];
                return (
                  <button
                    key={b.value}
                    onClick={() => handleBeltChange(b.value)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-fast active:scale-[0.98]"
                    style={{
                      backgroundColor: active ? "rgba(255,255,255,0.04)" : "#0A0A0F",
                      border: active ? `1.5px solid ${bCfg.bodyGrad[0]}55` : "1.5px solid transparent",
                    }}
                  >
                    <div style={{ width: 120, flexShrink: 0 }}>
                      <BeltDisplay
                        belt={b.value}
                        stripe={belt === b.value ? stripe : 0}
                        fullWidth={false}
                        height={18}
                        tipWidth={38}
                        className="w-full"
                      />
                    </div>
                    <span
                      className="text-sm font-bold flex-1 text-left"
                      style={{ color: active ? bCfg.textColor : "#4A4A5A" }}
                    >
                      {b.value}
                    </span>
                    {active && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bCfg.bodyGrad[0] }} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 그랄 선택 */}
          <section className="rounded-2xl p-4 space-y-3" style={{ ...CARD, ...SECTION_GAP }}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
                Stripe
              </p>
              <span className="text-sm font-bold" style={{ color: cfg.textColor }}>
                {stripe} / {maxStripe}
              </span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: maxStripe + 1 }).map((_, i) => {
                const active = stripe === i;
                return (
                  <button
                    key={i}
                    onClick={() => { setStripe(i); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: active ? cfg.bodyGrad[0] + "22" : "#0A0A0F",
                      color:           active ? cfg.textColor : "#4A4A5A",
                      border:          active ? `1.5px solid ${cfg.bodyGrad[0]}` : "1.5px solid transparent",
                    }}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 저장 / 취소 */}
          <div className="flex gap-2.5">
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-5 py-3 rounded-xl font-bold text-[14px] active:scale-[0.97] transition-all duration-fast"
              style={{ backgroundColor: "#22222E", color: "#B4BCC8" }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-bold text-white text-[14px] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
              style={{
                background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)",
                boxShadow:  "0 4px 16px rgba(123,97,255,0.35)",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Check size={16} /> 저장하기</>}
            </button>
          </div>
        </>
      )}

      {/* 수정 모드 아닐 때 안내 */}
      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform duration-fast"
          style={CARD}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(123,97,255,0.15)" }}
            >
              <Pencil size={15} style={{ color: "#A78BFA" }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">프로필 수정</p>
              <p className="text-[11px]" style={{ color: "#6B7280" }}>승급하면 벨트·그랄을 업데이트하세요</p>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: "#4A4A5A" }} />
        </button>
      )}
    </div>
  );
}

// ── 서브 컴포넌트 ───────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, accent, sub,
}: {
  icon: React.ReactNode; label: string; value: string; accent: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl p-3.5" style={CARD}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>
          {label}
        </span>
      </div>
      <p className="text-xl font-black tabular-nums leading-none" style={{ color: accent }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] mt-1.5" style={{ color: "#6B7280" }}>{sub}</p>
      )}
    </div>
  );
}
