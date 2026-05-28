import Link from "next/link";
import { ChevronRight, Trophy, Clock, ArrowRight } from "lucide-react";
import type { Sequence, Technique } from "@/types/domain";
import { cn } from "@/lib/utils";

const TAG_STYLE: Record<string, string> = {
  공격형: "bg-danger/15 text-danger",
  방어형: "bg-info/15 text-info",
  가드전: "bg-belt-purple/20 text-belt-purple",
  탑게임: "bg-warning/15 text-warning",
};

const STREAM_DOT: Record<string, string> = {
  가드포지션: "#2E80F0",
  탑포지션:   "#FF8C42",
  이스케이프: "#A78BFA",
  스탠딩:     "#FBBF24",
};

function formatRelative(iso: string | null): string {
  if (!iso) return "사용 전";
  const today = new Date();
  const d = new Date(iso + "T00:00:00");
  const diff = Math.round(
    (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff <= 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff < 7) return `${diff}일 전`;
  if (diff < 30) return `${Math.round(diff / 7)}주 전`;
  return `${Math.round(diff / 30)}달 전`;
}

export function SequenceCard({
  sequence,
  startPosition,
  techniqueCount,
  previewTechs = [],
}: {
  sequence: Sequence;
  startPosition?: Technique;
  techniqueCount: number;
  previewTechs?: Technique[];
}) {
  const preview = previewTechs.slice(0, 4);

  return (
    <Link
      href={`/sequences/${sequence.recordId}`}
      className="block rounded-2xl bg-bg-elevated border border-border-subtle p-4 hover:bg-bg-hover hover:border-border-default transition-all duration-base ease-out-soft group"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold truncate">
            {sequence.seqName || "이름 없음"}
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            {startPosition?.nameKo
              ? `${startPosition.nameKo} 시작`
              : "시작 포지션 미지정"}
            {techniqueCount > 0 && ` · ${techniqueCount}단계`}
          </p>
        </div>
        <ChevronRight
          size={16}
          className="text-text-tertiary mt-1 shrink-0 group-hover:text-text-secondary"
        />
      </div>

      {/* 기술 플로우 미리보기 */}
      {preview.length > 0 && (
        <div className="mt-3 flex items-center gap-1 flex-wrap">
          {preview.map((t, i) => {
            const dot = t.stream ? STREAM_DOT[t.stream] : "#4A5160";
            return (
              <span key={t.recordId} className="flex items-center gap-1">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: dot + "20", color: dot, border: `1px solid ${dot}40` }}
                >
                  <span className="font-mono opacity-70">{t.id}</span>
                  <span>{t.nameKo}</span>
                </span>
                {i < preview.length - 1 && (
                  <ArrowRight size={10} className="text-text-disabled shrink-0" />
                )}
              </span>
            );
          })}
          {previewTechs.length > 4 && (
            <span className="text-[10px] text-text-tertiary">+{previewTechs.length - 4}개</span>
          )}
        </div>
      )}

      {/* 태그 */}
      {sequence.tags.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {sequence.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center h-5 px-1.5 rounded-full text-[10px] font-medium",
                TAG_STYLE[tag] ?? "bg-bg-base text-text-secondary",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 통계 */}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-text-tertiary">
        <span className="inline-flex items-center gap-1">
          <Trophy size={12} />
          성공 {sequence.successCount}회
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} />
          {formatRelative(sequence.lastUsed)}
        </span>
      </div>
    </Link>
  );
}
