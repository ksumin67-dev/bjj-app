import Link from "next/link";
import { ChevronRight, Trophy, Clock, ArrowRight, Shield, Swords, Zap, Users, type LucideIcon } from "lucide-react";
import type { Sequence, Technique, Stream } from "@/types/domain";

/** 홈 대시보드와 동일한 스트림 캡슐 컬러 체계 */
const STREAM_META: Record<Stream, { bar: string; text: string; bg: string; Icon: LucideIcon }> = {
  가드포지션: { bar: "#2E80F0", text: "#7EC8FF", bg: "#1A3050", Icon: Shield },
  탑포지션:   { bar: "#FF8C42", text: "#FFB347", bg: "#3A1F00", Icon: Swords },
  이스케이프: { bar: "#A78BFA", text: "#C4A4FF", bg: "#2A1050", Icon: Zap },
  스탠딩:     { bar: "#FBBF24", text: "#FFE066", bg: "#2A2400", Icon: Users },
};

const TAG_STYLE: Record<string, { bg: string; text: string }> = {
  공격형: { bg: "rgba(248,113,113,0.14)", text: "#FCA5A5" },
  방어형: { bg: "rgba(96,165,250,0.14)",  text: "#93C5FD" },
  가드전: { bg: "rgba(123,97,255,0.16)",  text: "#C4B5FD" },
  탑게임: { bg: "rgba(251,191,36,0.14)",  text: "#FCD34D" },
};

function formatRelative(iso: string | null): string {
  if (!iso) return "사용 전";
  const today = new Date();
  const d = new Date(iso + "T00:00:00");
  const diff = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
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
  const used    = sequence.successCount > 0 || !!sequence.lastUsed;

  return (
    <Link
      href={`/sequences/${sequence.recordId}`}
      className="block rounded-2xl p-4 active:scale-[0.98] hover:brightness-110 transition-all duration-fast group"
      style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black text-white truncate leading-snug">
            {sequence.seqName || "이름 없음"}
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
            {startPosition?.nameKo ? `${startPosition.nameKo} 시작` : "시작 포지션 미지정"}
            {techniqueCount > 0 && ` · ${techniqueCount}단계`}
          </p>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0" style={{ color: "#4A4A5A" }} />
      </div>

      {/* 기술 플로우 미리보기 */}
      {preview.length > 0 && (
        <div className="mt-3 flex items-center gap-1 flex-wrap">
          {preview.map((t, i) => {
            const meta = t.stream ? STREAM_META[t.stream as Stream] : undefined;
            const bar  = meta?.bar ?? "#4A5160";
            const text = meta?.text ?? "#8B92A0";
            return (
              <span key={t.recordId} className="flex items-center gap-1">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
                  style={{ backgroundColor: bar + "1F", color: text, border: `1px solid ${bar}33` }}
                >
                  {meta && <meta.Icon size={11} color={bar} />}
                  <span className="truncate max-w-[88px]">{t.nameKo}</span>
                </span>
                {i < preview.length - 1 && (
                  <ArrowRight size={10} className="shrink-0" style={{ color: "#3A3A4A" }} />
                )}
              </span>
            );
          })}
          {previewTechs.length > 4 && (
            <span className="text-[10px] font-semibold" style={{ color: "#6B7280" }}>
              +{previewTechs.length - 4}
            </span>
          )}
        </div>
      )}

      {/* 태그 */}
      {sequence.tags.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {sequence.tags.map((tag) => {
            const s = TAG_STYLE[tag] ?? { bg: "rgba(255,255,255,0.06)", text: "#B4BCC8" };
            return (
              <span
                key={tag}
                className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* 구분선 */}
      <div className="mt-3 mb-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* 통계 */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: used ? "#FBBF24" : "#6B7280" }}>
          <Trophy size={12} color={used ? "#FBBF24" : "#6B7280"} />
          성공 {sequence.successCount}회
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "#6B7280" }}>
          <Clock size={12} />
          {formatRelative(sequence.lastUsed)}
        </span>
      </div>
    </Link>
  );
}
