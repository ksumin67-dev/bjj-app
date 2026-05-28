"use client";

/**
 * SkillTreeGraph — ReactFlow 캔버스 (모바일/데스크탑 공통)
 *
 * Option E 모바일 튜닝:
 *  - 모바일 노드 크기 축소 (TECH_W 160→120, CAT_W 170→140)
 *  - 모바일 기본 줌 0.75→0.45
 *  - MiniMap 모바일 숨김
 *  - "전체 보기" Fit View 버튼 추가
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import type { Technique, Stream } from "@/types/domain";
import { trainingCountLabel } from "@/types/domain";
import { TechDetailSheet } from "./TechDetailSheet";

// ── 레이아웃 상수 ─────────────────────────────────────────────────────────────

const DESKTOP = { TECH_W: 160, TECH_H: 74, CAT_W: 170, CAT_H: 48 };
const MOBILE  = { TECH_W: 120, TECH_H: 62, CAT_W: 130, CAT_H: 40 };

const COL_GAP  = 20;
const CAT_TECH = 14;
const TECH_GAP = 10;
const TITLE_H  = 52;

// ── 스트림 메타 ───────────────────────────────────────────────────────────────

const STREAM_META: Record<Stream, { color: string; label: string; emoji: string }> = {
  가드포지션: { color: "#2E80F0", label: "가드포지션", emoji: "🛡️" },
  탑포지션:   { color: "#FF8C42", label: "탑포지션",   emoji: "⚔️" },
  이스케이프: { color: "#A78BFA", label: "이스케이프", emoji: "🏃" },
  스탠딩:     { color: "#FBBF24", label: "스탠딩",     emoji: "🥋" },
};

const STREAM_ORDER: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

const POSITION_NAMES: Record<string, string> = {
  // 가드포지션
  CG:"클로즈드 가드", HG:"하프 가드", BF:"버터플라이",
  DLR:"데라리바", RDLR:"리버스 데라리바",
  SP:"스파이더", LS:"라소 가드", RG:"러버 가드",
  XG:"X 가드", SLX:"싱글 레그 X",
  FF:"50/50 가드", SG:"새들 가드", KG:"K가드",
  // 탑포지션
  GP:"가드 패싱", SC:"사이드 컨트롤",
  MT:"마운트", KNB:"니 온 벨리", KB:"니 온 벨리",
  NS:"노스-사우스", BC:"백 컨트롤",
  GB:"가드 브레이크", GBCG:"CG 브레이크", GBSP:"SP 브레이크",
  GBLS:"LS 브레이크", GBDLR:"DLR 브레이크", GBBF:"BF 브레이크",
  // 이스케이프
  ME:"마운트 이스케이프", SCE:"사이드 이스케이프",
  BD:"백 디펜스", KNBE:"니온벨리 이스케이프", NSE:"노스-사우스 이스케이프",
  // 스탠딩
  TD:"테이크다운",
};

// ── 스타일 헬퍼 ───────────────────────────────────────────────────────────────

type CountStyle = { border: string; bg: string; text: string; dot: string };
function getCountStyle(count: number): CountStyle {
  if (count === 0)  return { border: "#2E3540", bg: "#161A21", text: "#4A5160", dot: "#374151" };
  if (count <= 2)   return { border: "#5B21B6", bg: "#1E1040", text: "#A78BFA", dot: "#7C3AED" };
  if (count <= 9)   return { border: "#1D4ED8", bg: "#0F1F40", text: "#60A5FA", dot: "#2563EB" };
  return              { border: "#10B981", bg: "#052E20", text: "#34D399", dot: "#10B981" };
}

const COUNT_LEGEND = [
  { label: "미수련", dot: "#374151" },
  { label: "시작",   dot: "#7C3AED" },
  { label: "드릴 중",dot: "#2563EB" },
  { label: "익숙",   dot: "#10B981" },
];

// ── 노드 타입 ─────────────────────────────────────────────────────────────────

type TechNodeData = { technique: Technique; trainingCount: number; streamColor: string; isMainSkill: boolean; isMobile: boolean };
type CatNodeData  = { prefix: string; label: string; streamColor: string; isMobile: boolean };
type TechNode = Node<TechNodeData, "tech">;
type CatNode  = Node<CatNodeData,  "cat">;

function TechNodeComponent({ data }: NodeProps<TechNode>) {
  const count = data.trainingCount;
  const s = getCountStyle(count);
  const label = trainingCountLabel(count);
  const isExpert = count >= 10;
  const { TECH_W: W, TECH_H: H } = data.isMobile ? MOBILE : DESKTOP;
  return (
    <div
      style={{ width: W, minHeight: H, borderColor: s.border, backgroundColor: s.bg,
        boxShadow: isExpert ? `0 0 14px ${s.dot}55, 0 0 0 1px ${s.dot}33` : undefined }}
      className="rounded-xl border-2 px-2.5 py-2 cursor-pointer select-none transition-all duration-base hover:brightness-125"
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, width: 1, height: 1 }} />
      <p className="font-mono mb-0.5 tracking-wider" style={{ fontSize: data.isMobile ? 8 : 9, color: data.streamColor }}>{data.technique.id}</p>
      <p className="font-bold leading-tight" style={{ fontSize: data.isMobile ? 11 : 12, color: s.text }}>{data.technique.nameKo}</p>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1">
          {count > 0 ? (
            <span className="px-1.5 py-0.5 rounded-full font-semibold" style={{ fontSize: 8, backgroundColor: s.dot + "28", color: s.dot }}>
              {label} {count}회
            </span>
          ) : (
            <span className="text-text-disabled" style={{ fontSize: 8 }}>미수련</span>
          )}
          {data.isMainSkill && <span style={{ fontSize: 9 }} title="주력 기술">⭐</span>}
        </div>
        <span className="text-text-tertiary font-mono" style={{ fontSize: 8 }}>{data.technique.xpValue}xp</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

function CatNodeComponent({ data }: NodeProps<CatNode>) {
  const { CAT_W: W, CAT_H: H } = data.isMobile ? MOBILE : DESKTOP;
  return (
    <div style={{ width: W, minHeight: H, borderColor: data.streamColor + "55", backgroundColor: data.streamColor + "12" }}
      className="rounded-xl border px-2.5 py-2 text-center select-none">
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, width: 1, height: 1 }} />
      <p className="font-mono opacity-50 tracking-widest" style={{ fontSize: 7, color: data.streamColor }}>{data.prefix}</p>
      <p className="font-bold mt-0.5" style={{ fontSize: data.isMobile ? 11 : 12, color: data.streamColor }}>{data.label}</p>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

const nodeTypes = { tech: TechNodeComponent, cat: CatNodeComponent };

// ── 레이아웃 빌더 ─────────────────────────────────────────────────────────────

function buildStreamLayout(stream: Stream, techniques: Technique[], trainingCountMap: Record<string, number>, isMobile: boolean) {
  const { color } = STREAM_META[stream];
  const { TECH_W, CAT_W, CAT_H, TECH_H } = isMobile ? MOBILE : DESKTOP;
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
    nodes.push({ id: catId, type: "cat", position: { x: colX, y: TITLE_H },
      data: { prefix, label: POSITION_NAMES[prefix] ?? prefix, streamColor: color, isMobile },
      selectable: false, draggable: false } as Node);
    const sorted = [...colTechs].sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));
    sorted.forEach((t, i) => {
      const techX = colX + (CAT_W - TECH_W) / 2;
      const techY = TITLE_H + CAT_H + CAT_TECH + i * (TECH_H + TECH_GAP);
      nodes.push({ id: t.recordId, type: "tech", position: { x: techX, y: techY },
        data: { technique: t, trainingCount: trainingCountMap[t.recordId] ?? 0, streamColor: color, isMainSkill: t.isMainSkill, isMobile } } as Node);
      edges.push({ id: `${catId}->${t.recordId}`, source: catId, target: t.recordId, type: "straight",
        style: { stroke: color + "25", strokeWidth: 1, strokeDasharray: "3 5" }, selectable: false, focusable: false });
    });
    colX += CAT_W + COL_GAP;
  }
  return { nodes, edges };
}

// ── Fit View 버튼 (ReactFlow 내부 컨텍스트 필요) ────────────────────────────

function FitViewButton() {
  const { fitView } = useReactFlow();
  return (
    <button
      onClick={() => fitView({ padding: 0.08, duration: 400 })}
      className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-text-secondary bg-bg-elevated/90 border border-border-subtle backdrop-blur-sm hover:bg-bg-hover transition-all duration-base"
      title="전체 보기"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8"/>
      </svg>
      전체 보기
    </button>
  );
}

// ── StreamCanvas ──────────────────────────────────────────────────────────────

function StreamCanvas({ stream, techniques, trainingCountMap, onNodeClick, isMobile }: {
  stream: Stream; techniques: Technique[]; trainingCountMap: Record<string, number>;
  onNodeClick: (t: Technique, count: number) => void; isMobile: boolean;
}) {
  const { nodes, edges } = useMemo(
    () => buildStreamLayout(stream, techniques, trainingCountMap, isMobile),
    [stream, techniques, trainingCountMap, isMobile],
  );
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type !== "tech") return;
    const d = node.data as TechNodeData;
    onNodeClick(d.technique, d.trainingCount);
  }, [onNodeClick]);

  const defaultZoom = isMobile ? 0.45 : 0.75;

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes} edges={edges} nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        defaultViewport={{ x: 0, y: 0, zoom: defaultZoom }}
        minZoom={0.07} maxZoom={2}
        panOnScroll zoomOnPinch
        proOptions={{ hideAttribution: true }}
        style={{ background: "#0D1117", width: "100%", height: "100%" }}
      >
        <Background color="#161c27" gap={28} size={1} />
        <Controls showInteractive={false} />
        {!isMobile && (
          <MiniMap
            style={{ backgroundColor: "#0D1117", border: "1px solid #2E3540" }}
            nodeColor={(n) => {
              if (n.type === "cat") return "#2E3540";
              const count = (n.data as TechNodeData).trainingCount ?? 0;
              return getCountStyle(count).dot;
            }}
            maskColor="#0D111788" pannable zoomable
          />
        )}
        <FitViewButton />
      </ReactFlow>
    </div>
  );
}

// ── 진행률 바 ─────────────────────────────────────────────────────────────────

function ProgressBar({ stream, techniques, trainingCountMap }: {
  stream: Stream; techniques: Technique[]; trainingCountMap: Record<string, number>;
}) {
  const streamTechs = techniques.filter((t) => t.stream === stream);
  const total = streamTechs.length;
  if (total === 0) return null;
  const trained = streamTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0).length;
  const expert  = streamTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) >= 10).length;
  const { color } = STREAM_META[stream];
  const pct = Math.round((trained / total) * 100);
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex-1 h-1.5 rounded-full bg-bg-overlay overflow-hidden">
        <div className="h-full rounded-full transition-all duration-slow" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] text-text-tertiary tabular-nums whitespace-nowrap">{trained}/{total} · 익숙 {expert}개</span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

interface Props { techniques: Technique[]; trainingCountMap: Record<string, number> }

export default function SkillTreeGraph({ techniques, trainingCountMap }: Props) {
  const [activeStream, setActiveStream] = useState<Stream>("가드포지션");
  const [selectedTech, setSelectedTech]   = useState<Technique | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleNodeClick = useCallback((t: Technique, count: number) => {
    setSelectedTech(t); setSelectedCount(count);
  }, []);
  const closeSheet = useCallback(() => setSelectedTech(null), []);

  return (
    <div className="flex flex-col h-full">
      {/* 스트림 탭 */}
      <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-none">
        {STREAM_ORDER.map((stream) => {
          const { color, emoji, label } = STREAM_META[stream];
          const active = stream === activeStream;
          const count  = techniques.filter((t) => t.stream === stream).length;
          return (
            <button key={stream} onClick={() => setActiveStream(stream)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-base",
                active ? "text-white" : "text-text-tertiary bg-bg-elevated hover:bg-bg-hover",
              )}
              style={active ? { backgroundColor: color, boxShadow: `0 0 16px ${color}44` } : {}}>
              <span>{emoji}</span>
              <span className={cn(isMobile ? "hidden" : "inline")}>{label}</span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                active ? "bg-white/20 text-white" : "bg-bg-overlay text-text-tertiary")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 진행률 바 */}
      <div className="px-3 pb-2">
        <ProgressBar stream={activeStream} techniques={techniques} trainingCountMap={trainingCountMap} />
      </div>

      {/* 캔버스 */}
      <div className="flex-1 rounded-xl overflow-hidden border border-border-subtle mx-3 mb-3" style={{ minHeight: isMobile ? 380 : 480 }}>
        <StreamCanvas
          key={`${activeStream}-${isMobile}`}
          stream={activeStream} techniques={techniques}
          trainingCountMap={trainingCountMap}
          onNodeClick={handleNodeClick}
          isMobile={isMobile}
        />
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-3">
        {COUNT_LEGEND.map(({ label, dot }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
            {label}
          </span>
        ))}
      </div>

      <TechDetailSheet technique={selectedTech} trainingCount={selectedCount} onClose={closeSheet} />
    </div>
  );
}
