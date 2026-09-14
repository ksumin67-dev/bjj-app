import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { buildTrainingCountMap, getBeltRank, getBjjStyle } from "@/types/domain";
import AthleteEntryScreen from "@/components/tree/AthleteEntryScreen";

export const metadata = { title: "스킬트리" };
export const revalidate = 30;

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

  // 스트림별 수련 합계 → 스타일 분석
  const streamCounts: Record<string, number> = {};
  for (const t of techniques) {
    if (t.stream) streamCounts[t.stream] = (streamCounts[t.stream] ?? 0) + (countMap[t.recordId] ?? 0);
  }
  const bjjStyle = getBjjStyle(streamCounts, sessions.length);

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

      {/* ── 선수 진입 화면 ─────────────────────────────────── */}
      <div className="flex-1 min-h-0 pb-16 lg:pb-0">
        <AthleteEntryScreen athletes={athletes} />
      </div>
    </div>
  );
}
