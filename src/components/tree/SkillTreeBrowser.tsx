"use client";

/**
 * SkillTreeBrowser — 포지션 탭 (스트림 필터 → 포지션 플랫 리스트).
 *
 * (2026-09-19) 선수 탭(AthleteEntryScreen)과 톤앤매너 통일:
 *  - 스트림별 색깔 있는 필 버튼(파랑/주황/보라/노랑) → 선수 탭 스타일 태그와
 *    동일한 아웃라인 칩(활성 시 브랜드 앰버 하나로 통일). "데이터=액센트
 *    색 하나" 원칙을 이 탭에도 적용.
 *  - 박스 카드(rounded-2xl border + 배지 + 진행바) → 헤어라인 구분선
 *    플랫 리스트. 퍼센트는 선수 리스트의 heroStat과 동일한 자리(우측 상단
 *    큰 숫자)에 브랜드 액센트 색으로 표시.
 *  - 필터 전환 시 크로스페이드 + 리스트 순차 등장 애니메이션 추가.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Stream } from "@/types/domain";

const STREAM_META: Record<Stream, { label: string; emoji: string }> = {
  가드포지션: { label: "가드", emoji: "🛡️" },
  탑포지션:   { label: "탑", emoji: "⚔️" },
  이스케이프: { label: "이스케이프", emoji: "🏃" },
  스탠딩:     { label: "스탠딩", emoji: "🥋" },
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

function PositionRow({ pos }: { pos: PosSummary }) {
  const pct = pos.childCount === 0 ? 0 : Math.round((pos.trainedCount / pos.childCount) * 100);
  const emoji = POSITION_EMOJI[pos.id] ?? "🥋";
  const isZero = pos.trainedCount === 0;

  return (
    <Link
      href={`/tree/position/${pos.id}`}
      className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 active:opacity-70 active:scale-[0.99] transition-all duration-fast origin-left"
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-elevated text-base shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[13.5px] font-bold truncate text-text-primary">{pos.nameKo}</h3>
        <p className="text-[10.5px] text-text-tertiary truncate mt-0.5 font-mono">
          {pos.id} · {pos.trainedCount}/{pos.childCount} 수련
        </p>
      </div>
      <div className="flex flex-col items-end shrink-0 pl-1">
        <span
          className={cn(
            "text-[17px] font-bold tabular-nums",
            isZero ? "text-text-tertiary" : "text-brand-primary",
          )}
        >
          {isZero ? "-" : `${pct}%`}
        </span>
        <span className="text-[8.5px] text-text-tertiary whitespace-nowrap">
          {isZero ? "미시작" : "진행률"}
        </span>
      </div>
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

  return (
    <div>
      {/* 스트림 필터 — 선수 탭 스타일 태그와 동일한 아웃라인 칩 */}
      <div className="px-3 pt-3 pb-2 flex gap-1.5 overflow-x-auto">
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
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-base active:scale-[0.94]",
                active
                  ? "text-text-inverse bg-brand-primary border-brand-primary"
                  : "text-text-tertiary border-border-subtle hover:border-border-default",
                disabled && "opacity-35",
              )}
            >
              <span className="text-[13px] leading-none">{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* 섹션 라벨 */}
      <div className="px-4 pb-1">
        <span className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">
          {STREAM_META[activeStream].label} 포지션 · {positions.length}개
        </span>
      </div>

      {/* 포지션 리스트 — 선수 탭과 동일하게 크로스페이드 + 순차 등장 */}
      <div className="px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStream}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {positions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.02, ease: [0.22, 1, 0.36, 1] }}
              >
                <PositionRow pos={p} />
              </motion.div>
            ))}
            {positions.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-10">이 스트림에 포지션이 없습니다.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
