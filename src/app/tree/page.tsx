import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { buildTrainingCountMap, getBeltRank } from "@/types/domain";
import type { Stream } from "@/types/domain";
import TreeTabs from "@/components/tree/TreeTabs";
import { BeltProgressBar } from "@/components/tree/BeltProgressBar";
import type { StreamGroup } from "@/components/tree/SkillTreeBrowser";

export const metadata = { title: "기술도감" };
export const revalidate = 30;

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
  const [techniques, sessions, athletes] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
    getAllAthletes(),
  ]);

  const countMap = buildTrainingCountMap(sessions);

  // 총 XP
  const techMap = new Map(techniques.map((t) => [t.recordId, t]));
  let totalXP = 0;
  for (const session of sessions) {
    for (const id of session.techniqueRecordIds) totalXP += techMap.get(id)?.xpValue ?? 0;
    totalXP += session.sequenceRecordIds.length * 200;
  }

  const beltRank = getBeltRank(totalXP);
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

        <BeltProgressBar belt={beltRank.belt} totalXp={totalXP} />
      </header>

      {/* ── 선수/포지션 이원화 탭 ─────────────────────────────── */}
      <div className="flex-1 min-h-0 pb-16 lg:pb-0">
        <TreeTabs athletes={athletes} groups={groups} />
      </div>
    </div>
  );
}
