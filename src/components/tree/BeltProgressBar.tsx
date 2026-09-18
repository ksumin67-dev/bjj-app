import { BELT_LABEL_KO, getBeltStripeProgress } from "@/types/domain";
import type { BeltLevel } from "@/types/domain";

/**
 * 기술도감 홈의 시그니처 비주얼 — 벨트를 4단 스트라이프 진행바로 표현.
 * (2026-09-18 리디자인, Oura의 "화면당 제일 중요한 것 하나" 철학 참고:
 * 이 화면의 히어로는 더 이상 "이달의 추천" 카드 캐러셀이 아니라 이 바.)
 */
export function BeltProgressBar({ belt, totalXp }: { belt: BeltLevel; totalXp: number }) {
  const progress = getBeltStripeProgress(totalXp);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13px] font-semibold text-text-secondary">
          {BELT_LABEL_KO[belt]}
        </span>
        <span className="text-[28px] font-bold text-text-primary tabular-nums tracking-tight">
          {totalXp.toLocaleString()}
          <span className="text-[11px] font-normal text-text-tertiary ml-1">XP</span>
        </span>
      </div>

      <div className="flex gap-1">
        {progress.segmentFractions.map((frac, i) => (
          <div
            key={i}
            className="flex-1 h-2.5 rounded-full bg-bg-elevated overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-brand-primary"
              style={{ width: `${frac * 100}%` }}
            />
          </div>
        ))}
      </div>

      <p className="text-[11px] text-text-tertiary mt-1.5">
        {progress.isMaxRank ? progress.nextLabel : `${progress.nextLabel} ${progress.xpToNext} XP`}
      </p>
    </div>
  );
}
