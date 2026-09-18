import Link from "next/link";
import { BELT_LABEL_KO, getLevelProgress } from "@/types/domain";
import type { BeltLevel } from "@/types/domain";
import { BeltDisplay } from "@/components/ui/BeltDisplay";

/**
 * 기술도감 홈의 시그니처 비주얼 — 2026-09-19 재설계.
 *
 * 벨트(정체성, 프로필에서 직접 설정)와 학습 레벨(게이미피케이션, XP 누적)을
 * 완전히 분리해서 둘 다 보여준다. 이전엔 이 XP 누적치를 그대로 "벨트"로
 * 표시해서, 실제 벨트를 프로필에 설정해도 무시되고 항상 화이트벨트부터
 * 시작하는 것처럼 보이는 충돌이 있었음 — 이제는 벨트=프로필 값 그대로,
 * 레벨=별도 트랙으로 절대 안 섞이게 함.
 */
export function ProgressHeader({
  belt,
  stripe,
  totalXp,
}: {
  belt: BeltLevel;
  stripe: number;
  totalXp: number;
}) {
  const progress = getLevelProgress(totalXp);

  return (
    <div className="space-y-4">
      {/* 실제 벨트 — 프로필에서 직접 설정한 값 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-semibold text-text-secondary">
            {BELT_LABEL_KO[belt]}
            {stripe > 0 ? ` · ${stripe}그랄` : ""}
          </span>
          <Link
            href="/profile"
            className="text-[10px] text-text-tertiary underline underline-offset-2"
          >
            프로필에서 변경
          </Link>
        </div>
        <BeltDisplay belt={belt} stripe={stripe} height={16} tipWidth={40} />
      </div>

      {/* 학습 레벨 — XP 누적 기반, 벨트와는 별개의 앱 내 게이미피케이션 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] text-text-tertiary">
            학습 레벨 · {progress.levelLabel}
          </span>
          <span className="text-[26px] font-bold text-text-primary tabular-nums tracking-tight">
            {totalXp.toLocaleString()}
            <span className="text-[11px] font-normal text-text-tertiary ml-1">XP</span>
          </span>
        </div>

        <div className="flex gap-1">
          {progress.segmentFractions.map((frac, i) => (
            <div key={i} className="flex-1 h-2.5 rounded-full bg-bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: `${frac * 100}%` }}
              />
            </div>
          ))}
        </div>

        <p className="text-[11px] text-text-tertiary mt-1.5">
          {progress.isMaxLevel ? progress.nextLabel : `${progress.nextLabel} ${progress.xpToNext} XP`}
        </p>
      </div>
    </div>
  );
}
