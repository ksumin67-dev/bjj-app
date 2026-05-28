import type { BeltLevel } from "@/types/domain";
import { cn } from "@/lib/utils";

const STYLES: Record<BeltLevel, { bg: string; text: string; border?: string }> = {
  "White Belt":  {
    bg:     "bg-belt-white",
    text:   "text-[#1A1D24]",
    border: "border border-border-strong",
  },
  "Blue Belt":   { bg: "bg-belt-blue",   text: "text-white" },
  "Purple Belt": { bg: "bg-belt-purple", text: "text-white" },
  "Brown Belt":  { bg: "bg-belt-brown",  text: "text-white" },
  "Black Belt":  {
    bg:     "bg-belt-black",
    text:   "text-text-primary",
    border: "border border-border-strong",
  },
};

export function BeltChip({
  belt,
  size = "sm",
  className,
}: {
  belt:       BeltLevel;
  size?:      "xs" | "sm";
  className?: string;
}) {
  const style = STYLES[belt];
  const dim   = size === "xs" ? "h-5 px-1.5 text-[10px]" : "h-6 px-2 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold leading-none",
        dim,
        style.bg,
        style.text,
        style.border,
        className,
      )}
    >
      {belt}
    </span>
  );
}
