"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import type { Technique } from "@/types/domain";
import { TypeChip } from "@/components/tree/TypeChip";
import { toggleTechniqueGoalAction } from "@/lib/actions/techniqueGoals";

/**
 * 선수 상세 페이지의 기술 한 줄 — 클릭하면 기술 상세로 이동, 우측 하트 버튼으로
 * "학습 목표(찜)"에 추가/제거. 낙관적 업데이트 + 실패 시 롤백.
 * (2026-09-15 추가, 선수 시그니처 기술 학습 목표 기능)
 */
export function AthleteTechniqueRow({
  technique,
  athleteRecordId,
  initialIsGoal,
}: {
  technique: Technique;
  athleteRecordId: string;
  initialIsGoal: boolean;
}) {
  const [isGoal, setIsGoal] = useState(initialIsGoal);
  const [, startTransition] = useTransition();

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !isGoal;
    setIsGoal(next);
    startTransition(async () => {
      try {
        await toggleTechniqueGoalAction(technique.recordId, athleteRecordId, next);
      } catch (err) {
        console.warn("[AthleteTechniqueRow] 목표 토글 실패:", err);
        setIsGoal(!next);
      }
    });
  }

  return (
    <Link
      href={`/tree/${technique.parentId ?? ""}/${technique.id}`}
      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-hover transition-colors"
    >
      <TypeChip type={technique.type} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-text-primary truncate">{technique.nameKo}</p>
        <p className="text-[10px] text-text-tertiary font-mono">{technique.id}</p>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isGoal ? "학습 목표에서 제거" : "학습 목표로 추가"}
        aria-pressed={isGoal}
        className="shrink-0 w-8 h-8 -mr-1 flex items-center justify-center rounded-full active:scale-90 transition-transform duration-fast"
      >
        <Heart
          size={17}
          fill={isGoal ? "#F87171" : "none"}
          color={isGoal ? "#F87171" : "#6B7280"}
          strokeWidth={2}
        />
      </button>
      <ChevronRight size={15} className="text-text-disabled shrink-0" />
    </Link>
  );
}
