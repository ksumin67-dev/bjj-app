import { Circle, Flame, Star, Zap } from "lucide-react";
import { trainingCountLabel } from "@/types/domain";
import { cn } from "@/lib/utils";

const COUNT_ICONS: Record<string, { color: string; label: string }> = {
  "미수련": { color: "text-[#4A5160]",  label: "미수련" },
  "시작":   { color: "text-[#A78BFA]",  label: "시작"  },
  "드릴 중": { color: "text-[#60A5FA]", label: "드릴 중" },
  "익숙":   { color: "text-[#34D399]",  label: "익숙"  },
};

export function StatusIcon({
  count = 0,
  size = 18,
  showLabel = false,
  className,
}: {
  count?: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const label = trainingCountLabel(count);
  const style = COUNT_ICONS[label] ?? COUNT_ICONS["미수련"];
  const Icon = count === 0 ? Circle : count <= 2 ? Flame : count <= 9 ? Zap : Star;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Icon size={size} className={style.color} />
      {showLabel && (
        <span className={cn("text-xs font-medium", style.color)}>
          {label}
        </span>
      )}
    </span>
  );
}
