import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getGamePlanById } from "@/lib/supabase/gamePlans";
import { getGamePlanFormData } from "@/lib/gamePlanFormData";
import { GamePlanForm } from "@/components/gamePlans/GamePlanForm";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "게임플랜 수정" };
export const dynamic = "force-dynamic";

export default async function EditGamePlanPage({ params }: { params: { planId: string } }) {
  const [gamePlan, formData] = await Promise.all([
    getGamePlanById(params.planId),
    getGamePlanFormData(),
  ]);

  if (!gamePlan) notFound();

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-2xl">
        <Link
          href={`/gameplans/${gamePlan.recordId}`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          {gamePlan.planName}
        </Link>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">게임플랜 수정</h1>
          <p className="mt-1 text-sm font-normal" style={{ color: "#8A8A94" }}>
            이름, 기술 순서, 설명을 자유롭게 고칠 수 있어요.
          </p>
        </header>

        <GamePlanForm
          mode="edit"
          initial={gamePlan}
          techniques={formData.stepTechniques}
          positionNameById={formData.positionNameById}
          goalTechniqueIds={formData.goalTechniqueIds}
          recentTechniqueIds={formData.recentTechniqueIds}
        />
      </div>
    </PageWrapper>
  );
}
