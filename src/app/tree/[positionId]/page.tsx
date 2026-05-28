import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPositionByPositionId } from "@/lib/airtable/positions";
import { getTechniquesByParentId } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
import { buildTrainingCountMap } from "@/types/domain";
import { TechniqueRow } from "@/components/tree/TechniqueRow";

export const revalidate = 60;

type Params = { positionId: string };

export async function generateMetadata({ params }: { params: Params }) {
  const pos = await getPositionByPositionId(params.positionId.toUpperCase());
  return {
    title: pos ? `${pos.nameKo} (${pos.id})` : "스킬트리",
  };
}

export default async function PositionDetailPage({
  params,
}: {
  params: Params;
}) {
  const positionId = params.positionId.toUpperCase();
  const position = await getPositionByPositionId(positionId);
  if (!position) notFound();

  const [techniques, sessions] = await Promise.all([
    getTechniquesByParentId(position.id),
    getAllTrainingSessions(),
  ]);

  const countMap = buildTrainingCountMap(sessions);

  return (
    <div className="space-y-6">
      <Link
        href="/tree"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        스킬트리
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-tertiary">
            {position.id}
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {position.nameKo}
        </h1>
        <p className="text-sm text-text-tertiary">{position.nameEn}</p>
        <div className="text-xs text-text-secondary mt-2">
          {techniques.length}개 기술 · {techniques.filter((t) => (countMap[t.recordId] ?? 0) > 0).length}개 수련
        </div>
      </header>

      {techniques.length === 0 ? (
        <p className="text-text-tertiary text-sm">
          이 포지션에 등록된 기술이 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {techniques.map((t) => (
            <TechniqueRow
              key={t.recordId}
              technique={t}
              trainingCount={countMap[t.recordId] ?? 0}
              positionId={position.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
