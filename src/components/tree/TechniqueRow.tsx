import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import type { Technique } from "@/types/domain";
import { cn } from "@/lib/utils";
import { StatusIcon } from "./StatusIcon";
import { TypeChip } from "./TypeChip";
import { Chip } from "@/components/ui/Chip";

export function TechniqueRow({
  technique,
  trainingCount = 0,
  positionId,
  highlight = false,
  dimmed = false,
}: {
  technique: Technique;
  trainingCount?: number;
  positionId: string;
  highlight?: boolean; // "다음 추천" 강조
  dimmed?: boolean;    // 소프트 잠금(흐리게)
}) {
  const isPracticed = trainingCount > 0;

  return (
    <Link
      href={`/tree/${positionId}/${technique.id}`}
      className={cn(
        "block rounded-2xl border p-4 transition-all duration-base ease-out-soft",
        "hover:bg-bg-hover hover:border-border-default",
        highlight
          ? "border-brand-primary bg-brand-primary/[0.06] ring-1 ring-brand-primary/40"
          : "border-border-subtle bg-bg-elevated",
        !highlight && !isPracticed && "opacity-60",
        dimmed && !highlight && "opacity-45",
      )}
    >
      {highlight && (
        <div className="flex items-center gap-1 mb-2 text-[11px] font-bold text-brand-primary">
          <Star size={12} className="fill-brand-primary" />
          다음 추천
        </div>
      )}
      <div className="flex items-center gap-3">
        <StatusIcon count={trainingCount} size={20} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-tertiary">{technique.id}</span>
            <h3 className="text-[15px] font-semibold truncate">{technique.nameKo}</h3>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <TypeChip type={technique.type} />
            <span className="text-[11px] text-text-tertiary">{technique.xpValue} XP</span>
            {trainingCount > 0 && <Chip size="xs" variant="muted">수련 {trainingCount}회</Chip>}
          </div>
        </div>
        <ChevronRight size={16} className="text-text-tertiary shrink-0" />
      </div>
    </Link>
  );
}
