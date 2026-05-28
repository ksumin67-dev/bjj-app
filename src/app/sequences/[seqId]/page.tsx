import Link from "next/link";
import { StreamChip } from "@/components/tree/StreamChip";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Trophy,
  Clock,
  Trash2,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { getSequenceById } from "@/lib/airtable/sequences";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { SequenceActions } from "@/components/sequences/SequenceActions";
import type { Technique } from "@/types/domain";

export const dynamic = "force-dynamic";

type Params = { seqId: string };

const STREAM_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  가드포지션: { bg: "#2E80F020", text: "#2E80F0", border: "#2E80F040" },
  탑포지션:   { bg: "#FF8C4220", text: "#FF8C42", border: "#FF8C4240" },
  이스케이프: { bg: "#A78BFA20", text: "#A78BFA", border: "#A78BFA40" },
  스탠딩:     { bg: "#FBBF2420", text: "#FBBF24", border: "#FBBF2440" },
};

const STREAM_LABEL: Record<string, string> = {
  가드포지션: "🛡 가드",
  탑포지션:   "⚔️ 탑",
  이스케이프: "🏃 이스케이프",
  스탠딩:     "🥋 스탠딩",
};

function TechFlowChip({ tech, index }: { tech: Technique; index: number }) {
  const style = tech.stream ? STREAM_COLOR[tech.stream] : undefined;
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      style={style ? { backgroundColor: style.bg, border: `1px solid ${style.border}` } : {
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <span
        className="size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={style ? { backgroundColor: style.text + "30", color: style.text } : {
          backgroundColor: "var(--bg-base)",
          color: "var(--text-tertiary)",
        }}
      >
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-text-tertiary">{tech.id}</span>
          <span
            className="font-semibold text-sm"
            style={style ? { color: style.text } : {}}
          >
            {tech.nameKo}
          </span>
          {tech.stream && (
            <StreamChip stream={tech.stream} size="xs" />
          )}
        </div>
        <div className="text-xs text-text-tertiary mt-0.5">
          {tech.type} · {tech.xpValue} XP
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const seq = await getSequenceById(params.seqId);
  return { title: seq?.seqName ?? "시퀀스" };
}

export default async function SequenceDetailPage({
  params,
}: {
  params: Params;
}) {
  const [sequence, positions, techniques] = await Promise.all([
    getSequenceById(params.seqId),
    getAllPositions(),
    getAllTechniques(),
  ]);

  if (!sequence) notFound();

  const startPos = sequence.startPositionRecordId
    ? positions.find((p) => p.recordId === sequence.startPositionRecordId)
    : undefined;

  const techMap = new Map(techniques.map((t) => [t.recordId, t]));
  const usedTechs = sequence.techniquesUsedRecordIds
    .map((id) => techMap.get(id))
    .filter((t): t is Technique => Boolean(t));

  // XP 합산
  const totalXp = usedTechs.reduce((sum, t) => sum + (t.xpValue ?? 0), 0) + 200;

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/sequences"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        시퀀스 목록
      </Link>

      {/* 헤더 */}
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {sequence.seqName}
        </h1>
        <div className="flex items-center gap-2 flex-wrap text-xs text-text-tertiary">
          {startPos && (
            <span className="text-text-secondary">{startPos.nameKo} 시작</span>
          )}
          {sequence.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{sequence.tags.join(" / ")}</span>
            </>
          )}
          <span>·</span>
          <span className="text-brand-primary font-medium">+{totalXp} XP</span>
        </div>
      </header>

      {/* 통계 */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4">
          <div className="flex items-center gap-1.5 text-text-tertiary text-xs mb-1">
            <Trophy size={12} />
            성공
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {sequence.successCount}
            <span className="text-sm font-normal text-text-tertiary ml-1">
              회
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4">
          <div className="flex items-center gap-1.5 text-text-tertiary text-xs mb-1">
            <Clock size={12} />
            마지막 사용
          </div>
          <div className="text-sm font-medium mt-2">
            {sequence.lastUsed ?? "사용 전"}
          </div>
        </div>
      </section>

      {/* 기술 플로우 */}
      {usedTechs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-text-secondary mb-3">
            기술 플로우 ({usedTechs.length}단계)
          </h2>
          <div className="space-y-1.5">
            {usedTechs.map((t, idx) => (
              <div key={t.recordId}>
                <TechFlowChip tech={t} index={idx} />
                {idx < usedTechs.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <ArrowRight size={14} className="text-text-disabled rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 단계 메모 */}
      {sequence.stepsText && (
        <section className="rounded-2xl border border-border-subtle bg-bg-elevated p-4">
          <h2 className="text-sm font-semibold text-text-secondary mb-2">
            단계 메모
          </h2>
          <p className="text-sm whitespace-pre-wrap">{sequence.stepsText}</p>
        </section>
      )}

      {/* 분기 */}
      {sequence.hasBranch && sequence.branchCondition && (
        <section className="rounded-2xl border border-border-subtle bg-warning/5 border-warning/30 p-4">
          <div className="flex items-center gap-2 mb-2 text-warning">
            <GitBranch size={16} />
            <h2 className="text-sm font-semibold">분기 조건</h2>
          </div>
          <p className="text-sm">{sequence.branchCondition}</p>
        </section>
      )}

      {/* 액션 */}
      <SequenceActions
        recordId={sequence.recordId}
        seqName={sequence.seqName}
      />
    </div>
    </PageWrapper>
  );
}
