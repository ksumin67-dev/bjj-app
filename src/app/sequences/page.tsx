import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllSequences } from "@/lib/supabase/sequences";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { buildTrainingCountMap } from "@/types/domain";
import type { Technique } from "@/types/domain";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SequenceListClient, type SequenceListItem } from "@/components/sequences/SequenceListClient";

export const metadata = { title: "나의 게임플랜" };
export const revalidate = 30;

export default async function SequencesPage() {
  const [sequences, positions, techniques, sessions] = await Promise.all([
    getAllSequences(),
    getAllPositions(),
    getAllTechniques(),
    getAllTrainingSessions(),
  ]);

  const positionsByRecordId = new Map<string, Technique>();
  for (const p of positions) positionsByRecordId.set(p.recordId, p);

  const techMap = new Map<string, Technique>();
  for (const t of techniques) techMap.set(t.recordId, t);

  const trainingCountMap = buildTrainingCountMap(sessions);

  const items: SequenceListItem[] = sequences.map((seq) => {
    const startPosition = seq.startPositionRecordId
      ? positionsByRecordId.get(seq.startPositionRecordId)
      : undefined;
    const usedTechs = seq.techniquesUsedRecordIds
      .map((id) => techMap.get(id))
      .filter((t): t is Technique => Boolean(t));
    const trainedCount = usedTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0).length;

    return {
      sequence: seq,
      startPositionName: startPosition?.nameKo,
      stream: startPosition?.stream ?? null,
      previewTechs: usedTechs.slice(0, 4).map((t) => ({ recordId: t.recordId, nameKo: t.nameKo })),
      techniqueCount: usedTechs.length,
      trainedCount,
    };
  });

  return (
    <PageWrapper>
      <div className="space-y-5">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">나의 게임플랜</h1>
            <p className="mt-1 text-sm font-normal" style={{ color: "#8A8A94" }}>
              내가 정리한 기술 조합 도감
            </p>
          </div>
          <Link
            href="/sequences/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white text-sm font-bold shrink-0 hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
            style={{ backgroundColor: "#D9772E" }}
          >
            <Plus size={16} strokeWidth={2.5} />
            새 게임플랜
          </Link>
        </header>

        <SequenceListClient items={items} />
      </div>
    </PageWrapper>
  );
}
