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
} from "lucide-react";
import { getPositionByPositionId } from "@/lib/airtable/positions";
import { getTechniqueByTechId } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
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
  const positionId = params.positionId.toUpperCase();
  const techId = params.techId.toUpperCase();

  const [position, technique, sessions] = await Promise.all([
    getPositionByPositionId(positionId),
    getTechniqueByTechId(techId),
    getAllTrainingSessions(),
  ]);

  if (!technique) notFound();

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
          href={`/tree/${positionId}`}
          className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          {position?.nameKo ?? positionId}
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

      {/* 심화 정보 */}
      {hasDetails && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            심화 정보
          </h2>
          <DetailSection icon={<Hand size={14} />} label="그립" content={technique.grip} />
          <DetailSection icon={<PersonStanding size={14} />} label="체형 추천" content={technique.bodyType} />
          <DetailSection icon={<Lightbulb size={14} />} label="핵심 포인트" content={technique.keyPoint} />
          <DetailSection icon={<Target size={14} />} label="실전 팁" content={technique.practicalTip} />
          <DetailSection icon={<AlertTriangle size={14} />} label="흔한 실수" content={technique.commonMistake} />
          <DetailSection icon={<ShieldX size={14} />} label="카운터" content={technique.counter} />
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
