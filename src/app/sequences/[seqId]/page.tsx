import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { notFound } from "next/navigation";
import {
  ChevronLeft, GitBranch, ArrowRight, Star,
  Shield, Swords, Zap, Users, type LucideIcon,
} from "lucide-react";
import { getSequenceById } from "@/lib/supabase/sequences";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { buildTrainingCountMap } from "@/types/domain";
import { SequenceActions } from "@/components/sequences/SequenceActions";
import type { Technique, Stream } from "@/types/domain";

export const dynamic = "force-dynamic";

type Params = { seqId: string };

const STREAM_ICON: Record<Stream, LucideIcon> = {
  가드포지션: Shield,
  탑포지션:   Swords,
  이스케이프: Zap,
  스탠딩:     Users,
};

function TechFlowRow({ tech, index, trained }: { tech: Technique; index: number; trained: boolean }) {
  const StreamIcon = tech.stream ? STREAM_ICON[tech.stream as Stream] : undefined;
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span
        className="size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 tabular-nums"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#B4BCC8" }}
      >
        {index + 1}
      </span>

      {StreamIcon && (
        <span
          className="size-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <StreamIcon size={16} color="#8A8A94" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] shrink-0" style={{ color: "#6B7280" }}>{tech.id}</span>
          <span className="font-bold text-sm truncate text-white">{tech.nameKo}</span>
        </div>
        <div className="text-[11px] font-normal mt-0.5" style={{ color: "#6B7280" }}>
          {tech.type}{tech.xpValue != null && ` · ${tech.xpValue} XP`}
        </div>
      </div>

      <span
        className="text-[9.5px] font-semibold px-2 py-1 rounded-full shrink-0"
        style={
          trained
            ? { backgroundColor: "rgba(217,119,46,0.15)", color: "#D9772E" }
            : { backgroundColor: "rgba(255,255,255,0.06)", color: "#6B7280" }
        }
      >
        {trained ? "수련중" : "미수련"}
      </span>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const seq = await getSequenceById(params.seqId);
  return { title: seq?.seqName ?? "시퀀스" };
}

export default async function SequenceDetailPage({ params }: { params: Params }) {
  const [sequence, positions, techniques, sessions] = await Promise.all([
    getSequenceById(params.seqId),
    getAllPositions(),
    getAllTechniques(),
    getAllTrainingSessions(),
  ]);

  if (!sequence) notFound();

  const trainingCountMap = buildTrainingCountMap(sessions);

  const startPos = sequence.startPositionRecordId
    ? positions.find((p) => p.recordId === sequence.startPositionRecordId)
    : undefined;

  const techMap = new Map(techniques.map((t) => [t.recordId, t]));
  const usedTechs = sequence.techniquesUsedRecordIds
    .map((id) => techMap.get(id))
    .filter((t): t is Technique => Boolean(t));

  const totalXp = usedTechs.reduce((sum, t) => sum + (t.xpValue ?? 0), 0) + 200;
  const trainedCount = usedTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0).length;

  return (
    <PageWrapper>
      <div className="space-y-5 max-w-2xl">

        <Link
          href="/sequences"
          className="inline-flex items-center gap-1 text-sm font-normal"
          style={{ color: "#8A8A94" }}
        >
          <ChevronLeft size={16} />
          나의 시퀀스
        </Link>

        <header>
          <div className="flex items-center gap-1.5">
            {sequence.isPrimary && <Star size={16} color="#D9772E" fill="#D9772E" />}
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {sequence.seqName}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {startPos && (
              <span className="text-[11px] font-normal" style={{ color: "#B4BCC8" }}>{startPos.nameKo} 시작</span>
            )}
            {startPos && <span style={{ color: "#3A3A4A" }}>·</span>}
            <span className="text-[11px] font-bold" style={{ color: "#D9772E" }}>+{totalXp} XP</span>
            {usedTechs.length > 0 && (
              <>
                <span style={{ color: "#3A3A4A" }}>·</span>
                <span className="text-[11px] font-normal" style={{ color: "#B4BCC8" }}>
                  {trainedCount}/{usedTechs.length} 수련중
                </span>
              </>
            )}
          </div>
        </header>

        {usedTechs.length > 0 && (
          <section>
            <h2 className="text-[13.5px] font-bold text-white mb-3">
              기술 플로우 · {usedTechs.length}단계
            </h2>
            <div className="space-y-1">
              {usedTechs.map((t, idx) => (
                <div key={t.recordId}>
                  <TechFlowRow tech={t} index={idx} trained={(trainingCountMap[t.recordId] ?? 0) > 0} />
                  {idx < usedTechs.length - 1 && (
                    <div className="flex items-center justify-center py-0.5">
                      <ArrowRight size={14} className="rotate-90" style={{ color: "#3A3A4A" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {sequence.stepsText && (
          <section>
            <h2 className="text-[13.5px] font-bold text-white mb-2">단계 메모</h2>
            <p className="text-sm font-normal whitespace-pre-wrap" style={{ color: "#B4BCC8" }}>{sequence.stepsText}</p>
          </section>
        )}

        {sequence.hasBranch && sequence.branchCondition && (
          <section className="rounded-2xl p-4" style={{ backgroundColor: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.28)" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#FBBF24" }}>
              <GitBranch size={16} />
              <p className="text-[10px] uppercase tracking-widest font-semibold">분기 조건</p>
            </div>
            <p className="text-sm font-normal" style={{ color: "#F5F7FA" }}>{sequence.branchCondition}</p>
          </section>
        )}

        <SequenceActions recordId={sequence.recordId} seqName={sequence.seqName} isPrimary={sequence.isPrimary} />
      </div>
    </PageWrapper>
  );
}
