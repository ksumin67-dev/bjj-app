"use client";

/**
 * SkillTreeGraph v3 — 수련 횟수(trainingCountMap) 기반 노드 색상
 */

import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import type { Technique, Stream } from "@/types/domain";
import { trainingCountLabel } from "@/types/domain";
import { TechDetailSheet } from "./TechDetailSheet";

// ── 상수 ────────────────────────────────────────────────────────────────────

const TECH_W   = 160;
const TECH_H   = 74;
const CAT_W    = 170;
const CAT_H    = 48;
const COL_GAP  = 24;
const CAT_TECH = 16;
const TECH_GAP = 14;
const TITLE_H  = 56;

// ── 스트림 메타 ─────────────────────────────────────────────────────────────

type StreamMeta = { color: string; label: string; emoji: string };

const STREAM_META: Record<Stream, StreamMeta> = {
  가드포지션: { color: "#2E80F0", label: "가드포지션", emoji: "🛡️" },
  탑포지션:   { color: "#FF8C42", label: "탑포지션",   emoji: "⚔️" },
  이스케이프: { color: "#A78BFA", label: "이스케이프", emoji: "🏃" },
  스탠딩:     { color: "#FBBF24", label: "스탠딩",     emoji: "🥋" },
};

const STREAM_ORDER: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

// ── 포지션 이름 맵 ───────────────────────────────────────────────────────────

const POSITION_NAMES: Record<string, string> = {
  CG:  "클로즈드 가드",
  HG:  "하프 가드",
  BF:  "버터플라이",
  DLR: "De La Riva",
  SP:  "스파이더",
  RG:  "러버 가드",
  XG:  "X 가드",
  SLX: "싱글 레그 X",
  LP:  "라펠/웜",
  GR:  "가드 리텐션",
  GP:  "가드 패스",
  SC:  "사이드 컨트롤",
  KB:  "니 온 벨리",
  NS:  "노스사우스",
  MT:  "마운트",
  BC:  "백 컨트롤",
  TD:  "테이크다운",
  TR:  "포지션 전환",
  ES:  "이스케이프",
  SD:  "서브미션 디펜스",
  CH:  "초크",
  AL:  "암락",
  SL:  "숄더락",
  LL:  "레그락",
};

// ── 수련 횟수 → 노드 스타일 ─────────────────────────────────────────────────

type CountStyle = { border: string; bg: string; text: string; dot: string };

function getCountStyle(count: number): CountStyle {
  if (count === 0)  return { border: "#2E3540", bg: "#161A21", text: "#4A5160", dot: "#374151" };
  if (count <= 2)   return { border: "#5B21B6", bg: "#1E1040", text: "#A78BFA", dot: "#7C3AED" };
  if (count <= 9)   return { border: "#1D4ED8", bg: "#0F1F40", text: "#60A5FA", dot: "#2563EB" };
  return              { border: "#10B981", bg: "#052E20", text: "#34D399", dot: "#10B981" };
}

const COUNT_LEGEND = [
  { label: "미수련",  dot: "#374151" },
  { label: "시작",    dot: "#7C3AED" },
  { label: "드릴 중", dot: "#2563EB" },
  { label: "익숙",    dot: "#10B981" },
];

// ── 노드 타입 정의 ──────────────────────────────────────────────────────────

type TechNodeData = {
  technique: Technique;
  trainingCount: number;
  streamColor: string;
  isMainSkill: boolean;
};

type CatNodeData = {
  prefix: string;
  label: string;
  streamColor: string;
};

type TechNode = Node<TechNodeData, "tech">;
type CatNode  = Node<CatNodeData,  "cat">;

// ── 기술 노드 컴포넌트 ──────────────────────────────────────────────────────

