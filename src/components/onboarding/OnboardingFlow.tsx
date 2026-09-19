"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, Target, Bell, Check } from "lucide-react";
import { completeOnboardingAction } from "@/lib/actions/userProfile";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import { STYLE_TAG_META, STYLE_TAG_ORDER } from "@/types/domain";
import type { BeltLevel, StyleTag } from "@/types/domain";

const BELTS: { value: BeltLevel; label: string }[] = [
  { value: "White Belt",  label: "White"  },
  { value: "Blue Belt",   label: "Blue"   },
  { value: "Purple Belt", label: "Purple" },
  { value: "Brown Belt",  label: "Brown"  },
  { value: "Black Belt",  label: "Black"  },
];

const GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => i + 6); // 06시 ~ 23시

function formatHourKo(h: number): string {
  const period = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${h12}시`;
}

const TOTAL_STEPS = 3;

export function OnboardingFlow({
  exampleAthletes,
}: {
  exampleAthletes: Record<StyleTag, string[]>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [belt, setBelt] = useState<BeltLevel>("White Belt");
  const [stripe, setStripe] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState<number | null>(3);
  const [reminderHour, setReminderHour] = useState<number | null>(20);
  const [styleTag, setStyleTag] = useState<StyleTag | null>(null);

  const maxStripe = belt === "Black Belt" ? 6 : 4;
  const beltCfg = BELT_CONFIG[belt] ?? BELT_CONFIG["White Belt"];

  function handleBeltChange(b: BeltLevel) {
    setBelt(b);
    const max = b === "Black Belt" ? 6 : 4;
    if (stripe > max) setStripe(max);
  }

  async function finish(finalStyleTag: StyleTag | null) {
    setSaving(true);
    await completeOnboardingAction({
      belt,
      stripe,
      weeklyGoal,
      reminderHour,
      preferredStyleTag: finalStyleTag,
    });
    router.push("/");
    router.refresh();
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else finish(styleTag);
  }

  function skip() {
    if (step === 2) {
      finish(null);
      return;
    }
    setStep(step + 1);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      {/* 진행 표시 */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-colors duration-base"
            style={{
              width: 28,
              backgroundColor: i <= step ? "#D9772E" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {step === 0 && (
          <div>
            <h1 className="text-xl font-bold text-text-primary">지금 벨트가 뭐예요?</h1>
            <p className="text-[12px] text-text-tertiary mt-1.5 mb-6">
              나중에 프로필에서 언제든 바꿀 수 있어요.
            </p>

            <div className="mb-5">
              {BELTS.map((b, i) => {
                const active = belt === b.value;
                const bCfg = BELT_CONFIG[b.value];
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => handleBeltChange(b.value)}
                    className="w-full flex items-center gap-3 px-1 py-3 transition-all duration-fast active:scale-[0.98]"
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
                    {active && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bCfg.bodyGrad[0] }} />}
                  </button>
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
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStripe(i)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: active ? "#D9772E22" : "#0A0A0F",
                      color: active ? "#D9772E" : "#4A4A5A",
                      border: active ? "1.5px solid #D9772E" : "1.5px solid transparent",
                    }}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-xl font-bold text-text-primary">주에 몇 번 정도 수련해요?</h1>
            <p className="text-[12px] text-text-tertiary mt-1.5 mb-6">
              홈 화면에서 이번 주 목표 진행률을 보여드려요.
            </p>

            <div className="flex gap-1.5 mb-8">
              {GOAL_OPTIONS.map((n) => {
                const active = weeklyGoal === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setWeeklyGoal(n)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: active ? "#D9772E22" : "#0A0A0F",
                      color: active ? "#D9772E" : "#4A4A5A",
                      border: active ? "1.5px solid #D9772E" : "1.5px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Bell size={14} className="text-brand-primary" />
              <h2 className="text-sm font-semibold text-text-primary">언제 알려드릴까요?</h2>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {HOUR_OPTIONS.map((h) => {
                const active = reminderHour === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setReminderHour(h)}
                    className="py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{
                      backgroundColor: active ? "#D9772E22" : "#0A0A0F",
                      color: active ? "#D9772E" : "#6B7280",
                      border: active ? "1.5px solid #D9772E" : "1.5px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {formatHourKo(h)}
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-text-tertiary mt-3">
              앱 알림은 수련 리마인더 화면(프로필)에서 따로 켜야 실제로 와요.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Target size={16} className="text-brand-primary" />
              <h1 className="text-xl font-bold text-text-primary">어떤 스타일이 좋아요?</h1>
            </div>
            <p className="text-[12px] text-text-tertiary mb-6">
              기술도감에서 그 스타일의 선수를 추천해드려요.
            </p>

            <div className="space-y-2">
              {STYLE_TAG_ORDER.map((tag) => {
                const meta = STYLE_TAG_META[tag];
                const active = styleTag === tag;
                const examples = exampleAthletes[tag] ?? [];
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setStyleTag(tag)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-fast active:scale-[0.98]"
                    style={{
                      border: active ? `1.5px solid ${meta.color}` : "1.5px solid rgba(255,255,255,0.08)",
                      backgroundColor: active ? `${meta.color}18` : "transparent",
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold" style={{ color: active ? meta.color : "#F5F7FA" }}>
                        {tag}
                      </p>
                      {examples.length > 0 && (
                        <p className="text-[10.5px] text-text-tertiary truncate">
                          {examples.join(", ")}
                        </p>
                      )}
                    </div>
                    {active && <Check size={16} style={{ color: meta.color }} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      <div className="w-full max-w-sm flex items-center gap-2.5 mt-9">
        <button
          type="button"
          onClick={skip}
          disabled={saving}
          className="text-xs text-text-tertiary px-2 py-3 disabled:opacity-50"
        >
          건너뛰기
        </button>
        <button
          type="button"
          onClick={next}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-3 text-sm font-bold text-text-inverse hover:bg-brand-hover active:scale-[0.98] transition-all duration-fast disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {step === TOTAL_STEPS - 1 ? "시작하기" : "다음"}
              <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
