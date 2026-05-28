import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllPositions } from "@/lib/airtable/positions";
import { getAllCustomTechniques } from "@/lib/airtable/customTechniques";
import { TechniqueManager } from "@/components/admin/TechniqueManager";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "기술 관리" };
export const revalidate = 0;

export default async function AdminTechniquesPage() {
  const [techniques, positions, customTechniques] = await Promise.all([
    getAllTechniques(),
    getAllPositions(),
    getAllCustomTechniques(),
  ]);

  const sorted = [...techniques].sort((a, b) => a.id.localeCompare(b.id));
  const sortedPositions = [...positions].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  return (
    <PageWrapper>
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">기술 관리</h1>
        <p className="text-text-secondary mt-1 text-sm">
          총 {techniques.length}개 기술 · {positions.length}개 포지션
          {customTechniques.length > 0 && ` · 미등록 ${customTechniques.length}개`}
        </p>
      </header>
      <TechniqueManager
        techniques={sorted}
        positions={sortedPositions}
        customTechniques={customTechniques}
      />
    </div>
    </PageWrapper>
  );
}
