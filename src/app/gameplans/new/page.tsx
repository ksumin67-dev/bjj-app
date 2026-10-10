import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getGamePlanFormData } from "@/lib/gamePlanFormData";
import { GamePlanForm } from "@/components/gamePlans/GamePlanForm";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "새 게임플랜" };
export const dynamic = "force-dynamic";

export default async function NewGamePlanPage({
  searchParams,
}: {
  searchParams: { rec?: string };
}) {
  const rec = searchParams.rec;
  const { stepTechniques, positionNameById, goalTechniqueIds, recentTechniqueIds, recommendations } =
    await getGamePlanFormData({ withRecommendations: Boolean(rec) });
  const prefill = rec ? recommendations.plans.find((p) => p.id === rec) : undefined;

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-2xl">
        <Link
          href="/gameplans"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          나의 게임플랜
        </Link>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">새 게임플랜</h1>
          <p className="mt-1 text-sm font-normal" style={{ color: "#8A8A94" }}>
            기술 조합과 분기 흐름을 정리해보세요.
          </p>
        </header>

        <GamePlanForm
          key={prefill?.id ?? "blank"}
          mode="create"
          techniques={stepTechniques}
          positionNameById={positionNameById}
          goalTechniqueIds={goalTechniqueIds}
          recentTechniqueIds={recentTechniqueIds}
          prefill={prefill}
        />
      </div>
    </PageWrapper>
  );
}
