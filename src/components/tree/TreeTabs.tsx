"use client";

/**
 * TreeTabs — 스킬트리 화면의 "선수" / "포지션" 이원화 탭.
 * (2026-09-15 추가) 순수 선수 중심 브라우징만 있으면 선수 태깅 안 된
 * 기술(전체의 58%)이 브라우징 화면 어디에도 안 나오는 사각지대가 생겨서,
 * 이름 그대로의 "스킬트리"(전체 기술 도감) 기능을 포지션 탭으로 되살림.
 * 단, 예전 레벨링(Lv.1~4)/소프트락 시스템은 부활시키지 않고 단순 목록만 제공.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import AthleteEntryScreen from "./AthleteEntryScreen";
import SkillTreeBrowser, { type StreamGroup } from "./SkillTreeBrowser";
import type { Athlete } from "@/types/domain";

type Tab = "athlete" | "position";

export default function TreeTabs({
  athletes,
  groups,
}: {
  athletes: Athlete[];
  groups: StreamGroup[];
}) {
  const [tab, setTab] = useState<Tab>("athlete");

  return (
    <div className="flex flex-col h-full">
      {/* 탭 스위처 */}
      <div className="px-4 pb-2 shrink-0 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("athlete")}
          className={cn(
            "flex-1 py-2 rounded-xl text-[13px] font-bold transition-colors duration-base",
            tab === "athlete"
              ? "bg-brand-primary text-white"
              : "bg-bg-elevated text-text-tertiary hover:bg-bg-hover",
          )}
        >
          선수
        </button>
        <button
          type="button"
          onClick={() => setTab("position")}
          className={cn(
            "flex-1 py-2 rounded-xl text-[13px] font-bold transition-colors duration-base",
            tab === "position"
              ? "bg-brand-primary text-white"
              : "bg-bg-elevated text-text-tertiary hover:bg-bg-hover",
          )}
        >
          포지션
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {tab === "athlete" ? (
          <AthleteEntryScreen athletes={athletes} />
        ) : (
          <SkillTreeBrowser groups={groups} />
        )}
      </div>
    </div>
  );
}
