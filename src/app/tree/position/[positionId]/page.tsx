import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getTechniqueByTechId, getTechniquesByParentId } from "@/lib/airtable/techniques";
import { getMyTechniqueGoalIdSet } from "@/lib/supabase/techniqueGoals";
import { AthleteTechniqueRow } from "@/components/tree/AthleteTechniqueRow";
import { PageWrapper } from "@/components/layout/PageWrapper";

/**
 * 포지션 상세 페이지 — "스킬트리 > 포지션" 탭에서 진입.
 * 선수 상세 페이지(/tree/athlete/[athleteId])와 동일한 플랫 리스트 UI를
 * 재사용하되, 예전 레벨링(Lv.1~4)/난이도 소프트락은 부활시키지 않음
 * (2026-09-15, 선수/포지션 이원화 결정).
 */

// technique_goals는 로그인 유저별 데이터(쿠키 기반)라 force-dynamic.
export const dynamic = "force-dynamic";

type Params = { positionId: string };

const STREAM_LABEL: Record<string, string> = {
  가드포지션: "🛡 가드포지션",
  탑포지션: "⚔️ 탑포지션",
  이스케이프: "🏃 이스케이프",
  스탠딩: "🥋 스탠딩",
};

export async function generateMetadata({ params }: { params: Params }) {
  const position = await getTechniqueByTechId(params.positionId.toUpperCase());
  return { title: position ? `${position.nameKo} · 포지션` : "포지션 상세" };
}

export default async function PositionDetailPage({ params }: { params: Params }) {
  const positionId = params.positionId.toUpperCase();
  const position = await getTechniqueByTechId(positionId);
  if (!position || position.parentId !== null) notFound();

  const [children, goalIdSet] = await Promise.all([
    getTechniquesByParentId(position.id),
    getMyTechniqueGoalIdSet(),
  ]);

  const sortedChildren = [...children].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  return (
    <PageWrapper>
      <Link
        href="/tree"
        className="inline-flex items-center gap-1 text-text-tertiary text-sm mb-4 hover:text-text-secondary"
      >
        <ChevronLeft size={16} /> 포지션 목록
      </Link>

      {/* 헤더 카드 */}
      <div className="rounded-2xl p-5 mb-6 bg-bg-elevated">
        <h1 className="text-xl font-black text-text-primary">{position.nameKo}</h1>
        <p className="text-xs text-text-tertiary mt-0.5">{position.nameEn}</p>
        <div className="flex items-center gap-2 mt-3">
          {position.stream && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-bg-overlay text-text-secondary">
              {STREAM_LABEL[position.stream] ?? position.stream}
            </span>
          )}
          <span className="text-[11px] text-text-tertiary">{sortedChildren.length}개 기술</span>
        </div>
      </div>

      {/* 기술 목록 — 포지션 전체(자기 자신) + 세부 기술 */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] font-bold text-text-secondary">기술 목록</span>
      </div>
      <div className="space-y-2">
        <AthleteTechniqueRow
          key={position.recordId}
          technique={position}
          athleteRecordId={position.athleteRecordIds[0] ?? null}
          initialIsGoal={goalIdSet.has(position.recordId)}
          backContext={{ href: `/tree/position/${position.id}`, label: position.nameKo }}
        />
        {sortedChildren.map((t) => (
          <AthleteTechniqueRow
            key={t.recordId}
            technique={t}
            athleteRecordId={t.athleteRecordIds[0] ?? null}
            initialIsGoal={goalIdSet.has(t.recordId)}
            backContext={{ href: `/tree/position/${position.id}`, label: position.nameKo }}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
