"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Check, ArrowRight, RefreshCw } from "lucide-react";
import {
  recommendGamePlansAction,
  type RecommendResult,
} from "@/lib/actions/gamePlans";

/**
 * "AI로 게임플랜 추천받기" (2026-10-10)
 * 나의 게임플랜 목록 화면에 놓이는 추천 섹션. 버튼을 누르면 분석 단계를 보여준 뒤
 * 추천 카드를 보여준다. 카드의 [이 플랜으로 만들기]는 내용이 채워진 새 게임플랜 폼으로 이동.
 *
 * 분석 단계 연출은 최소 1.8초 — 규칙 엔진은 거의 즉시 끝나지만, 어떤 데이터를
 * 보는지 사용자가 읽을 수 있도록 단계별로 보여준다. (분석 결과 문구의 수치는 실제 값)
 */

const SURFACE = "#14171D";
const FIELD_BG = "#0A0C10";
const FIELD_BORDER = "#23262E";
const MUTED = "#8A8A94";
const BRAND = "#D9772E";

const STEPS = [
  "수련 기록을 확인하고 있어요",
  "좋아요한 기술과 선수를 살펴보고 있어요",
  "기술 조합을 만들고 있어요",
];

type Ok = Extract<RecommendResult, { ok: true }>;

export function AiRecommendSection({ hasPlans = false }: { hasPlans?: boolean }) {
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Ok | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setPhase("analyzing");
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);
    const [res] = await Promise.all([
      recommendGamePlansAction(),
      new Promise((r) => setTimeout(r, 1800)),
    ]);
    clearTimeout(t1);
    clearTimeout(t2);
    if (res.ok) {
      setResult(res);
      setPhase("done");
    } else {
      setError(res.error);
      setPhase("error");
    }
  }

  return (
    <section style={{ backgroundColor: SURFACE, borderRadius: 14, padding: 14 }}>
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles size={16} color="#FFD27A" className="shrink-0 ai-sparkle" />
        <h2 className="text-[14.5px] font-bold ai-shine-text">AI 추천 게임플랜</h2>
      </div>

      {(phase === "idle" || phase === "error") && (
        <>
          <p className={`text-[11px] font-normal ${hasPlans ? "mb-2.5" : "mb-3"}`} style={{ color: MUTED }}>
            {hasPlans
              ? "내 수련 기록과 좋아요한 기술·선수를 분석해서 새 조합을 추천해줘요."
              : "내 수련 기록과 좋아요한 기술·선수를 분석해서 첫 게임플랜을 추천해줘요."}
          </p>
          {phase === "error" && (
            <p className="text-[12px] mb-2 text-danger">{error}</p>
          )}
          <div className="ai-shine-border">
            <button
              type="button"
              onClick={run}
              className="w-full h-11 rounded-[11px] font-bold text-[14px] active:scale-[0.98] transition-transform duration-fast inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: SURFACE }}
            >
              <Sparkles size={16} color="#FFD27A" className="ai-sparkle" />
              <span className="ai-shine-text">AI로 게임플랜 추천받기</span>
            </button>
          </div>
          {!hasPlans && (
            <p className="text-center mt-3 text-[12px] font-normal" style={{ color: MUTED }}>
              또는{" "}
              <Link href="/gameplans/new" className="underline" style={{ color: BRAND }}>
                직접 만들기
              </Link>
            </p>
          )}
        </>
      )}

      {phase === "analyzing" && (
        <ul className="mt-3 space-y-2.5" aria-live="polite">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={label}
                className="flex items-center gap-2 text-[13px] font-normal transition-opacity duration-base"
                style={{ color: done || active ? "#fff" : "#4A4A5A", opacity: i > step ? 0.6 : 1 }}
              >
                {done ? (
                  <Check size={14} color="#34D399" />
                ) : active ? (
                  <Loader2 size={14} color={BRAND} className="animate-spin" />
                ) : (
                  <span className="size-3.5 rounded-full border" style={{ borderColor: "#3A3A4A" }} />
                )}
                {label}
              </li>
            );
          })}
        </ul>
      )}

      {phase === "done" && result && (
        <div className="mt-2">
          <p className="text-[11px] font-normal mb-3" style={{ color: MUTED }}>
            {result.personalized
              ? `수련 ${result.signals.sessionCount}회 · 수련한 기술 ${result.signals.trainedTechniqueCount}개 · 좋아요 ${result.signals.goalCount}개를 분석했어요.`
              : "아직 분석할 기록이 없어서 기본 추천을 보여드려요. 수련을 기록하거나 기술에 좋아요를 누르면 나만의 추천이 만들어져요."}
          </p>

          <div className="space-y-2">
            {result.plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl px-3.5 py-3"
                style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER}` }}
              >
                <p className="text-[13px] font-semibold text-white">{plan.name}</p>
                <ol className="mt-1.5 space-y-1">
                  {plan.steps.map((st, i) => (
                    <li key={i} className="text-[12px] font-normal" style={{ color: "#B4BCC8" }}>
                      <span className="font-semibold" style={{ color: i === 0 ? BRAND : MUTED }}>
                        {st.role}
                      </span>{" "}
                      {st.name}
                      {st.trigger && (
                        <span className="block text-[11px]" style={{ color: MUTED }}>
                          {st.trigger}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="text-[11px] font-normal mt-1.5" style={{ color: MUTED }}>
                  {plan.reason}
                </p>
                <Link
                  href={`/gameplans/new?rec=${encodeURIComponent(plan.id)}`}
                  className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold active:opacity-70 transition-opacity duration-fast"
                  style={{ color: BRAND }}
                >
                  이 플랜으로 만들기
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={run}
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: MUTED }}
          >
            <RefreshCw size={12} />
            다시 분석하기
          </button>
        </div>
      )}
    </section>
  );
}
