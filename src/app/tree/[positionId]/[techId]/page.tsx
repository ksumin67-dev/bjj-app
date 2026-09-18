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
  Shield,
  Swords,
  Zap,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTechniqueByTechId } from "@/lib/airtable/techniques";
import { getAthleteByRecordId } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { buildTrainingCountMap, trainingCountLabel } from "@/types/domain";
import { TypeChip } from "@/components/tree/TypeChip";
import { StatusIcon } from "@/components/tree/StatusIcon";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const dynamic = "force-dynamic";

type Params = { positionId: string; techId: string };
type SearchParams = { backHref?: string; backLabel?: string };

export async function generateMetadata({ params }: { params: Params }) {
  const tech = await getTechniqueByTechId(params.techId.toUpperCase());
  return {
    title: tech ? tech.nameKo : "기술 상세",
  };
}

// (2026-09-19) 박스 카드(rounded-2xl border bg-elevated) → 아이콘+라벨+텍스트만
// 있는 플랫 섹션으로. 디자인 시스템 "박스 카드 지양" 원칙 적용.
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
    <div className="flex gap-2.5">
      <span className="text-brand-primary shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <h3 className="text-[11px] font-semibold text-text-tertiary mb-0.5">
          {label}
        </h3>
        <p className="text-[12.5px] text-text-secondary whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

// 스트림 배지 — 기술도감 포지션 탭과 동일한 아이콘 체계(Shield/Swords/Zap/
// Users) 재사용, 이모지·색깔 필 대신 아웃라인 칩 (2026-09-19).
const STREAM_META: Record<string, { label: string; Icon: LucideIcon }> = {
  가드포지션: { label: "가드포지션", Icon: Shield },
  탑포지션:   { label: "탑포지션", Icon: Swords },
  이스케이프: { label: "이스케이프", Icon: Zap },
  스탠딩:     { label: "스탠딩", Icon: Users },
};

export default async function TechniqueDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const techId = params.techId.toUpperCase();

  const [technique, sessions] = await Promise.all([
    getTechniqueByTechId(techId),
    getAllTrainingSessions(),
  ]);

  if (!technique) notFound();

  // 뒤로가기 경로: 진입한 화면(선수 상세/포지션 상세)이 backHref/backLabel
  // 쿼리로 명시적으로 넘겨준 경우 그대로 사용 (2026-09-18, 포지션 상세에서
  // 들어왔는데 뒤로가기가 엉뚱한 대표선수 페이지로 튀던 버그 수정).
  // 쿼리가 없는 경우(북마크/직접 링크 등)에만 대표선수 기준으로 추정하는
  // 구버전 폴백을 사용.
  let backHref = searchParams.backHref;
  let backLabel = searchParams.backLabel;
  if (!backHref) {
    const primaryAthleteId = technique.athleteRecordIds[0] ?? null;
    const primaryAthlete = primaryAthleteId ? await getAthleteByRecordId(primaryAthleteId) : null;
    backHref = primaryAthlete ? `/tree/athlete/${primaryAthlete.recordId}` : "/tree";
    backLabel = primaryAthlete ? primaryAthlete.nameKo : "선수 목록";
  }

  const countMap = buildTrainingCountMap(sessions);
  const trainingCount = countMap[technique.recordId] ?? 0;
  const countLabel = trainingCountLabel(trainingCount);

  const streamMeta = technique.stream ? STREAM_META[technique.stream] : null;
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
          {streamMeta && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-border-subtle text-text-tertiary">
              <streamMeta.Icon size={12} strokeWidth={1.8} />
              {streamMeta.label}
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

      {/* 심화 정보 — 프리미엄 게이팅은 아직 실제로 반영된 기능이 아니라
          제거하고 전원 노출 (2026-09-19, 사용자 지시) */}
      {hasDetails && (
        <section className="space-y-4">
          <h2 className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">
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

      <div className="h-px bg-border-subtle" />

      {/* 내 수련 현황 — 박스 카드 대신 플랫 한 줄 */}
      <section className="flex items-center gap-3">
        <StatusIcon count={trainingCount} size={22} />
        <div className="text-sm text-text-secondary">
          총 <span className="font-semibold text-text-primary">{trainingCount}회</span> 수련 · {countLabel}
        </div>
      </section>

      {technique.notes && (
        <>
          <div className="h-px bg-border-subtle" />
          <section>
            <h2 className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary mb-1.5">
              메모
            </h2>
            <p className="text-[13px] text-text-secondary whitespace-pre-wrap leading-relaxed">
              {technique.notes}
            </p>
          </section>
        </>
      )}
      </div>
    </PageWrapper>
  );
}
