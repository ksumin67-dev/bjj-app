import Link from "next/link";
import { Plus, ListOrdered } from "lucide-react";
import { getAllSequences } from "@/lib/airtable/sequences";
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

  return (
    <PageWrapper>
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            시퀀스
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            본인 만의 기술 조합과 분기 흐름. {sequences.length}개 등록
          </p>
        </div>
        <Link
          href="/sequences/new"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-primary text-text-inverse text-sm font-semibold hover:bg-brand-hover transition-colors duration-fast shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          새 시퀀스
        </Link>
      </header>

      {sequences.length === 0 ? (
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

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border-default p-8 text-center">
      <div className="size-12 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-3">
        <ListOrdered size={20} className="text-text-tertiary" />
      </div>
      <h3 className="text-base font-semibold mb-1">아직 시퀀스가 없습니다</h3>
      <p className="text-sm text-text-tertiary mb-4">
        스파링에서 시도하고 싶은 기술 조합을 정리해보세요.
        <br />
        예) "클가 → 시저 스윕 → 마운트 → 암바"
      </p>
      <Link
        href="/sequences/new"
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-primary text-text-inverse text-sm font-semibold hover:bg-brand-hover transition-colors duration-fast"
      >
        <Plus size={16} strokeWidth={2.5} />첫 시퀀스 만들기
      </Link>
    </div>
  );
}
