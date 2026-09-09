import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { notFound } from "next/navigation";
import {
  ChevronLeft, Trophy, Clock, GitBranch, ArrowRight,
  Shield, Swords, Zap, Users, type LucideIcon,
} from "lucide-react";
import { getSequenceById } from "@/lib/supabase/sequences";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { SequenceActions } from "@/components/sequences/SequenceActions";
import type { Technique, Stream } from "@/types/domain";

export const dynamic = "force-dynamic";

type Params = { seqId: string };

const STREAM_META: Record<Stream, { bar: string; text: string; label: string; Icon: LucideIcon }> = {
  가드포지션: { bar: "#2E80F0", text: "#7EC8FF", label: "가드",     Icon: Shield },
  탑포지션:   { bar: "#FF8C42", text: "#FFB347", label: "탑",       Icon: Swords },
  이스케이프: { bar: "#A78BFA", text: "#C4A4FF", label: "이스케이프", Icon: Zap },
  스탠딩:     { bar: "#FBBF24", text: "#FFE066", label: "스탠딩",     Icon: Users },
};

const TAG_STYLE: Record<string, { bg: string; text: string }> = {
  공격형: { bg: "rgba(248,113,113,0.14)", text: "#FCA5A5" },
  방어형: { bg: "rgba(96,165,250,0.14)",  text: "#93C5FD" },
  가드전: { bg: "rgba(123,97,255,0.16)",  text: "#C4B5FD" },
  탑게임: { bg: "rgba(251,191,36,0.14)",  text: "#FCD34D" },
};

function TechFlowRow({ tech, index }: { tech: Technique; index: number }) {
  const meta = tech.stream ? STREAM_META[tech.stream as Stream] : undefined;
  const bar  = meta?.bar ?? "#4A5160";
  const text = meta?.text ?? "#B4BCC8";
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ backgroundColor: bar + "14", border: `1px solid ${bar}2E` }}
    >
      {/* 순서 번호 */}
      <span
        className="size-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 tabular-nums"
        style={{ backgroundColor: bar + "33", color: text }}
      >
        {index + 1}
      </span>

      {/* 스트림 아이콘 */}
      {meta && (
        <span
          className="size-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: bar + "22" }}
        >
          <meta.Icon size={16} color={bar} />
        </span>
      )}

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] shrink-0" style={{ color: "#6B7280" }}>{tech.id}</span>
          <span className="font-bold text-sm truncate" style={{ color: text }}>{tech.nameKo}</span>
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
          {tech.type}{tech.xpValue != null && ` · ${tech.xpValue} XP`}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const seq = await getSequenceById(params.seqId);
  return { title: seq?.seqName ?? "시퀀스" };
}

export default async function SequenceDetailPage({ params }: { params: Params }) {
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

  const totalXp = usedTechs.reduce((sum, t) => sum + (t.xpValue ?? 0), 0) + 200;

  return (
    <PageWrapper>
      <div className="space-y-5 max-w-2xl">

        {/* 뒤로 */}
        <Link
          href="/sequences"
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: "#B4BCC8" }}
        >
          <ChevronLeft size={16} />
          시퀀스 목록
        </Link>

        {/* 헤더 */}
        <header>
          <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
            {sequence.seqName}
          </h1>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {startPos && (
              <span className="text-[11px]" style={{ color: "#B4BCC8" }}>{startPos.nameKo} 시작</span>
            )}
            {startPos && <span style={{ color: "#3A3A4A" }}>·</span>}
            <span className="text-[11px] font-bold" style={{ color: "#A78BFA" }}>+{totalXp} XP</span>
          </div>
          {sequence.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              {sequence.tags.map((tag) => {
                const s = TAG_STYLE[tag] ?? { bg: "rgba(255,255,255,0.06)", text: "#B4BCC8" };
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center h-6 px-2.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
        </header>

        {/* 통계 */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
              <Trophy size={12} color="#FBBF24" />
              성공
            </div>
            <div className="text-2xl font-black tabular-nums text-white">
              {sequence.successCount}
              <span className="text-sm font-medium ml-1" style={{ color: "#6B7280" }}>회</span>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6B7280" }}>
              <Clock size={12} color="#A78BFA" />
              마지막 사용
            </div>
            <div className="text-sm font-bold mt-2 text-white">
              {sequence.lastUsed ?? "사용 전"}
            </div>
          </div>
        </section>

        {/* 기술 플로우 */}
        {usedTechs.length > 0 && (
          <section>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "#6B7280" }}>
              기술 플로우 · {usedTechs.length}단계
            </p>
            <div className="space-y-1">
              {usedTechs.map((t, idx) => (
                <div key={t.recordId}>
                  <TechFlowRow tech={t} index={idx} />
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

        {/* 단계 메모 */}
        {sequence.stepsText && (
          <section className="rounded-2xl p-4" style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#6B7280" }}>
              단계 메모
            </p>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#B4BCC8" }}>{sequence.stepsText}</p>
          </section>
        )}

        {/* 분기 */}
        {sequence.hasBranch && sequence.branchCondition && (
          <section className="rounded-2xl p-4" style={{ backgroundColor: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.28)" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#FBBF24" }}>
              <GitBranch size={16} />
              <p className="text-[10px] uppercase tracking-widest font-semibold">분기 조건</p>
            </div>
            <p className="text-sm" style={{ color: "#F5F7FA" }}>{sequence.branchCondition}</p>
          </section>
        )}

        {/* 액션 */}
        <SequenceActions recordId={sequence.recordId} seqName={sequence.seqName} />
      </div>
    </PageWrapper>
  );
}
