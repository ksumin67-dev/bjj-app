"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import type { Technique } from "@/types/domain";
import { TypeChip } from "@/components/tree/TypeChip";
import { toggleTechniqueGoalAction } from "@/lib/actions/techniqueGoals";

/**
 * 선수/포지션 상세 페이지의 기술 한 줄 — 클릭하면 기술 상세로 이동, 우측
 * 하트 버튼으로 "학습 목표(찜)"에 추가/제거. 낙관적 업데이트 + 실패 시 롤백.
 * (2026-09-15 추가, 선수 시그니처 기술 학습 목표 기능. 이후 포지션 상세
 * 페이지에서도 재사용하면서 athleteRecordId를 null 허용으로 확장.)
 */
export function AthleteTechniqueRow({
  technique,
  athleteRecordId,
  initialIsGoal,
  backContext,
}: {
  technique: Technique;
  athleteRecordId: string | null;
  initialIsGoal: boolean;
  /**
   * 기술 상세 페이지에서 "뒤로가기"가 돌아갈 곳 — 이 행이 실제로 렌더링된
   * 화면(선수 상세 or 포지션 상세)을 명시적으로 넘겨준다.
   * 생략 시 기술 상세 페이지가 대표선수 기준으로 알아서 추정(구버전 동작).
   * (2026-09-18, 포지션 상세에서 들어갔는데 뒤로가기가 엉뚱한 선수 페이지로
   * 가던 버그 수정)
   */
  backContext?: { href: string; label: string };
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

  // 포지션 자체(parentId=null)를 태깅할 땐 [positionId] 세그먼트가 비어
  // "/tree//CG" 같은 빈 경로가 되는 걸 피하려고 자기 id를 그대로 씀 —
  // 어차피 기술 상세 페이지는 techId만으로 조회하고 positionId는 안 씀.
  const posSegment = technique.parentId ?? technique.id;
  const isPositionSelf = technique.parentId === null;

  const query = backContext
    ? `?backHref=${encodeURIComponent(backContext.href)}&backLabel=${encodeURIComponent(backContext.label)}`
    : "";

  return (
    <Link
      href={`/tree/${posSegment}/${technique.id}${query}`}
      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-hover transition-colors"
    >
      <TypeChip type={technique.type} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-text-primary truncate">
          {technique.nameKo}
          {isPositionSelf && (
            <span className="ml-1.5 text-[10px] font-semibold text-text-tertiary">(포지션 전체)</span>
          )}
        </p>
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
