import { notFound } from "next/navigation";
import { getPositionByPositionId } from "@/lib/airtable/positions";
import { getTechniquesByParentId } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { buildTrainingCountMap, computePositionLevel, beltIndex } from "@/types/domain";
import type { Stream } from "@/types/domain";
import PositionDetailClient from "@/components/tree/PositionDetailClient";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const revalidate = 60;

type Params = { positionId: string };

const STREAM_COLOR: Record<Stream, string> = {
  가드포지션: "#2E80F0",
  탑포지션:   "#FF8C42",
  이스케이프: "#A78BFA",
  스탠딩:     "#FBBF24",
};

export async function generateMetadata({ params }: { params: Params }) {
  const pos = await getPositionByPositionId(params.positionId.toUpperCase());
  return { title: pos ? `${pos.nameKo} (${pos.id})` : "스킬트리" };
}

export default async function PositionDetailPage({ params }: { params: Params }) {
  const positionId = params.positionId.toUpperCase();
  const position = await getPositionByPositionId(positionId);
  if (!position) notFound();

  const [techniques, sessions, profile] = await Promise.all([
    getTechniquesByParentId(position.id),
    getAllTrainingSessions(),
    getUserProfile(),
  ]);

  const countMap = buildTrainingCountMap(sessions);
  const level = computePositionLevel(techniques, countMap);
  const hideHints = beltIndex(profile.belt) >= 1; // 블루벨트 이상
  const streamColor = position.stream ? STREAM_COLOR[position.stream] : "#2E80F0";

  return (
    <PageWrapper>
      <PositionDetailClient
        position={{ id: position.id, nameKo: position.nameKo, nameEn: position.nameEn }}
        techniques={techniques}
        countMap={countMap}
        level={level}
        hideHints={hideHints}
        streamColor={streamColor}
      />
    </PageWrapper>
  );
}
