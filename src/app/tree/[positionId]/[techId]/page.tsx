import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ExternalLink,
  Search,
  Hand,
  PersonStanding,
  Lightbulb,
  Target,
  AlertTriangle,
  ShieldX,
  Lock,
} from "lucide-react";
import { getTechniqueByTechId } from "@/lib/airtable/techniques";
import { getAthleteByRecordId } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { buildTrainingCountMap, trainingCountLabel } from "@/types/domain";
import { TypeChip } from "@/components/tree/TypeChip";
import { StatusIcon } from "@/components/tree/StatusIcon";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const dynamic = "force-dynamic";

type Params = { positionId: string; techId: string };

export async function generateMetadata({ params }: { params: Params }) {
  const tech = await getTechniqueByTechId(params.techId.toUpperCase());
  return {
    title: tech ? tech.nameKo : "기술 상세",
  };
}

function DetailSection({
  icon,
  label,
  content,
}: {
  icon: React.ReactNode;
  label: string;
  content: string | null;
}) {
  if (!content) return null;
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-brand-primary">{icon}</span>
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          {label}
        </h3>
      </div>
      <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );
}

const STREAM_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  가드포지션:   { bg: "bg-[#2E80F0]/15", text: "text-[#2E80F0]", label: "🛡 가드포지션" },
  탑포지션:     { bg: "bg-[#FF8C42]/15", text: "text-[#FF8C42]", label: "⚔️ 탑포지션" },
  이스케이프:   { bg: "bg-[#A78BFA]/15", text: "text-[#A78BFA]", label: "🔓 이스케이프" },
  스탠딩:       { bg: "bg-[#FBBF24]/15", text: "text-[#FBBF24]", label: "🥋 스탠딩" },
};

export default async function TechniqueDetailPage({
  params,
}: {
  params: Params;
}) {
  const techId = params.techId.toUpperCase();

  const [technique, sessions, profile] = await Promise.all([
    getTechniqueByTechId(techId),
    getAllTrainingSessions(),
    getUserProfile(),
  ]);

  if (!technique) notFound();

  // 포지션 드릴다운(레벨링) 페이지는 선수 중심 개편으로 제거됨(2026-09-14) —
  // 뒤로가기는 이 기술을 대표 기술로 둔 선수 상세로, 없으면 선수 목록으로.
  const primaryAthleteId = technique.athleteRecordIds[0] ?? null;
  const primaryAthlete = primaryAthleteId ? await getAthleteByRecordId(primaryAthleteId) : null;
  const backHref = primaryAthlete ? `/tree/athlete/${primaryAthlete.recordId}` : "/tree";
  const backLabel = primaryAthlete ? primaryAthlete.nameKo : "선수 목록";

  const countMap = buildTrainingCountMap(sessions);
  const trainingCount = countMap[technique.recordId] ?? 0;
  const countLabel = trainingCountLabel(trainingCount);

  const streamStyle = technique.stream ? STREAM_STYLES[technique.stream] : null;
  const hasDetails =
    technique.keyPoint ||
    technique.practicalTip ||
    technique.commonMistake ||
    technique.counter ||
    technique.grip ||
    technique.bodyType;

  return (
    <PageWrapper>
      <div className="space-y-6 pb-20">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          {backLabel}
        </Link>
      </div>

      {/* 기술 헤더 */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-text-tertiary bg-bg-elevated px-2 py-0.5 rounded">
            {technique.id}
          </span>
          <TypeChip type={technique.type} />
          {streamStyle && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${streamStyle.bg} ${streamStyle.text}`}
            >
              {streamStyle.label}
            </span>
          )}
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {technique.nameKo}
        </h1>
        <p className="text-sm text-text-tertiary">{technique.nameEn}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm font-semibold text-brand-primary">
            {technique.xpValue} XP
          </span>
          {technique.giNogi !== "기·노기공통" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-tertiary">
              {technique.giNogi}
            </span>
          )}
        </div>
      </header>

      {/* 영상 링크 */}
      {(technique.videoUrl || technique.ytSearchGeneral) && (
        <section className="flex flex-wrap gap-2">
          {technique.videoUrl && (
            <a
              href={technique.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
            >
              <ExternalLink size={14} />
              영상 보기
            </a>
          )}
          {technique.ytSearchGeneral && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique.ytSearchGeneral)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
            >
              <Search size={14} />
              YouTube 검색
            </a>
          )}
        </section>
      )}

      {/* 심화 정보 — 프리미엄 전용 */}
      {hasDetails && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            심화 정보
          </h2>
          {profile.isPremium ? (
            <>
              <DetailSection icon={<Hand size={14} />} label="그립" content={technique.grip} />
              <DetailSection icon={<PersonStanding size={14} />} label="체형 추천" content={technique.bodyType} />
              <DetailSection icon={<Lightbulb size={14} />} label="핵심 포인트" content={technique.keyPoint} />
              <DetailSection icon={<Target size={14} />} label="실전 팁" content={technique.practicalTip} />
              <DetailSection icon={<AlertTriangle size={14} />} label="흔한 실수" content={technique.commonMistake} />
              <DetailSection icon={<ShieldX size={14} />} label="카운터" content={technique.counter} />
            </>
          ) : (
            <Link
              href="/upgrade"
              className="block rounded-2xl border border-border-subtle bg-bg-elevated p-5 text-center hover:bg-bg-hover transition-colors"
            >
              <Lock size={20} className="text-brand-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary">
                프리미엄 전용 콘텐츠
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                그립·핵심포인트·실전팁·흔한실수·카운터 등 상세 코칭 정보를 보려면
                프리미엄으로 업그레이드하세요
              </p>
            </Link>
          )}
        </section>
      )}

      {/* 내 수련 현황 */}
      <section className="rounded-2xl border border-border-subtle bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          내 수련 현황
        </h2>
        <div className="flex items-center gap-3">
          <StatusIcon count={trainingCount} size={24} showLabel />
          <div className="text-sm text-text-tertiary">
            총 <span className="font-semibold text-text-primary">{trainingCount}회</span> 수련
          </div>
        </div>
      </section>

      {technique.notes && (
        <section className="rounded-2xl border border-border-subtle bg-bg-elevated p-5">
          <h2 className="text-sm font-semibold text-text-secondary mb-2">
            메모
          </h2>
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {technique.notes}
          </p>
        </section>
      )}
      </div>
    </PageWrapper>
  );
}
