import type { Stream } from "@/types/domain";
import { cn } from "@/lib/utils";

const STREAM_STYLES: Record<Stream, { bg: string; text: string }> = {
  가드포지션: { bg: "rgba(46,128,240,0.15)",  text: "#7EC8FF" },
  탑포지션:   { bg: "rgba(255,140,66,0.15)",  text: "#FFB347" },
  이스케이프: { bg: "rgba(167,139,250,0.15)", text: "#C4A4FF" },
  스탠딩:     { bg: "rgba(251,191,36,0.15)",  text: "#FFE066" },
};

const STREAM_LABEL: Record<Stream, string> = {
  가드포지션: "가드",
  탑포지션:   "탑",
  이스케이프: "이스케이프",
  스탠딩:     "스탠딩",
};

export function StreamChip({
  stream,
  size = "sm",
  className,
}: {
  stream: Stream;
  size?: "xs" | "sm";
  className?: string;
}) {
  const style = STREAM_STYLES[stream];
  const dim = size === "xs"
    ? "h-5 px-1.5 text-[10px]"
    : "h-6 px-2 text-[11px]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none",
        dim,
        className,
      )}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {STREAM_LABEL[stream]}
    </span>
  );
}
