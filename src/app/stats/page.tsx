import { BarChart3 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "통계" };

export default function StatsPage() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-black tracking-tight">통계 📊</h1>
          <p className="text-text-tertiary mt-1 text-sm">주간/월간 XP, 카테고리별 진척도</p>
        </header>
        <section className="rounded-2xl bg-bg-elevated border border-border-subtle p-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-secondary">준비 중</h2>
          </div>
          <p className="text-sm text-text-tertiary">
            스킬트리로 진척도를 쌓은 다음 단계에서 추가될 예정이에요.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
