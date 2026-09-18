"use client";

/**
 * SkillTreeBrowser — 스트림 세그먼트 → 포지션 카드 드릴다운 (목업 정렬)
 *  - 4개 균등 세그먼트(이모지 + 이름)
 *  - 이모지 타일 가로형 포지션 카드 (Lv 뱃지 / 미시작, code · n/total 수련)
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stream } from "@/types/domain";

const STREAM_META: Record<Stream, { color: string; label: string; emoji: string }> = {
  가드포지션: { color: "#2E80F0", label: "가드", emoji: "🛡️" },
  탑포지션:   { color: "#FF8C42", label: "탑",   emoji: "⚔️" },
  이스케이프: { color: "#A78BFA", label: "이스케이프", emoji: "🏃" },
  스탠딩:     { color: "#FBBF24", label: "스탠딩", emoji: "🥋" },
};
const STREAM_ORDER: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

// 포지션 코드별 이모지 (목업 기준 + 확장)
const POSITION_EMOJI: Record<string, string> = {
  CG: "🛡️", HG: "🌓", BF: "🦋", DLR: "🌀", RDLR: "🔄", SP: "🕷️", LS: "🕸️",
  RG: "🧤", XG: "❌", SLX: "🦵", FF: "🤝", SG: "🐎", KG: "🔑",
  GP: "🚪", GB: "🔨", GBCG: "🔨", GBSP: "🔨", GBLS: "🔨", GBDLR: "🔨", GBBF: "🔨",
  SC: "📐", MT: "⛰️", KNB: "🔻", KB: "🔻", NS: "🧭", BC: "🎒",
  ME: "🆙", SCE: "↔️", BD: "🛡️", KNBE: "⬆️", NSE: "🧭",
  TD: "🤼",
};

export type PosSummary = {
  id: string;
  nameKo: string;
  nameEn: string;
  childCount: number;
  trainedCount: number;
};

export type StreamGroup = { stream: Stream; positions: PosSummary[] };

function PositionCard({ pos, color }: { pos: PosSummary; color: string }) {
  const pct = pos.childCount === 0 ? 0 : Math.round((pos.trainedCount / pos.childCount) * 100);
  const emoji = POSITION_EMOJI[pos.id] ?? "🥋";
  const isZero = pos.trainedCount === 0;

  return (
    <Link
      href={`/tree/position/${pos.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-border-subtle bg-bg-elevated p-3.5 transition-all duration-base ease-out-soft hover:bg-bg-hover hover:border-border-default active:scale-[0.985]"
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-xl text-xl shrink-0"
        style={{ backgroundColor: color + "22" }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold truncate text-text-primary">{pos.nameKo}</h3>
          <span
            className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0",
              isZero && "text-text-tertiary",
            )}
            style={isZero ? { backgroundColor: "#22222E" } : { backgroundColor: color + "2A", color }}
          >
            {isZero ? "미시작" : `${pct}%`}
          </span>
        </div>
        <div className="mt-1.5 h-[5px] rounded-full bg-bg-overlay overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
        <div className="mt-1.5 text-[10px] text-text-tertiary font-mono">
          {pos.id} · {pos.trainedCount}/{pos.childCount} 수련
        </div>
      </div>
      <ChevronRight size={16} className="text-text-disabled group-hover:text-text-secondary shrink-0" />
    </Link>
  );
}

export default function SkillTreeBrowser({ groups }: { groups: StreamGroup[] }) {
  const byStream = useMemo(() => {
    const m = new Map<Stream, PosSummary[]>();
    for (const g of groups) m.set(g.stream, g.positions);
    return m;
  }, [groups]);

  const available = STREAM_ORDER.filter((s) => (byStream.get(s)?.length ?? 0) > 0);
  const [activeStream, setActiveStream] = useState<Stream>(available[0] ?? "가드포지션");

  const positions = byStream.get(activeStream) ?? [];
  const color = STREAM_META[activeStream].color;

  return (
    <div>
      {/* 스트림 세그먼트 (4균등) */}
      <div className="grid grid-cols-4 gap-1.5 px-3 pt-3 pb-3">
        {STREAM_ORDER.map((stream) => {
          const meta = STREAM_META[stream];
          const active = stream === activeStream;
          const disabled = (byStream.get(stream)?.length ?? 0) === 0;
          return (
            <button
              key={stream}
              onClick={() => !disabled && setActiveStream(stream)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl text-[10px] font-bold transition-all duration-base border",
                active ? "border-transparent text-white" : "border-border-subtle text-text-tertiary bg-bg-elevated hover:bg-bg-hover",
                disabled && "opacity-35",
              )}
              style={active ? { backgroundColor: meta.color } : {}}
            >
              <span className="text-lg leading-none">{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* 섹션 라벨 */}
      <div className="px-4 pb-2">
        <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-text-tertiary">
          {STREAM_META[activeStream].label} 포지션 · {positions.length}개
        </span>
      </div>

      {/* 포지션 카드 리스트 — 내부 스크롤 없이 일반 문서 흐름 (2026-09-19) */}
      <div className="px-3 pb-4 space-y-2.5">
        {positions.map((p) => (
          <PositionCard key={p.id} pos={p} color={color} />
        ))}
        {positions.length === 0 && (
          <p className="text-text-tertiary text-sm text-center py-10">이 스트림에 포지션이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
