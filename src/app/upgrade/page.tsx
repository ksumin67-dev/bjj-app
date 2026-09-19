import { Lock, Check } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "프리미엄" };

const PREMIUM_FEATURES = [
  "기술별 심화 코칭 정보 (그립·핵심포인트·실전팁·흔한실수·카운터)",
  "통계 대시보드 (준비 중)",
  "무제한 게임플랜 저장",
];

export default function UpgradePage() {
  return (
    <PageWrapper>
      <div className="space-y-6 pb-20">
        <header className="text-center pt-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-subtle mb-3">
            <Lock size={22} className="text-brand-primary" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            그래플로그 프리미엄
          </h1>
          <p className="text-text-tertiary mt-1 text-sm">
            결제 기능은 현재 준비 중이에요. 곧 만나요!
          </p>
        </header>

        <section className="pt-4 border-t border-border-subtle space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            프리미엄에서 제공될 기능
          </h2>
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-text-primary">
                <Check size={16} className="text-brand-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-4 border-t border-border-subtle">
          <h2 className="text-sm font-semibold text-text-secondary mb-3">예정 가격</h2>
          <div className="grid grid-cols-2">
            <div className="text-center py-1 border-r border-border-subtle">
              <p className="text-xs text-text-tertiary mb-1">월간</p>
              <p className="text-lg font-black">6,900원</p>
            </div>
            <div className="text-center py-1">
              <p className="text-xs text-text-tertiary mb-1">연간 (41% 할인)</p>
              <p className="text-lg font-black">49,000원</p>
            </div>
          </div>
          <p className="text-xs text-text-tertiary mt-3 text-center">
            7일 무료 체험 제공 예정
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
