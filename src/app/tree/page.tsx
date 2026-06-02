import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
import {
  buildTrainingCountMap,
  getBeltRank,
  getBjjStyle,
  DIFFICULTY_ORDER,
  computePositionLevel,
} from "@/types/domain";
import type { Stream, Difficulty, Technique } from "@/types/domain";
import SkillTreeBrowser, {
  type PosSummary,
  type StreamGroup,
} from "@/components/tree/SkillTreeBrowser";

export const metadata = { title: "스킬트리" };
export const revalidate = 30;

const STREAM_ORDER: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];

// 스트림 내 포지션 표시 순서 (큐레이션)
const POSITION_PRIORITY = [
  // 가드
  "CG", "HG", "BF", "DLR", "RDLR", "SP", "LS", "RG", "XG", "SLX", "FF", "SG", "KG",
  // 탑
  "GP", "GB", "GBCG", "GBSP", "GBLS", "GBDLR", "GBBF", "SC", "MT", "KNB", "KB", "NS", "BC",
  // 이스케이프
  "ME", "SCE", "BD", "KNBE", "NSE",
  // 스탠딩
  "TD",
];
const prio = (id: string) => {
  const i = POSITION_PRIORITY.indexOf(id);
  return i === -1 ? 999 : i;
};

export default async function TreePage() {
  const [techniques, sessions] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
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

  // 스트림별 수련 합계 → 스타일 분석
  const streamCounts: Record<string, number> = {};
  for (const t of techniques) {
    if (t.stream) streamCounts[t.stream] = (streamCounts[t.stream] ?? 0) + (countMap[t.recordId] ?? 0);
  }
  const bjjStyle = getBjjStyle(streamCounts, sessions.length);

  // ── 드릴다운 데이터: 포지션별 요약 ───────────────────────────────────────
  // 포지션(부모) 레코드 = ID에 "-"가 없는 레코드 (예: CG, MT). 자식 기술은 "CG-01" 형식.
  // (부모 레코드의 타입은 컨트롤/패스/이스케이프 등으로 제각각이라 타입으로 판별하면 안 됨)
  const isPosition = (t: Technique) => !t.id.includes("-");
  const positions = techniques.filter(isPosition);

  const emptyDiff = (): Record<Difficulty, number> =>
    DIFFICULTY_ORDER.reduce((o, d) => ({ ...o, [d]: 0 }), {} as Record<Difficulty, number>);

  const summarize = (posCode: string): Omit<PosSummary, "id" | "nameKo" | "nameEn"> => {
    const children = techniques.filter(
      (t) => t.parentId === posCode && t.id.includes("-"),
    );
    const diff = emptyDiff();
    let trainedCount = 0;
    let expertCount = 0;
    for (const c of children) {
      const cnt = countMap[c.recordId] ?? 0;
      if (cnt > 0) trainedCount++;
      if (cnt >= 10) expertCount++;
      if (c.difficulty) diff[c.difficulty]++;
    }
    const lv = computePositionLevel(children, countMap);
    return {
      childCount: children.length,
      trainedCount,
      expertCount,
      diff,
      level: lv.level,
      levelLabel: lv.label,
    };
  };

  const groups: StreamGroup[] = STREAM_ORDER.map((stream) => {
    const list: PosSummary[] = positions
      .filter((p) => p.stream === stream)
      .map((p) => ({ id: p.id, nameKo: p.nameKo, nameEn: p.nameEn, ...summarize(p.id) }))
      .filter((p) => p.childCount > 0)
      .sort((a, b) => prio(a.id) - prio(b.id) || a.id.localeCompare(b.id));
    return { stream, positions: list };
  }).filter((g) => g.positions.length > 0);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* ── 헤더 ─────────────────────────────────────────────── */}
      <header className="px-4 pt-5 pb-3 shrink-0 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">
              스킬트리 <span className="text-brand-primary">🌳</span>
            </h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {total}개 기술 · {trained}개 수련 중
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-tertiary">{beltRank.label}</div>
            <span className="text-lg font-black text-brand-primary tabular-nums">{totalXP.toLocaleString()}</span>
            <span className="text-xs text-text-tertiary ml-1">XP</span>
          </div>
        </div>

        {/* BJJ 스타일 카드 */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-4 bg-bg-elevated border border-border-subtle">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{bjjStyle.emoji}</span>
              <span className="text-sm font-black text-text-primary">{bjjStyle.label}</span>
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5 truncate">{bjjStyle.desc}</p>
          </div>
        </div>
      </header>

      {/* ── 드릴다운 브라우저 ─────────────────────────────────── */}
      <div className="flex-1 min-h-0 pb-16 lg:pb-0">
        <SkillTreeBrowser groups={groups} />
      </div>
    </div>
  );
}
