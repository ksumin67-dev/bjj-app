"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, ListOrdered, Star, Shield, Swords, Zap, Users, type LucideIcon } from "lucide-react";
import type { Sequence, Stream } from "@/types/domain";
import { SequenceCard } from "@/components/sequences/SequenceCard";

export type SequenceListItem = {
  sequence: Sequence;
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

export function SequenceListClient({ items }: { items: SequenceListItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "primary") return items.filter((it) => it.sequence.isPrimary);
    return items.filter((it) => it.stream === filter);
  }, [items, filter]);

  if (items.length === 0) return <EmptyState />;

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
            <SequenceCard key={item.sequence.recordId} item={item} />
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

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
    >
      <div
        className="size-12 mx-auto rounded-full flex items-center justify-center mb-3"
        style={{ border: "1px solid rgba(217,119,46,0.4)" }}
      >
        <ListOrdered size={20} color="#D9772E" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">아직 게임플랜이 없습니다</h3>
      <p className="text-sm font-normal mb-4" style={{ color: "#6B7280" }}>
        스파링에서 시도하고 싶은 기술 조합을 정리해보세요.
        <br />
        예) &quot;클가 → 시저 스윕 → 마운트 → 암바&quot;
      </p>
      <Link
        href="/sequences/new"
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white text-sm font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
        style={{ backgroundColor: "#D9772E" }}
      >
        <Plus size={16} strokeWidth={2.5} />첫 게임플랜 만들기
      </Link>
    </div>
  );
}
