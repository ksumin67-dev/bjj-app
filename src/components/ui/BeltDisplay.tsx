import type { BeltLevel } from "@/types/domain";

/**
 * BJJ 벨트 형태 시각화 컴포넌트
 * 실제 도복 벨트처럼 컬러 바디 + 검정(or 레드) 팁 + 흰(or 골드) 그랄 구조
 * IBJJF 기준: 흰~갈색 팁=검정/줄=흰색, 검은띠 팁=레드/줄=골드
 */

type BeltConfig = {
  bodyGrad:  [string, string];
  tipBg:     string;
  stripeBg:  string;
  textColor: string;
};

export const BELT_CONFIG: Record<BeltLevel, BeltConfig> = {
  "White Belt":  {
    bodyGrad:  ["#F5F5F5", "#D5D5D5"],
    tipBg:     "#1A1A1A",
    stripeBg:  "rgba(255,255,255,0.9)",
    textColor: "#D0D0D0",
  },
  "Blue Belt":   {
    bodyGrad:  ["#4AA8FF", "#1A6EE8"],
    tipBg:     "#0D1A2E",
    stripeBg:  "rgba(255,255,255,0.9)",
    textColor: "#7EC8FF",
  },
  "Purple Belt": {
    bodyGrad:  ["#A878FF", "#6A38FF"],
    tipBg:     "#1A0A30",
    stripeBg:  "rgba(255,255,255,0.9)",
    textColor: "#C4A4FF",
  },
  "Brown Belt":  {
    bodyGrad:  ["#D88A38", "#8C4E18"],
    tipBg:     "#1A0A00",
    stripeBg:  "rgba(255,255,255,0.9)",
    textColor: "#E8A860",
  },
  "Black Belt":  {
    bodyGrad:  ["#484848", "#1A1A1A"],
    tipBg:     "#7A0000",
    stripeBg:  "rgba(255,215,80,0.95)",
    textColor: "#D0D0D0",
  },
};

interface BeltDisplayProps {
  belt:       BeltLevel;
  stripe:     number;
  fullWidth?: boolean;
  height?:    number;
  tipWidth?:  number;
  className?: string;
}

export function BeltDisplay({
  belt,
  stripe,
  fullWidth = true,
  height    = 24,
  tipWidth  = 60,
  className = "",
}: BeltDisplayProps) {
  const cfg       = BELT_CONFIG[belt] ?? BELT_CONFIG["White Belt"];
  const maxStripe = belt === "Black Belt" ? 6 : 4;
  const clamped   = Math.min(Math.max(stripe, 0), maxStripe);
  const radius    = Math.round(height / 2);

  return (
    <div
      className={className}
      style={{
        display:      "flex",
        alignItems:   "stretch",
        width:        fullWidth ? "100%" : "auto",
        height:       `${height}px`,
        borderRadius: `${radius}px`,
        overflow:     "hidden",
        boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      {/* 벨트 바디 */}
      <div
        style={{
          flex:       1,
          background: `linear-gradient(180deg, ${cfg.bodyGrad[0]} 0%, ${cfg.bodyGrad[1]} 100%)`,
          position:   "relative",
        }}
      >
        <div
          style={{
            position:      "absolute",
            inset:         0,
            background:    "repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 팁 + 그랄 */}
      <div
        style={{
          width:           `${tipWidth}px`,
          flexShrink:      0,
          backgroundColor: cfg.tipBg,
          borderLeft:      "1px solid rgba(0,0,0,0.5)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "flex-end",
          paddingRight:    6,
          gap:             3,
        }}
      >
        {Array.from({ length: clamped }).map((_, i) => (
          <div
            key={i}
            style={{
              width:           5,
              height:          Math.round(height * 0.65),
              borderRadius:    2,
              backgroundColor: cfg.stripeBg,
              flexShrink:      0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
