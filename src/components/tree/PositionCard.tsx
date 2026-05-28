import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Technique } from "@/types/domain";
import { cn } from "@/lib/utils";

export function PositionCard({
  position,
  techniqueCount,
  masteredCount,
}: {
  position: Technique;
  techniqueCount: number;
  masteredCount: number;
}) {
  const progress =
    techniqueCount === 0 ? 0 : Math.round((masteredCount / techniqueCount) * 100);

  return (
    <Link
      href={`/tree/${position.id}`}
      className={cn(
        "group block rounded-2xl border p-4 transition-all duration-base ease-out-soft",
        "hover:translate-y-[-2px] hover:shadow-card-hover",
        "bg-bg-elevated border-border-subtle",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-text-tertiary">
              {position.id}
            </span>
          </div>
          <h3 className="text-base font-semibold truncate">
            {position.nameKo}
          </h3>
          <p className="text-xs text-text-tertiary truncate mt-0.5">
            {position.nameEn}
          </p>
        </div>
        <ChevronRight
          size={18}
          className="text-text-tertiary group-hover:text-text-secondary mt-1 shrink-0"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-text-secondary">
        <span>{techniqueCount}개 기술</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-bg-base overflow-hidden">
          <div
            className="h-full transition-all duration-slow bg-brand-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-text-tertiary tabular-nums">
          {progress}%
        </span>
      </div>
    </Link>
  );
}
