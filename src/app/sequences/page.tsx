import Link from "next/link";
import { Plus, ListOrdered, Layers, Trophy, Flame } from "lucide-react";
import { getAllSequences } from "@/lib/supabase/sequences";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { SequenceCard } from "@/components/sequences/SequenceCard";
import type { Technique } from "@/types/domain";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "시퀀스" };
export const revalidate = 30;

export default async function SequencesPage() {
  const [sequences, positions, techniques] = await Promise.all([
    getAllSequences(),
    getAllPositions(),
    getAllTechniques(),
  ]);

  const positionsByRecordId = new Map<string, Technique>();
  for (const p of positions) positionsByRecordId.set(p.recordId, p);

  const techMap = new Map<string, Technique>();
  for (const t of techniques) techMap.set(t.recordId, t);

  // ── 상단 통계 요약 계산
  const totalSeq      = sequences.length;
  const totalSuccess  = sequences.reduce((sum, s) => sum + (s.successCount ?? 0), 0);
  const topSeq        = sequences.reduce<typeof sequences[number] | null>(
    (best, s) => (!best || s.successCount > best.successCount ? s : best),
    null,
  );

  return (
    <PageWrapper>
      <div className="space-y-5">

        {/* ── 헤더 ── */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-white">시퀀스</h1>
            <p className="mt-1 text-sm" style={{ color: "#B4BCC8" }}>
              나만의 기술 조합과 분기 흐름.
            </p>
          </div>
          <Link
            href="/sequences/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white text-sm font-bold shrink-0 hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
            style={{
              background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)",
              boxShadow: "0 4px 16px rgba(123,97,255,0.30)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            새 시퀀스
          </Link>
        </header>

        {/* ── 상단 통계 요약 ── */}
        {totalSeq > 0 && (
          <section
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "#6B7280" }}>
              My Sequences
            </p>
            <div className="grid grid-cols-3 gap-2">
              <StatChip icon={<Layers size={15} color="#A78BFA" />} value={String(totalSeq)}     label="등록 시퀀스" />
              <StatChip icon={<Trophy size={15} color="#FBBF24" />} value={String(totalSuccess)} label="총 성공" />
              <StatChip
                icon={<Flame size={15} color="#FF8C42" />}
                value={topSeq && topSeq.successCount > 0 ? `${topSeq.successCount}` : "—"}
                label={topSeq && topSeq.successCount > 0 ? trimName(topSeq.seqName) : "최다 성공"}
              />
            </div>
          </section>
        )}

        {/* ── 카드 그리드 ── */}
        {totalSeq === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sequences.map((seq) => {
              const startPos = seq.startPositionRecordId
                ? positionsByRecordId.get(seq.startPositionRecordId)
                : undefined;
              const previewTechs = seq.techniquesUsedRecordIds
                .map((id) => techMap.get(id))
                .filter((t): t is Technique => Boolean(t));
              return (
                <SequenceCard
                  key={seq.recordId}
                  sequence={seq}
                  startPosition={startPos}
                  techniqueCount={seq.techniquesUsedRecordIds.length}
                  previewTechs={previewTechs}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function trimName(name: string): string {
  if (!name) return "최다 성공";
  return name.length > 7 ? name.slice(0, 6) + "…" : name;
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div
      className="rounded-xl px-2 py-3 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
    >
      <div className="mb-1.5">{icon}</div>
      <p className="text-lg font-black tabular-nums leading-none text-white">{value}</p>
      <p className="text-[9px] mt-1 truncate max-w-full" style={{ color: "#6B7280" }}>{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ backgroundColor: "#1A1A24", border: "1px dashed rgba(255,255,255,0.12)" }}
    >
      <div
        className="size-12 mx-auto rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: "rgba(123,97,255,0.15)" }}
      >
        <ListOrdered size={20} color="#A78BFA" />
      </div>
      <h3 className="text-base font-black text-white mb-1">아직 시퀀스가 없습니다</h3>
      <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
        스파링에서 시도하고 싶은 기술 조합을 정리해보세요.
        <br />
        예) &quot;클가 → 시저 스윕 → 마운트 → 암바&quot;
      </p>
      <Link
        href="/sequences/new"
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white text-sm font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
        style={{ background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)" }}
      >
        <Plus size={16} strokeWidth={2.5} />첫 시퀀스 만들기
      </Link>
    </div>
  );
}
