"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, ChevronLeft, Check, BookOpen, NotebookPen, Sparkles } from "lucide-react";
import { completeOnboardingAction } from "@/lib/actions/userProfile";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import { AthleteAvatar } from "@/components/tree/AthleteAvatar";
import { STYLE_TAG_META, STYLE_TAG_FALLBACK } from "@/types/domain";
import type { BeltLevel, StyleTag } from "@/types/domain";

export interface OnboardingAthlete {
  id: string;
  name: string;
  styleTags: StyleTag[];
  photo: string | null;
}

const BRAND = "#D9772E";

const BELTS: { value: BeltLevel }[] = [
  { value: "White Belt" },
  { value: "Blue Belt" },
  { value: "Purple Belt" },
  { value: "Brown Belt" },
  { value: "Black Belt" },
];

const NICK_POOL = [
  "탭왕", "그래플러", "가드마스터", "백테이커", "암바장인", "스파링머신",
  "하프가드", "트라이앵글", "길로틴", "파란띠의꿈", "매트위의곰", "오늘도탭",
  "스윕요정", "패스의달인", "도장지박령", "주짓수덕후", "무릎조심", "훅업러버",
];

function pickNicks(): string[] {
  return [...NICK_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
}

const GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

// 0: 환영, 1: 닉네임, 2: 벨트, 3: 주간 목표, 4: 좋아하는 선수
const LAST_STEP = 4;

function accentOf(a: OnboardingAthlete): string {
  const t = a.styleTags[0];
  return t ? (STYLE_TAG_META[t] ?? STYLE_TAG_FALLBACK).color : STYLE_TAG_FALLBACK.color;
}

const FEATURES = [
  { icon: NotebookPen, title: "수련 기록", desc: "오늘 배운 기술과 스파링을 10초 만에 남겨요." },
  { icon: BookOpen, title: "기술도감", desc: "선수별·포지션별로 기술을 한눈에 정리해요." },
  { icon: Sparkles, title: "나만의 게임플랜", desc: "내 스타일에 맞는 기술 연결을 추천받아요." },
];

export function OnboardingFlow({ athletes }: { athletes: OnboardingAthlete[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [belt, setBelt] = useState<BeltLevel>("White Belt");
  const [stripe, setStripe] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState<number | null>(3);
  const [picked, setPicked] = useState<string[]>([]);
  const [nickname, setNickname] = useState("");
  const [nickSuggestions, setNickSuggestions] = useState<string[]>(NICK_POOL.slice(0, 6));

  const maxStripe = belt === "Black Belt" ? 6 : 4;
  const beltCfg = BELT_CONFIG[belt] ?? BELT_CONFIG["White Belt"];

  // 고른 선수들의 가장 많은 스타일 → 기술도감 "추천 선수"용
  const preferredStyleTag = useMemo<StyleTag | null>(() => {
    const count = new Map<StyleTag, number>();
    athletes
      .filter((a) => picked.includes(a.id))
      .forEach((a) => a.styleTags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    let best: StyleTag | null = null;
    let max = 0;
    count.forEach((n, t) => {
      if (n > max) {
        max = n;
        best = t;
      }
    });
    return best;
  }, [athletes, picked]);

  // 고른 선수와 스타일이 겹치는 선수를 앞으로 (비슷한 선수 부스트)
  const ordered = useMemo(() => {
    if (picked.length === 0) return athletes;
    const tags = new Set<StyleTag>();
    athletes.filter((a) => picked.includes(a.id)).forEach((a) => a.styleTags.forEach((t) => tags.add(t)));
    const score = (a: OnboardingAthlete) => a.styleTags.filter((t) => tags.has(t)).length;
    return [...athletes].sort((a, b) => score(b) - score(a));
  }, [athletes, picked]);

  function handleBeltChange(b: BeltLevel) {
    setBelt(b);
    const max = b === "Black Belt" ? 6 : 4;
    if (stripe > max) setStripe(max);
  }

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  async function finish(withPicks: boolean) {
    setSaving(true);
    const ids = withPicks ? picked : [];
    await completeOnboardingAction({
      belt,
      stripe,
      weeklyGoal,
      reminderHour: 20,
      preferredStyleTag: withPicks ? preferredStyleTag : null,
      favoriteAthleteIds: ids,
      nickname: nickname.trim() || undefined,
    });
    setDone(true);
    window.setTimeout(() => {
      router.push("/");
      router.refresh();
    }, reduce ? 300 : 1300);
  }

  function go(to: number) {
    setDir(to > step ? 1 : -1);
    setStep(to);
  }

  function next() {
    if (step < LAST_STEP) go(step + 1);
    else finish(true);
  }

  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 40 * dir },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 * dir },
      };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-base px-6">
        <motion.div
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: BRAND, boxShadow: `0 0 48px ${BRAND}66` }}
        >
          <Check size={40} color="#fff" strokeWidth={3} />
        </motion.div>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 text-lg font-bold text-text-primary"
        >
          준비 완료!
        </motion.p>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-1.5 text-[12px] text-text-tertiary"
        >
          그래플로그에서 첫 수련을 기록해보세요.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-base">
      {/* 상단: 뒤로가기 + 진행바 */}
      <div className="px-5 pt-5 pb-2" style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}>
        <div className="flex items-center gap-3 h-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={saving}
              aria-label="이전"
              className="w-8 h-8 -ml-1.5 flex items-center justify-center rounded-full text-text-secondary active:scale-90 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="w-8 h-8 -ml-1.5" />
          )}
          {step > 0 && (
            <>
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: BRAND }}
                  initial={false}
                  animate={{ width: `${(step / LAST_STEP) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-text-tertiary w-8 text-right">
                {step}/{LAST_STEP}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-4">
        <div className="w-full max-w-sm mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              {...slide}
              transition={{ duration: reduce ? 0.1 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="pt-10">
                  <motion.h1
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[26px] leading-tight font-bold text-text-primary"
                  >
                    그래플로그에<br />오신 걸 환영해요
                  </motion.h1>
                  <motion.p
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 text-[13px] text-text-secondary leading-relaxed"
                  >
                    주짓수 수련을 기록하고, 기술을 정리하고,<br />나만의 게임플랜을 만드는 앱이에요.
                  </motion.p>
                  <div className="mt-9 space-y-5">
                    {FEATURES.map((f, i) => (
                      <motion.div
                        key={f.title}
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-3.5"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${BRAND}1f` }}
                        >
                          <f.icon size={19} style={{ color: BRAND }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{f.title}</p>
                          <p className="text-[12px] text-text-tertiary mt-0.5">{f.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="pt-4">
                  <h1 className="text-xl font-bold text-text-primary">뭐라고 불러드릴까요?</h1>
                  <p className="text-[12px] text-text-tertiary mt-1.5 mb-6">
                    앱에서 보여질 이름이에요. 나중에 프로필에서 바꿀 수 있어요.
                  </p>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.slice(0, 12))}
                    placeholder="닉네임 (최대 12자)"
                    maxLength={12}
                    className="w-full rounded-xl bg-[#0A0A0F] px-4 py-3.5 text-[15px] font-semibold text-text-primary placeholder:text-text-tertiary outline-none border border-white/10 focus:border-[#D9772E] transition-colors"
                  />
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-tertiary">이런 닉네임은 어때요?</span>
                    <button
                      type="button"
                      onClick={() => setNickSuggestions(pickNicks())}
                      className="text-[11px] font-semibold active:opacity-60"
                      style={{ color: BRAND }}
                    >
                      다른 추천 보기
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nickSuggestions.map((n, i) => {
                      const active = nickname === n;
                      return (
                        <motion.button
                          key={n}
                          type="button"
                          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 22 }}
                          whileTap={reduce ? undefined : { scale: 0.92 }}
                          onClick={() => setNickname(n)}
                          className="px-3.5 py-2 rounded-full text-[12.5px] font-semibold"
                          style={{
                            backgroundColor: active ? `${BRAND}22` : "transparent",
                            color: active ? BRAND : "#9CA3AF",
                            border: active ? `1.5px solid ${BRAND}` : "1.5px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {n}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="pt-4">
                  <h1 className="text-xl font-bold text-text-primary">지금 벨트가 뭐예요?</h1>
                  <p className="text-[12px] text-text-tertiary mt-1.5 mb-5">
                    나중에 프로필에서 언제든 바꿀 수 있어요.
                  </p>
                  <div className="mb-5">
                    {BELTS.map((b, i) => {
                      const active = belt === b.value;
                      const bCfg = BELT_CONFIG[b.value];
                      return (
                        <motion.button
                          key={b.value}
                          type="button"
                          whileTap={reduce ? undefined : { scale: 0.97 }}
                          onClick={() => handleBeltChange(b.value)}
                          className="w-full flex items-center gap-3 px-1 py-3"
                          style={{ borderBottom: i < BELTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                        >
                          <div style={{ width: 100, flexShrink: 0 }}>
                            <BeltDisplay
                              belt={b.value}
                              stripe={active ? stripe : 0}
                              fullWidth={false}
                              height={18}
                              tipWidth={34}
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
                            <motion.div
                              layoutId="belt-dot"
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: bCfg.bodyGrad[0] }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-secondary">그랄</span>
                    <span className="text-sm font-bold" style={{ color: beltCfg.textColor }}>
                      {stripe} / {maxStripe}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: maxStripe + 1 }).map((_, i) => {
                      const active = stripe === i;
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          whileTap={reduce ? undefined : { scale: 0.9 }}
                          onClick={() => setStripe(i)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                          style={{
                            backgroundColor: active ? `${BRAND}22` : "#0A0A0F",
                            color: active ? BRAND : "#4A4A5A",
                            border: active ? `1.5px solid ${BRAND}` : "1.5px solid transparent",
                          }}
                        >
                          {i}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="pt-4">
                  <h1 className="text-xl font-bold text-text-primary">주에 몇 번 정도 수련해요?</h1>
                  <p className="text-[12px] text-text-tertiary mt-1.5 mb-7">
                    홈 화면에서 이번 주 목표 진행률을 보여드려요.
                  </p>
                  <div className="flex gap-1.5">
                    {GOAL_OPTIONS.map((n) => {
                      const active = weeklyGoal === n;
                      return (
                        <motion.button
                          key={n}
                          type="button"
                          whileTap={reduce ? undefined : { scale: 0.88 }}
                          animate={reduce ? undefined : { scale: active ? 1.08 : 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 18 }}
                          onClick={() => setWeeklyGoal(n)}
                          className="flex-1 py-3.5 rounded-xl text-sm font-bold"
                          style={{
                            backgroundColor: active ? `${BRAND}22` : "#0A0A0F",
                            color: active ? BRAND : "#4A4A5A",
                            border: active ? `1.5px solid ${BRAND}` : "1.5px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {n}
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-[12px] text-text-tertiary">
                    선택한 횟수는 <span className="text-text-secondary font-semibold">주 {weeklyGoal ?? 3}회</span> 수련 목표로 쓰여요.
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="pt-4">
                  <h1 className="text-xl font-bold text-text-primary">좋아하는 선수를 골라보세요</h1>
                  <p className="text-[12px] text-text-tertiary mt-1.5 mb-5">
                    취향에 맞는 기술과 선수를 추천해드려요. 건너뛰어도 괜찮아요.
                  </p>
                  <motion.div layout className="grid grid-cols-3 gap-x-3 gap-y-5">
                    {ordered.map((a, i) => {
                      const on = picked.includes(a.id);
                      const color = accentOf(a);
                      return (
                        <motion.button
                          key={a.id}
                          layout={!reduce}
                          type="button"
                          initial={reduce ? false : { opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            layout: { type: "spring", stiffness: 350, damping: 30 },
                            delay: Math.min(i, 12) * 0.03,
                            duration: 0.3,
                          }}
                          whileTap={reduce ? undefined : { scale: 0.92 }}
                          onClick={() => toggle(a.id)}
                          aria-pressed={on}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="relative">
                            <motion.div
                              animate={{
                                scale: on && !reduce ? 1.06 : 1,
                                boxShadow: on ? `0 0 0 3px ${color}, 0 0 22px ${color}88` : "0 0 0 0px transparent",
                              }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              className="rounded-full overflow-hidden"
                              style={{ width: 84, height: 84, backgroundColor: `${color}22` }}
                            >
                              <AthleteAvatar color={color} size={84} photoUrl={a.photo} alt={a.name} />
                            </motion.div>
                            <AnimatePresence>
                              {on && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -40 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: "spring", stiffness: 520, damping: 16 }}
                                  className="absolute -right-0.5 -bottom-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-bg-base"
                                  style={{ backgroundColor: color }}
                                >
                                  <Check size={13} color="#fff" strokeWidth={3.5} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <span
                            className="text-[11.5px] font-semibold text-center leading-tight transition-colors"
                            style={{ color: on ? color : "#9CA3AF" }}
                          >
                            {a.name}
                          </span>
                          {a.styleTags.length > 0 && (
                            <span
                              className="-mt-1.5 text-[9.5px] text-center leading-tight"
                              style={{ color: on ? `${color}cc` : "#6B7280" }}
                            >
                              {a.styleTags.slice(0, 2).join(" · ")}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 하단 고정 액션 */}
      <div
        className="px-6 pt-3 border-t border-white/5 bg-bg-base"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="w-full max-w-sm mx-auto">
          <motion.button
            type="button"
            onClick={next}
            disabled={saving}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-3.5 text-sm font-bold text-text-inverse disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : step === 0 ? (
              "시작하기"
            ) : step === LAST_STEP ? (
              picked.length > 0 ? `${picked.length}명 선택 · 완료` : "완료"
            ) : (
              "다음"
            )}
          </motion.button>
          {step === LAST_STEP && (
            <button
              type="button"
              onClick={() => finish(false)}
              disabled={saving}
              className="w-full text-xs text-text-tertiary py-3 disabled:opacity-50"
            >
              건너뛰기
            </button>
          )}
          {step !== LAST_STEP && <div className="h-3" />}
        </div>
      </div>
    </div>
  );
}
