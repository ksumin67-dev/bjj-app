"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { getLevelProgress } from "@/types/domain";

/**
 * LevelBar — 기술도감 헤더의 "학습 레벨"(XP 게이미피케이션) 진행률 바.
 *
 * (2026-09-19) 이전엔 여기 실제 벨트(ProgressHeader)도 같이 떴는데, 이 화면의
 * 메인 콘텐츠는 선수/포지션 리스트지 벨트 정체성이 아니라는 판단으로 벨트
 * 블록은 제거하고 학습 레벨만 남김(ProgressHeader.tsx는 삭제).
 * 실제 벨트는 홈 화면/프로필에서 계속 확인 가능.
 *
 * 숫자 카운트업 + 세그먼트 바 순차 채움 애니메이션 추가 — 화면 진입 시
 * 정적으로 뚝 떨어지는 대신 값이 살아있다는 느낌을 주기 위함.
 */
export function LevelBar({ totalXp }: { totalXp: number }) {
  const progress = getLevelProgress(totalXp);
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const controls = animate(prevRef.current, totalXp, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevRef.current = totalXp;
    return () => controls.stop();
  }, [totalXp]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] text-text-tertiary">
          학습 레벨 · {progress.levelLabel}
        </span>
        <span className="text-[26px] font-bold text-text-primary tabular-nums tracking-tight">
          {display.toLocaleString()}
          <span className="text-[11px] font-normal text-text-tertiary ml-1">XP</span>
        </span>
      </div>

      <div className="flex gap-1">
        {progress.segmentFractions.map((frac, i) => (
          <div key={i} className="flex-1 h-2.5 rounded-full bg-bg-elevated overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-brand-primary"
              initial={{ width: 0 }}
              animate={{ width: `${frac * 100}%` }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        ))}
      </div>

      <p className="text-[11px] text-text-tertiary mt-1.5">
        {progress.isMaxLevel ? progress.nextLabel : `${progress.nextLabel} ${progress.xpToNext} XP`}
      </p>
    </div>
  );
}
