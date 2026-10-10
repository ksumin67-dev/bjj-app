"use client";

import { useMemo, useState } from "react";
import { Star, Shield, Swords, Zap, Users, type LucideIcon } from "lucide-react";
import type { GamePlan, Stream } from "@/types/domain";
import { GamePlanCard } from "@/components/gamePlans/GamePlanCard";

export type GamePlanListItem = {
  gamePlan: GamePlan;
  startPositionName?: string;
  stream: Stream | null;
  previewTechs: { recordId: string; nameKo: string }[];
  techniqueCount: number;
  trainedCount: number;
};

const STREAM_TABS: { value: Stream; label: string; Icon: LucideIcon }[] = [
  { value: "가드포지션", label: "가드",       Icon: Shield },
  { value: "탑포지션",   label: "탑",         Icon: Swords },
  { value: "이스케이프", label: "이스케이프", Icon: Zap    },
  { value: "스탠딩",     label: "스탠딩",     Icon: Users  },
];

type Filter = "all" | "primary" | Stream;

export function GamePlanListClient({ items }: { items: GamePlanListItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "primary") return items.filter((it) => it.gamePlan.isPrimary);
    return items.filter((it) => it.stream === filter);
  }, [items, filter]);


  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>전체</FilterChip>
        <FilterChip active={filter === "primary"} onClick={() => setFilter("primary")}>
          <Star size={11} />주력
        </FilterChip>
        {STREAM_TABS.map((s) => (
          <FilterChip key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)}>
            {s.label}
          </FilterChip>
        ))}
      </div>

      <p className="text-[11px] font-normal" style={{ color: "#6B7280" }}>
        총 {filtered.length}개 게임플랜
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm font-normal text-center py-10" style={{ color: "#6B7280" }}>
          해당하는 게임플랜이 없습니다.
        </p>
      ) : (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {filtered.map((item) => (
            <GamePlanCard key={item.gamePlan.recordId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors duration-fast"
      style={
        active
          ? { backgroundColor: "#D9772E", color: "#fff" }
          : { border: "1px solid rgba(255,255,255,0.12)", color: "#8A8A94" }
      }
    >
      {children}
    </button>
  );
}
