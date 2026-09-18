import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { SequenceForm } from "@/components/sequences/SequenceForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { Technique } from "@/types/domain";

export const metadata = { title: "새 시퀀스" };
export const dynamic = "force-dynamic";

export default async function NewSequencePage() {
  const [positions, techniques] = await Promise.all([
    getAllPositions(),
    getAllTechniques(),
  ]);

  const positionsById: Record<string, Technique> = {};
  for (const p of positions) positionsById[p.recordId] = p;

  // 포지션(부모) 레코드는 시퀀스 단계로 직접 선택하지 않음 — 구체적 자식 기술만 선택 대상
  const stepTechniques = techniques.filter((t) => t.id.includes("-"));

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-2xl">
        <Link
          href="/sequences"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          나의 시퀀스
        </Link>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">새 시퀀스</h1>
          <p className="mt-1 text-sm font-normal" style={{ color: "#8A8A94" }}>
            기술 조합과 분기 흐름을 정리해보세요.
          </p>
        </header>

        <SequenceForm
          positions={positions}
          techniques={stepTechniques}
          positionsById={positionsById}
        />
      </div>
    </PageWrapper>
  );
}
