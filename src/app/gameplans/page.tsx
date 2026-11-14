import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllGamePlans } from "@/lib/supabase/gamePlans";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { buildTrainingCountMap } from "@/types/domain";
import type { Technique } from "@/types/domain";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AiRecommendSection } from "@/components/gamePlans/AiRecommendSection";
import { GamePlanListClient, type GamePlanListItem } from "@/components/gamePlans/GamePlanListClient";

export const metadata = { title: "나의 게임플랜" };
// 로그인 유저의 게임플랜/수련 기록(쿠키)을 읽는다. revalidate와 함께 두면
// Next.js 15가 정적 생성을 시도했다가 cookies()에서 실패하므로 force-dynamic.
// 기술 카탈로그는 getAllTechniques의 Data Cache를 사용한다.
export const dynamic = "force-dynamic";

export default async function GamePlansPage() {
  const [gamePlans, positions, techniques, sessions] = await Promise.all([
    getAllGamePlans(),
    getAllPositions(),
    getAllTechniques(),
    getAllTrainingSessions(),
  ]);

  const positionsByRecordId = new Map<string, Technique>();
  for (const p of positions) positionsByRecordId.set(p.recordId, p);

  const techMap = new Map<string, Technique>();
  for (const t of techniques) techMap.set(t.recordId, t);

  const trainingCountMap = buildTrainingCountMap(sessions);

  const items: GamePlanListItem[] = gamePlans.map((plan) => {
    const startPosition = plan.startPositionRecordId
      ? positionsByRecordId.get(plan.startPositionRecordId)
      : undefined;
    const usedTechs = plan.techniquesUsedRecordIds
      .map((id) => techMap.get(id))
      .filter((t): t is Technique => Boolean(t));
    const trainedCount = usedTechs.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0).length;

    return {
      gamePlan: plan,
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
            href="/gameplans/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white text-sm font-bold shrink-0 hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
            style={{ backgroundColor: "#D9772E" }}
          >
            <Plus size={16} strokeWidth={2.5} />
            새 게임플랜
          </Link>
        </header>

        {items.length === 0 ? (
          <AiRecommendSection />
        ) : (
          <>
            <GamePlanListClient items={items} />
            <AiRecommendSection hasPlans />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
