import Link from "next/link";
import { ChevronRight, ArrowRight, Star, Shield, Swords, Zap, Users, ListOrdered, type LucideIcon } from "lucide-react";
import type { Stream } from "@/types/domain";
import type { GamePlanListItem } from "@/components/gamePlans/GamePlanListClient";

const STREAM_ICON: Record<Stream, LucideIcon> = {
  가드포지션: Shield,
  탑포지션:   Swords,
  이스케이프: Zap,
  스탠딩:     Users,
};

export function GamePlanCard({ item }: { item: GamePlanListItem }) {
  const { gamePlan, startPositionName, stream, previewTechs, techniqueCount, trainedCount } = item;
  const StreamIcon = stream ? STREAM_ICON[stream] : ListOrdered;
  const hasCompletion = techniqueCount > 0;
  const complete = hasCompletion && trainedCount === techniqueCount;

  return (
    <Link
      href={`/gameplans/${gamePlan.recordId}`}
      className="block py-3 active:scale-[0.98] transition-transform duration-fast"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#1A1A24" }}
        >
          <StreamIcon size={15} color="#8A8A94" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {gamePlan.isPrimary && <Star size={11} color="#D9772E" fill="#D9772E" className="shrink-0" />}
            <h3 className="text-[13.5px] font-bold text-white truncate">
              {gamePlan.planName || "이름 없음"}
            </h3>
          </div>
          <p className="text-[10.5px] font-normal mt-0.5" style={{ color: "#6B7280" }}>
            {startPositionName ? `${startPositionName} 시작` : "시작 포지션 미지정"}
            {techniqueCount > 0 && ` · ${techniqueCount}단계`}
          </p>
        </div>

        {hasCompletion && (
          <div className="text-right shrink-0">
            <div className="text-[12px] font-bold tabular-nums" style={{ color: complete ? "#D9772E" : "#fff" }}>
              {trainedCount}/{techniqueCount}
            </div>
            <div className="text-[9px] font-normal" style={{ color: "#6B7280" }}>
              {complete ? "수련중" : "미수련 포함"}
            </div>
          </div>
        )}

        <ChevronRight size={15} className="shrink-0" style={{ color: "#4A4A5A" }} />
      </div>

      {previewTechs.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 mt-2" style={{ paddingLeft: 42 }}>
          {previewTechs.map((t, i) => (
            <span key={t.recordId} className="flex items-center gap-1">
              <span
                className="text-[9.5px] font-normal rounded-md px-1.5 py-0.5"
                style={{ color: "#B4BCC8", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {t.nameKo}
              </span>
              {i < previewTechs.length - 1 && (
                <ArrowRight size={9} className="shrink-0" style={{ color: "#3A3A4A" }} />
              )}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
