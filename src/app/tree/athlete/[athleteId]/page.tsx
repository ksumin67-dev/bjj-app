import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAthleteByRecordId } from "@/lib/airtable/athletes";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { DIFFICULTY_META, DIFFICULTY_ORDER, STYLE_TAG_META } from "@/types/domain";
import type { StyleTag } from "@/types/domain";
import { AthleteAvatar } from "@/components/tree/AthleteAvatar";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const revalidate = 60;

type Params = { athleteId: string };

export async function generateMetadata({ params }: { params: Params }) {
  const athlete = await getAthleteByRecordId(params.athleteId);
  return { title: athlete ? `${athlete.nameKo} · 선수` : "선수 상세" };
}

export default async function AthleteDetailPage({ params }: { params: Params }) {
  const athlete = await getAthleteByRecordId(params.athleteId);
  if (!athlete) notFound();

  const allTechniques = await getAllTechniques();
  const techniques = allTechniques.filter((t) => t.athleteRecordIds.includes(athlete.recordId));

  const primaryTag = (athlete.styleTags[0] as StyleTag) ?? null;
  const accent = primaryTag ? STYLE_TAG_META[primaryTag].color : "#7B61FF";

  const byDifficulty = DIFFICULTY_ORDER.map((d) => ({
    difficulty: d,
    items: techniques.filter((t) => t.difficulty === d),
  })).filter((g) => g.items.length > 0);

  return (
    <PageWrapper>
      <Link
        href="/tree"
        className="inline-flex items-center gap-1 text-text-tertiary text-sm mb-4 hover:text-text-secondary"
      >
        <ChevronLeft size={16} /> 선수 목록
      </Link>

      {/* 헤더 카드 */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: `linear-gradient(150deg, ${accent}22 0%, #1A1A24 60%)` }}
      >
        <div className="flex items-center gap-4">
          <AthleteAvatar color={accent} size={56} />
          <div className="min-w-0">
            <h1 className="text-xl font-black text-text-primary truncate">{athlete.nameKo}</h1>
            <p className="text-xs text-text-tertiary truncate">
              {athlete.nameEn} · {athlete.beltAcademy}
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">{athlete.activeEra}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="text-2xl font-black tabular-nums" style={{ color: accent }}>
            {athlete.heroStat}
          </div>
          <div className="text-[11px] text-text-tertiary">{athlete.heroLabel}</div>
        </div>

        {athlete.styleTags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {athlete.styleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: STYLE_TAG_META[tag as StyleTag]?.color + "22",
                  color: STYLE_TAG_META[tag as StyleTag]?.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {athlete.achievements && (
          <div className="mt-4 rounded-xl p-3 bg-bg-overlay">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">
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

      {/* 대표 기술 목록 (난이도별) */}
      {byDifficulty.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-10">
          아직 이 선수의 대표 기술이 등록되지 않았습니다.
        </p>
      ) : (
        <div className="space-y-5">
          {byDifficulty.map(({ difficulty, items }) => {
            const meta = DIFFICULTY_META[difficulty];
            return (
              <div key={difficulty}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span>{meta.emoji}</span>
                  <span className="text-[11px] font-bold text-text-secondary">{meta.label}</span>
                  <span className="text-[10px] text-text-tertiary">· {items.length}개</span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <Link
                      key={t.recordId}
                      href={`/tree/${t.parentId ?? ""}/${t.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated p-3 hover:bg-bg-hover transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-text-primary truncate">{t.nameKo}</p>
                        <p className="text-[10px] text-text-tertiary font-mono">{t.id}</p>
                      </div>
                      <ChevronRight size={15} className="text-text-disabled shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
