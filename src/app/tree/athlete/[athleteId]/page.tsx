import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAthleteByRecordId } from "@/lib/airtable/athletes";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { getMyTechniqueGoalIdSet } from "@/lib/supabase/techniqueGoals";
import { STYLE_TAG_META, STYLE_TAG_FALLBACK } from "@/types/domain";
import type { StyleTag } from "@/types/domain";
import { AthleteAvatar } from "@/components/tree/AthleteAvatar";
import { getAthletePhoto } from "@/lib/athletePhotos";
import { AthleteTechniqueRow } from "@/components/tree/AthleteTechniqueRow";
import { PageWrapper } from "@/components/layout/PageWrapper";

// technique_goals는 로그인 유저별 데이터(쿠키 기반)라 정적 재검증(revalidate)과 맞지 않아
// force-dynamic으로 전환 (2026-09-15, calendar/profile 페이지와 동일 패턴).
export const dynamic = "force-dynamic";

type Params = { athleteId: string };

export async function generateMetadata({ params }: { params: Params }) {
  const athlete = await getAthleteByRecordId(params.athleteId);
  return { title: athlete ? `${athlete.nameKo} · 선수` : "선수 상세" };
}

export default async function AthleteDetailPage({ params }: { params: Params }) {
  const athlete = await getAthleteByRecordId(params.athleteId);
  if (!athlete) notFound();

  const [allTechniques, goalIdSet] = await Promise.all([
    getAllTechniques(),
    getMyTechniqueGoalIdSet(),
  ]);
  const techniques = allTechniques.filter((t) => t.athleteRecordIds.includes(athlete.recordId));
  const goalCount = techniques.filter((t) => goalIdSet.has(t.recordId)).length;

  const primaryTag = (athlete.styleTags[0] as StyleTag) ?? null;
  const accent = primaryTag ? (STYLE_TAG_META[primaryTag] ?? STYLE_TAG_FALLBACK).color : STYLE_TAG_FALLBACK.color;

  // 대표 기술은 이미 선수별로 큐레이션된 목록이라 난이도(기본/정착/트렌드)로 또
  // 나눌 필요가 없어 2026-09-14 제거 — ID 순으로 정렬한 단일 목록만 표시.
  const sortedTechniques = [...techniques].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  return (
    <PageWrapper>
      <Link
        href="/tree"
        className="inline-flex items-center gap-1 text-text-tertiary text-sm mb-4 hover:text-text-secondary"
      >
        <ChevronLeft size={16} /> 선수 목록
      </Link>

      {/* 헤더 — 그라디언트 박스 대신 플랫 (2026-09-19, 디자인 시스템 적용) */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <AthleteAvatar
            color={accent}
            size={56}
            photoUrl={getAthletePhoto(athlete.recordId)}
            alt={athlete.nameKo}
          />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary truncate">{athlete.nameKo}</h1>
            <p className="text-xs text-text-tertiary truncate">
              {athlete.nameEn} · {athlete.beltAcademy}
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">{athlete.activeEra}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <div className="text-[26px] font-bold tabular-nums text-brand-primary">
            {athlete.heroStat}
          </div>
          <div className="text-[11px] text-text-tertiary">{athlete.heroLabel}</div>
        </div>

        {athlete.styleTags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {athlete.styleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10.5px] font-bold px-2.5 py-1 rounded-full border border-border-subtle text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {athlete.achievements && (
          <div className="mt-4">
            <p className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary mb-1">
              대표 성과
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">{athlete.achievements}</p>
          </div>
        )}

        {athlete.signatureSystem && (
          <p className="text-[11px] text-text-tertiary mt-3">
            대표 시스템 · <span className="text-text-secondary">{athlete.signatureSystem}</span>
          </p>
        )}
      </div>

      <div className="h-px bg-border-subtle mb-4" />

      {/* 대표 기술 목록 */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">
          대표 기술 · {sortedTechniques.length}개
        </span>
        {goalCount > 0 && (
          <span className="text-[10px] font-semibold ml-auto flex items-center gap-1" style={{ color: "#F87171" }}>
            ♥ {goalCount}개 목표 등록
          </span>
        )}
      </div>
      {sortedTechniques.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-10">
          아직 이 선수의 대표 기술이 등록되지 않았습니다.
        </p>
      ) : (
        <div>
          {sortedTechniques.map((t) => (
            <AthleteTechniqueRow
              key={t.recordId}
              technique={t}
              athleteRecordId={athlete.recordId}
              initialIsGoal={goalIdSet.has(t.recordId)}
              backContext={{ href: `/tree/athlete/${athlete.recordId}`, label: athlete.nameKo }}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
