"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/userProfile";
import { useToast } from "@/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/supabase/userProfile";
import type { BeltLevel, Stream, Technique, TrainingSession } from "@/types/domain";
import { calculateStreak, getBjjStyle, getStreakBonus } from "@/types/domain";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import { TrainingReminderToggle } from "@/components/profile/TrainingReminderToggle";
import {
  Loader2, Pencil, Check, Flame, Trophy, CalendarCheck,
  Swords, Shield, Zap, Users, Dumbbell, ChevronRight, LogOut, type LucideIcon,
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

// 스트림 아이콘 — 색상 필드는 제거(2026-09-19 리뉴얼, 단일 액센트 원칙).
// 홈/기술도감과 동일한 Shield/Swords/Zap/Users 체계 재사용.
const CAPSULE: Record<Stream, { label: string; Icon: LucideIcon }> = {
  가드포지션: { label: "가드",       Icon: Shield },
  탑포지션:   { label: "탑",         Icon: Swords },
  이스케이프: { label: "이스케이프", Icon: Zap    },
  스탠딩:     { label: "스탠딩",     Icon: Users  },
};

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
  const [loggingOut, setLoggingOut] = useState(false);
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
  const StyleIcon = bjjStyle.dominant ? CAPSULE[bjjStyle.dominant].Icon : Dumbbell;

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

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── 헤더 ───────────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between" style={SECTION_GAP}>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">프로필</h1>
          <p className="text-sm font-normal mt-1" style={{ color: "#8A8A94" }}>
            나의 주짓수 여정과 기록
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 active:scale-95 transition-all duration-fast"
            style={{ border: "1px solid rgba(217,119,46,0.4)" }}
          >
            <Pencil size={13} color="#D9772E" />
            <span className="text-[12px] font-bold" style={{ color: "#D9772E" }}>수정</span>
          </button>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════════
          1. 히어로 — 아바타 + 닉네임 + 벨트 + 스타일 (박스 카드 없이 플랫)
          ════════════════════════════════════════════════════════════════ */}
      <section style={SECTION_GAP}>
        <div className="flex items-center gap-4">
          {/* 아바타 */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-2xl font-black"
            style={{ backgroundColor: "#D9772E", color: "#fff" }}
          >
            {(nickname.charAt(0) || "A").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold text-white truncate leading-tight">
              {nickname || "아쿠아"}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: cfg.textColor }}>
              {belt}{stripe > 0 ? ` · ${stripe} Stripe` : ""}
            </p>
            {/* 스타일 배지 — lucide 아웃라인 칩 */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mt-2"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <StyleIcon size={12} color="#8A8A94" />
              <span className="text-[11px] font-normal" style={{ color: "#B4BCC8" }}>
                {bjjStyle.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. 통계 스트립 — 헤어라인 상하 구분선 + 세로 구분선 (A안)
          ════════════════════════════════════════════════════════════════ */}
      <section
        className="flex"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 0",
          ...SECTION_GAP,
        }}
      >
        <div className="flex-1 text-center">
          <Trophy size={16} color="#8A8A94" className="mx-auto mb-1.5" />
          <p className="text-[17px] font-bold tabular-nums" style={{ color: "#D9772E" }}>{totalXp.toLocaleString()}</p>
          <p className="text-[10px] font-normal mt-0.5" style={{ color: "#6B7280" }}>누적 XP</p>
        </div>
        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1 text-center">
          <CalendarCheck size={16} color="#8A8A94" className="mx-auto mb-1.5" />
          <p className="text-[17px] font-bold tabular-nums text-white">{totalDays}일</p>
          <p className="text-[10px] font-normal mt-0.5" style={{ color: "#6B7280" }}>총 수련일</p>
        </div>
        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1 text-center">
          <Flame size={16} color="#8A8A94" className="mx-auto mb-1.5" />
          <p className="text-[17px] font-bold tabular-nums text-white">{streak}일</p>
          <p className="text-[10px] font-normal mt-0.5" style={{ color: "#6B7280" }}>
            {streakBonus > 0 ? `보너스 +${streakBonus}` : "연속 스트릭"}
          </p>
        </div>
        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1 text-center">
          <topCap.Icon size={16} color="#8A8A94" className="mx-auto mb-1.5" />
          <p className="text-[17px] font-bold tabular-nums text-white">
            {totalReps > 0 ? topCap.label : "—"}
          </p>
          <p className="text-[10px] font-normal mt-0.5" style={{ color: "#6B7280" }}>최강 스트림</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. 스트림 분포
          ════════════════════════════════════════════════════════════════ */}
      <section style={SECTION_GAP}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13.5px] font-bold text-white">스트림 분포</h2>
          <span className="text-[10px] tabular-nums font-normal" style={{ color: "#6B7280" }}>
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
                  <cap.Icon size={15} color={isTop ? "#D9772E" : "#4A4A5A"} />
                  <span style={{ fontSize: "11px", fontWeight: 400, color: isTop ? "#D9772E" : "#4A4A5A" }}>
                    {cap.label}
                  </span>
                </div>
                <div style={{ flex: 1, height: "26px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.max(barPct, minPct)}%`,
                      height: "100%",
                      borderRadius: "999px",
                      backgroundColor: isTop ? "#D9772E" : cnt > 0 ? "#D9772E70" : "rgba(255,255,255,0.04)",
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
                <span style={{ width: "28px", fontSize: "10px", fontWeight: 700, textAlign: "right", flexShrink: 0, color: isTop ? "#D9772E" : "#3A3A4A" }}>
                  {cnt > 0 ? `${pct}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. 벨트 여정 — 실제 벨트 색상은 정당한 예외로 유지
          ════════════════════════════════════════════════════════════════ */}
      <section style={SECTION_GAP}>
        <h2 className="text-[13.5px] font-bold text-white mb-4">벨트 여정</h2>
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
          <section style={SECTION_GAP}>
            <h2 className="text-[13px] font-bold text-white mb-3">닉네임</h2>
            <input
              type="text"
              value={nickname}
              maxLength={20}
              onChange={(e) => { setNickname(e.target.value); }}
              className="w-full h-11 rounded-xl px-4 text-sm font-normal text-text-primary placeholder:text-text-disabled outline-none transition-colors duration-fast"
              style={{ backgroundColor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="닉네임 입력"
            />
          </section>

          {/* 벨트 선택 */}
          <section style={SECTION_GAP}>
            <h2 className="text-[13px] font-bold text-white mb-3">벨트</h2>
            <div>
              {BELTS.map((b, i) => {
                const active = belt === b.value;
                const bCfg   = BELT_CONFIG[b.value];
                return (
                  <button
                    key={b.value}
                    onClick={() => handleBeltChange(b.value)}
                    className="w-full flex items-center gap-3 px-1 py-3 transition-all duration-fast active:scale-[0.98]"
                    style={{ borderBottom: i < BELTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
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
                      className={active ? "text-sm font-bold flex-1 text-left" : "text-sm font-normal flex-1 text-left"}
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
          <section style={SECTION_GAP}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-bold text-white">그랄</h2>
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
                    className={active ? "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95" : "flex-1 py-2.5 rounded-xl text-xs font-normal transition-all active:scale-95"}
                    style={{
                      backgroundColor: active ? "#D9772E22" : "#0A0A0F",
                      color:           active ? "#D9772E" : "#4A4A5A",
                      border:          active ? "1.5px solid #D9772E" : "1.5px solid transparent",
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
                backgroundColor: "#D9772E",
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
          className="flex items-center justify-between active:scale-[0.98] transition-transform duration-fast"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ border: "1px solid rgba(217,119,46,0.4)" }}
            >
              <Pencil size={15} color="#D9772E" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">프로필 수정</p>
              <p className="text-[11px] font-normal" style={{ color: "#6B7280" }}>승급하면 벨트·그랄을 업데이트하세요</p>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: "#4A4A5A" }} />
        </button>
      )}

      {/* ════════════════════════════════════════════════════════════════
          7. 계정 — 로그아웃
          ════════════════════════════════════════════════════════════════ */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-3 active:scale-[0.98] transition-transform duration-fast disabled:opacity-60"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "20px", paddingTop: "16px" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {loggingOut
            ? <Loader2 size={15} className="animate-spin" color="#6B7280" />
            : <LogOut size={15} color="#6B7280" />}
        </div>
        <p className="text-sm font-bold" style={{ color: "#B4BCC8" }}>
          {loggingOut ? "로그아웃 중…" : "로그아웃"}
        </p>
      </button>
    </div>
  );
}
