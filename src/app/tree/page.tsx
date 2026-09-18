import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { buildTrainingCountMap } from "@/types/domain";
import type { Stream } from "@/types/domain";
import TreeTabs from "@/components/tree/TreeTabs";
import { ProgressHeader } from "@/components/tree/ProgressHeader";
import type { StreamGroup } from "@/components/tree/SkillTreeBrowser";

export const metadata = { title: "기술도감" };
// 벨트/스트라이프는 유저별 프로필(쿠키 기반) 데이터라 정적 재검증과 안 맞음
// → force-dynamic (calendar/profile/athlete 상세 페이지와 동일 패턴, 2026-09-19).
export const dynamic = "force-dynamic";

const STREAM_ORDER: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

// 스트림 내 포지션 표시 순서(큐레이션) — 예전 드릴다운 버전에서 그대로 이관
const POSITION_PRIORITY = [
  "CG", "HG", "BF", "ZG", "DLR", "RDLR", "SP", "LS", "RG", "XG", "SLX", "FF", "SG", "KG",
  "GP", "GB", "GBCG", "GBSP", "GBLS", "GBDLR", "GBBF", "SC", "MT", "KNB", "KB", "NS", "BC",
  "ME", "SCE", "BD", "KNBE", "NSE",
  "TD",
];
const prio = (id: string) => {
  const i = POSITION_PRIORITY.indexOf(id);
  return i === -1 ? 999 : i;
};

export default async function TreePage() {
  const [techniques, sessions, athletes, profile] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
    getAllAthletes(),
    getUserProfile(),
  ]);

  const countMap = buildTrainingCountMap(sessions);

  // 총 XP — 이건 "학습 레벨"(게이미피케이션) 산정용이지 벨트가 아님.
  // 벨트는 profile.belt/stripe(프로필에서 직접 설정한 실제 값)를 그대로 씀.
  const techMap = new Map(techniques.map((t) => [t.recordId, t]));
  let totalXP = 0;
  for (const session of sessions) {
    for (const id of session.techniqueRecordIds) totalXP += techMap.get(id)?.xpValue ?? 0;
    totalXP += session.sequenceRecordIds.length * 200;
  }

  const trained = Object.values(countMap).filter((c) => c > 0).length;
  const total = techniques.length;

  // ── 포지션 탭 데이터: 포지션(부모, parentId=null)별 요약 ──────────────
  // 예전 레벨링 시스템(Lv.1~4)은 부활시키지 않고 단순 수련 비율만 계산.
  const positions = techniques.filter((t) => t.parentId === null);
  const summarize = (posCode: string) => {
    const children = techniques.filter((t) => t.parentId === posCode);
    const trainedCount = children.filter((c) => (countMap[c.recordId] ?? 0) > 0).length;
    return { childCount: children.length, trainedCount };
  };
  const groups: StreamGroup[] = STREAM_ORDER.map((stream) => {
    const list = positions
      .filter((p) => p.stream === stream)
      .map((p) => ({ id: p.id, nameKo: p.nameKo, nameEn: p.nameEn, ...summarize(p.id) }))
      .filter((p) => p.childCount > 0)
      .sort((a, b) => prio(a.id) - prio(b.id) || a.id.localeCompare(b.id));
    return { stream, positions: list };
  }).filter((g) => g.positions.length > 0);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* ── 헤더 ─────────────────────────────────────────────── */}
      <header className="px-4 pt-5 pb-4 shrink-0 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">기술도감</h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {total}개 기술 · {trained}개 수련 중
          </p>
        </div>

        <ProgressHeader belt={profile.belt} stripe={profile.stripe} totalXp={totalXP} />
      </header>

      {/* ── 선수/포지션 이원화 탭 ─────────────────────────────── */}
      <div className="flex-1 min-h-0 pb-16 lg:pb-0">
        <TreeTabs athletes={athletes} groups={groups} />
      </div>
    </div>
  );
}