function TechNodeComponent({ data }: NodeProps<TechNode>) {
  const count = data.trainingCount;
  const s = getCountStyle(count);
  const label = trainingCountLabel(count);
  const isExpert = count >= 10;

  return (
    <div
      style={{
        width: TECH_W,
        borderColor: s.border,
        backgroundColor: s.bg,
        boxShadow: isExpert ? `0 0 16px ${s.dot}55, 0 0 0 1px ${s.dot}33` : undefined,
      }}
      className="rounded-xl border-2 px-3 py-2.5 cursor-pointer select-none transition-all duration-base hover:brightness-125"
    >
      <Handle type="target" position={Position.Top}
        style={{ opacity: 0, width: 1, height: 1 }} />

      {/* ID */}
      <p className="text-[9px] font-mono mb-1 tracking-wider" style={{ color: data.streamColor }}>
        {data.technique.id}
      </p>

      {/* 기술명 */}
      <p className="text-[12px] font-bold leading-tight" style={{ color: s.text }}>
        {data.technique.nameKo}
      </p>

      {/* 수련 횟수 + XP + 주력 배지 */}
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1">
          {count > 0 ? (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: s.dot + "28", color: s.dot }}
            >
              {label} {count}회
            </span>
          ) : (
            <span className="text-[9px] text-text-disabled">미수련</span>
          )}
          {data.isMainSkill && (
            <span className="text-[10px]" title="주력 기술">⭐</span>
          )}
        </div>
        <span className="text-[9px] text-text-tertiary font-mono">
          {data.technique.xpValue}xp
        </span>
      </div>

      <Handle type="source" position={Position.Bottom}
        style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

// ── 카테고리 헤더 노드 ──────────────────────────────────────────────────────

function CatNodeComponent({ data }: NodeProps<CatNode>) {
  return (
    <div
      style={{
        width: CAT_W,
        borderColor: data.streamColor + "55",
        backgroundColor: data.streamColor + "12",
      }}
      className="rounded-xl border px-3 py-2.5 text-center select-none"
    >
      <Handle type="target" position={Position.Top}
        style={{ opacity: 0, width: 1, height: 1 }} />
      <p className="text-[8px] font-mono opacity-50 tracking-widest"
        style={{ color: data.streamColor }}>{data.prefix}</p>
      <p className="text-[12px] font-bold mt-0.5" style={{ color: data.streamColor }}>
        {data.label}
      </p>
      <Handle type="source" position={Position.Bottom}
        style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

const nodeTypes = { tech: TechNodeComponent, cat: CatNodeComponent };

// ── 스트림 레이아웃 계산 ─────────────────────────────────────────────────────

function buildStreamLayout(
  stream: Stream,
  techniques: Technique[],
  trainingCountMap: Record<string, number>,
): { nodes: Node[]; edges: Edge[] } {
  const { color } = STREAM_META[stream];
  const techs = techniques.filter((t) => t.stream === stream);

  const groups = new Map<string, Technique[]>();
  for (const t of techs) {
    const prefix = t.id.split("-")[0];
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(t);
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let colX = 0;

  for (const [prefix, colTechs] of groups) {
    const catId = `cat-${prefix}`;

    nodes.push({
      id: catId,
      type: "cat",
      position: { x: colX, y: TITLE_H },
      data: { prefix, label: POSITION_NAMES[prefix] ?? prefix, streamColor: color },
      selectable: false,
      draggable: false,
    } as Node);

    const sorted = [...colTechs].sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));

    sorted.forEach((t, i) => {
      const techX = colX + (CAT_W - TECH_W) / 2;
      const techY = TITLE_H + CAT_H + CAT_TECH + i * (TECH_H + TECH_GAP);

      nodes.push({
        id: t.recordId,
        type: "tech",
        position: { x: techX, y: techY },
        data: {
          technique: t,
          trainingCount: trainingCountMap[t.recordId] ?? 0,
          streamColor: color,
          isMainSkill: t.isMainSkill,
        },
      } as Node);

      edges.push({
        id: `${catId}->${t.recordId}`,
        source: catId,
        target: t.recordId,
        type: "straight",
        style: { stroke: color + "25", strokeWidth: 1, strokeDasharray: "3 5" },
        selectable: false,
        focusable: false,
      });
    });

    colX += CAT_W + COL_GAP;
  }

  return { nodes, edges };
}

// ── 스트림 캔버스 ───────────────────────────────────────────────────────────

function StreamCanvas({
  stream,
  techniques,
  trainingCountMap,
  onNodeClick,
}: {
  stream: Stream;
  techniques: Technique[];
  trainingCountMap: Record<string, number>;
  onNodeClick: (t: Technique, count: number) => void;
}) {
  const { nodes, edges } = useMemo(
    () => buildStreamLayout(stream, techniques, trainingCountMap),
    [stream, techniques, trainingCountMap],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type !== "tech") return;
      const d = node.data as TechNodeData;
      onNodeClick(d.technique, d.trainingCount);
    },
    [onNodeClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
      minZoom={0.07}
      maxZoom={2}
      panOnScroll
      zoomOnPinch
      proOptions={{ hideAttribution: true }}
      style={{ background: "#0D1117", width: "100%", height: "100%" }}
    >
      <Background color="#161c27" gap={28} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        style={{ backgroundColor: "#0D1117", border: "1px solid #2E3540" }}
        nodeColor={(n) => {
          if (n.type === "cat") return "#2E3540";
          const count = (n.data as TechNodeData).trainingCount ?? 0;
          return getCountStyle(count).dot;
        }}
        maskColor="#0D111788"
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

// ── 진행률 바 ───────────────────────────────────────────────────────────────

function ProgressBar({ stream, techniques, trainingCountMap }: {
  stream: Stream;
  techniques: Technique[];
  trainingCountMap: Record<string, number>;
}) {
  const streamTechs = techniques.filter((t) => t.stream === stream);
  const total = streamTechs.length;
  if (total === 0) return null;

  const trained  = streamTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0).length;
  const expert   = streamTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) >= 10).length;
  const { color } = STREAM_META[stream];
  const pct = Math.round((trained / total) * 100);

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex-1 h-1.5 rounded-full bg-bg-overlay overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-slow"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-text-tertiary tabular-nums whitespace-nowrap">
        {trained}/{total} · 익숙 {expert}개
      </span>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────

