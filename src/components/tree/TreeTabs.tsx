"use client";

/**
 * TreeTabs — 스킬트리 화면의 "선수" / "포지션" 이원화 탭.
 * (2026-09-15 추가) 순수 선수 중심 브라우징만 있으면 선수 태깅 안 된
 * 기술(전체의 58%)이 브라우징 화면 어디에도 안 나오는 사각지대가 생겨서,
 * 이름 그대로의 "스킬트리"(전체 기술 도감) 기능을 포지션 탭으로 되살림.
 * 단, 예전 레벨링(Lv.1~4)/소프트락 시스템은 부활시키지 않고 단순 목록만 제공.
 *
 * (2026-09-19) 페이지 전체가 고정 높이(100dvh)+내부 스크롤 구조에서 일반
 * 문서 스크롤로 전환되면서, 탭 스위처만 sticky로 상단에 고정해 리스트를
 * 스크롤해도 선수/포지션 전환이 항상 가능하도록 함. 활성 탭 배경은
 * layoutId 기반으로 부드럽게 슬라이드.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AthleteEntryScreen from "./AthleteEntryScreen";
import SkillTreeBrowser, { type StreamGroup } from "./SkillTreeBrowser";
import type { Athlete } from "@/types/domain";

type Tab = "athlete" | "position";
const TABS: { key: Tab; label: string }[] = [
  { key: "athlete", label: "선수" },
  { key: "position", label: "포지션" },
];

export default function TreeTabs({
  athletes,
  groups,
}: {
  athletes: Athlete[];
  groups: StreamGroup[];
}) {
  const [tab, setTab] = useState<Tab>("athlete");

  return (
    <div>
      {/* 탭 스위처 — 스크롤해도 항상 보이도록 sticky */}
      <div className="sticky top-0 z-sticky bg-bg-base/95 backdrop-blur-md px-4 py-2.5 border-b border-border-subtle/70">
        <div className="relative flex gap-1 p-1 rounded-2xl bg-bg-elevated">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "relative flex-1 py-2 rounded-xl text-[13px] font-bold transition-colors duration-base",
                  active ? "text-white" : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="tree-tab-pill"
                    className="absolute inset-0 bg-brand-primary rounded-xl"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === "athlete" ? (
        <AthleteEntryScreen athletes={athletes} />
      ) : (
        <SkillTreeBrowser groups={groups} />
      )}
    </div>
  );
}
