/**
 * Chip — 범용 소형 태그 컴포넌트
 * TypeChip / BeltChip / StreamChip 처럼 특화된 칩이 없는 메타 정보에 사용
 * (기·노기, 수련 횟수, XP, 기타 레이블 등)
 */
import { cn } from "@/lib/utils";

type ChipVariant = "default" | "muted" | "brand" | "danger" | "success";

const VARIANT_STYLES: Record<ChipVariant, string> = {
  default: "bg-bg-overlay text-text-secondary",
  muted:   "bg-bg-base   text-text-tertiary",
  brand:   "bg-brand-primary/15 text-brand-primary",
  danger:  "bg-danger/15 text-danger",
  success: "bg-[#34D399]/15 text-[#34D399]",
};

export function Chip({
  children,
  variant = "default",
  size = "sm",
  className,
}: {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: "xs" | "sm";
  className?: string;
}) {
  const dim = size === "xs"
    ? "h-5 px-1.5 text-[10px]"
    : "h-6 px-2 text-[11px]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none",
        dim,
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