interface SkillTreeGraphProps {
  techniques: Technique[];
  trainingCountMap: Record<string, number>;
}

export default function SkillTreeGraph({ techniques, trainingCountMap }: SkillTreeGraphProps) {
  const [activeStream, setActiveStream] = useState<Stream>("가드포지션");
  const [selectedTech, setSelectedTech] = useState<Technique | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const handleNodeClick = useCallback((t: Technique, count: number) => {
    setSelectedTech(t);
    setSelectedCount(count);
  }, []);

  const closeSheet = useCallback(() => setSelectedTech(null), []);

  return (
    <div className="flex flex-col h-full">
      {/* ── 스트림 탭 ───────────────────────────────────────── */}
      <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-none">
        {STREAM_ORDER.map((stream) => {
          const { color, emoji, label } = STREAM_META[stream];
          const active = stream === activeStream;
          const count  = techniques.filter((t) => t.stream === stream).length;

          return (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-base",
                active
                  ? "text-white"
                  : "text-text-tertiary bg-bg-elevated hover:bg-bg-hover",
              )}
              style={active ? { backgroundColor: color, boxShadow: `0 0 16px ${color}44` } : {}}
            >
              <span>{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                  active ? "bg-white/20 text-white" : "bg-bg-overlay text-text-tertiary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 진행률 바 ────────────────────────────────────────── */}
      <div className="px-3 pb-2">
        <ProgressBar
          stream={activeStream}
          techniques={techniques}
          trainingCountMap={trainingCountMap}
        />
      </div>

      {/* ── 캔버스 ───────────────────────────────────────────── */}
      <div
        className="flex-1 rounded-xl overflow-hidden border border-border-subtle mx-3 mb-3"
        style={{ minHeight: 480 }}
      >
        <div className="w-full h-full">
          <StreamCanvas
            key={activeStream}
            stream={activeStream}
            techniques={techniques}
            trainingCountMap={trainingCountMap}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      {/* ── 범례 ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-3">
        {COUNT_LEGEND.map(({ label, dot }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
            {label}
          </span>
        ))}
      </div>

      {/* ── 기술 상세 시트 ──────────────────────────────────── */}
      <TechDetailSheet
        technique={selectedTech}
        trainingCount={selectedCount}
        onClose={closeSheet}
      />
    </div>
  );
}
