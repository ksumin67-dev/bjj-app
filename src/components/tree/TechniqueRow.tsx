import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Technique } from "@/types/domain";
import { cn } from "@/lib/utils";
import { StatusIcon } from "./StatusIcon";
import { TypeChip } from "./TypeChip";
import { Chip } from "@/components/ui/Chip";

export function TechniqueRow({
  technique,
  trainingCount = 0,
  positionId,
}: {
  technique: Technique;
  trainingCount?: number;
  positionId: string;
}) {
  const isPracticed = trainingCount > 0;

  return (
    <Link
      href={`/tree/${positionId}/${technique.id}`}
      className={cn(
        "block rounded-2xl border border-border-subtle bg-bg-elevated p-4",
        "hover:bg-bg-hover hover:border-border-default transition-all duration-base ease-out-soft",
        !isPracticed && "opacity-60",
      )}
    >
      <div className="flex items-center gap-3">
        <StatusIcon count={trainingCount} size={20} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-tertiary">
              {technique.id}
            </span>
            <h3 className="text-[15px] font-semibold truncate">
              {technique.nameKo}
            </h3>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <TypeChip type={technique.type} />
            <span className="text-[11px] text-text-tertiary">
              {technique.xpValue} XP
            </span>
            {trainingCount > 0 && (
              <Chip size="xs" variant="muted">수련 {trainingCount}회</Chip>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-text-tertiary shrink-0" />
      </div>
    </Link>
  );
}
