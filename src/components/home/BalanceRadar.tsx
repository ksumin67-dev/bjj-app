"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Check } from "lucide-react";

export type RadarAxis = { key: string; label: string; count: number };

export type RadarCoach = {
  /** 약점 축 label (없으면 균형 상태) */
  weakLabel: string | null;
  topLabel: string | null;
  gapPct: number;
  recommendations: { id: string; name: string; href: string }[];
};

const CX = 160;
const CY = 125;
const R = 84;
const BRAND = "#D9772E";
const DANGER = "#F87171";

// 위 → 오른쪽 → 아래 → 왼쪽
const DIRS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

/**
 * 수련 밸런스 레이더 — 4개 스트림(가드/탑/이스케이프/스탠딩) 수련 비율.
 * 외부 차트 라이브러리 없이 SVG로 그려 번들 증가 없음. 진입 시 중심에서 펼쳐지는 애니메이션.
 */
export function BalanceRadar({
  axes,
  coach,
}: {
  axes: RadarAxis[]; // 길이 4, 순서: 위/오른쪽/아래/왼쪽
  coach: RadarCoach;
}) {
  const reduce = useReducedMotion();
  const total = axes.reduce((s, a) => s + a.count, 0);
  const pct = axes.map((a) => (total > 0 ? Math.round((a.count / total) * 100) : 0));
  const maxPct = Math.max(...pct, 1);

  const points = axes.map((_, i) => {
    const radius = Math.max(8, (pct[i] / maxPct) * R);
    return { x: CX + DIRS[i].dx * radius, y: CY + DIRS[i].dy * radius };
  });
  const poly = points.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPos = [
    { x: CX, y: 20, anchor: "middle" as const, pctY: 33 },
    { x: CX + R + 16, y: CY - 3, anchor: "start" as const, pctY: CY + 11 },
    { x: CX, y: 232, anchor: "middle" as const, pctY: 245 },
    { x: CX - R - 16, y: CY - 3, anchor: "end" as const, pctY: CY + 11 },
  ];

  return (
    <div>
      <svg
        viewBox="0 0 320 256"
        width="100%"
        role="img"
        aria-label={axes.map((a, i) => `${a.label} ${pct[i]}퍼센트`).join(", ")}
      >
        {[R, R * 0.66, R * 0.33].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#262B34" strokeWidth="1" />
        ))}
        <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="#262B34" strokeWidth="1" />
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="#262B34" strokeWidth="1" />

        <motion.g
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={reduce ? false : { scale: 0.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.1 }}
        >
          <polygon points={poly} fill={BRAND} fillOpacity="0.22" stroke={BRAND} strokeOpacity="0.35" strokeWidth="7" strokeLinejoin="round" />
          <polygon points={poly} fill="none" stroke={BRAND} strokeWidth="2.2" strokeLinejoin="round" />
          {points.map((p, i) => {
            const isWeak = coach.weakLabel !== null && axes[i].label === coach.weakLabel;
            return (
              <circle
                key={axes[i].key}
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#14171D"
                stroke={isWeak ? DANGER : BRAND}
                strokeWidth="2.2"
              />
            );
          })}
        </motion.g>

        {axes.map((a, i) => {
          const isWeak = coach.weakLabel !== null && a.label === coach.weakLabel;
          const lp = labelPos[i];
          return (
            <g key={a.key}>
              <text x={lp.x} y={lp.y} textAnchor={lp.anchor} fontSize="12" fontWeight="500" fill={isWeak ? DANGER : "#FFFFFF"}>
                {a.label}
              </text>
              <text x={lp.x} y={lp.pctY} textAnchor={lp.anchor} fontSize="10" fill="#8A8A94">
                {pct[i]}%
              </text>
            </g>
          );
        })}
      </svg>

      {coach.weakLabel ? (
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: "rgba(248,113,113,0.1)" }}
        >
          <Target size={18} color={DANGER} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-white leading-tight">{coach.weakLabel} 강화가 필요해요</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#8A8A94" }}>
              {coach.topLabel ? `${coach.topLabel} 대비 ` : ""}수련 비율이 {coach.gapPct}%p 낮아요
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: "rgba(52,211,153,0.1)" }}
        >
          <Check size={18} color="#34D399" className="shrink-0" />
          <p className="text-[12.5px] font-bold text-white">고르게 수련하고 있어요</p>
        </div>
      )}

      {coach.weakLabel && coach.recommendations.length > 0 && (
        <div className="mt-2.5">
          <p className="text-[11px] font-semibold mb-1.5" style={{ color: "#8A8A94" }}>
            지금 연습하면 좋은 기술
          </p>
          <div className="flex flex-wrap gap-1.5">
            {coach.recommendations.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold active:scale-95 transition-transform duration-fast"
                style={{ backgroundColor: "#1A1A24", color: "#E5E7EB" }}
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
