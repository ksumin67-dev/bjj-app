import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Shield, Swords, Zap, Users, type LucideIcon } from "lucide-react";
import { getTechniqueByTechId, getTechniquesByParentId } from "@/lib/airtable/techniques";
import { getMyTechniqueGoalIdSet } from "@/lib/supabase/techniqueGoals";
import { AthleteTechniqueRow } from "@/components/tree/AthleteTechniqueRow";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { POSITION_ICON, POSITION_ICON_FALLBACK } from "@/lib/positionIcons";

/**
 * 포지션 상세 페이지 — "스킬트리 > 포지션" 탭에서 진입.
 * 선수 상세 페이지(/tree/athlete/[athleteId])와 동일한 플랫 리스트 UI를
 * 재사용하되, 예전 레벨링(Lv.1~4)/난이도 소프트락은 부활시키지 않음
 * (2026-09-15, 선수/포지션 이원화 결정).
 *
 * (2026-09-19) 헤더를 박스 카드에서 플랫 레이아웃으로 리뉴얼: 포지션
 * 아이콘 원형 + 제목/영문명, 스트림 아웃라인 칩 + 기술 개수를 한 줄에
 * (기술 개수는 히어로 스탯이 아니라 보조 정보라 강조하지 않음).
 */

// technique_goals는 로그인 유저별 데이터(쿠키 기반)라 force-dynamic.
export const dynamic = "force-dynamic";

type Params = { positionId: string };

// 기술도감 포지션 탭(SkillTreeBrowser.tsx)과 동일한 스트림 아이콘 체계 재사용.
const STREAM_META: Record<string, { label: string; Icon: LucideIcon }> = {
  가드포지션: { label: "가드포지션", Icon: Shield },
  탑포지션:   { label: "탑포지션", Icon: Swords },
  이스케이프: { label: "이스케이프", Icon: Zap },
  스탠딩:     { label: "스탠딩", Icon: Users },
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

  const PositionIcon = POSITION_ICON[position.id] ?? POSITION_ICON_FALLBACK;
  const streamMeta = position.stream ? STREAM_META[position.stream] : null;

  return (
    <PageWrapper>
      <Link
        href="/tree"
        className="inline-flex items-center gap-1 text-text-tertiary text-sm mb-4 hover:text-text-secondary"
      >
        <ChevronLeft size={16} /> 포지션 목록
      </Link>

      {/* 헤더 — 박스 카드 대신 플랫 (2026-09-19, 디자인 시스템 적용) */}
      <div className="mb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-bg-elevated text-text-tertiary shrink-0">
            <PositionIcon size={22} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[19px] font-bold text-text-primary truncate">{position.nameKo}</h1>
            <p className="text-xs text-text-tertiary mt-0.5">{position.nameEn}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3.5">
          {streamMeta && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-border-subtle text-text-tertiary">
              <streamMeta.Icon size={12} strokeWidth={1.8} />
              {streamMeta.label}
            </span>
          )}
          <span className="text-[11px] text-text-tertiary">{sortedChildren.length}개 기술</span>
        </div>
      </div>

      <div className="h-px bg-border-subtle mb-4" />

      {/* 기술 목록 — 포지션 전체(자기 자신) + 세부 기술 */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">기술 목록</span>
      </div>
      <div>
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
