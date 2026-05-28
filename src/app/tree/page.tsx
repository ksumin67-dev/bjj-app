import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
import { buildTrainingCountMap, getBeltRank, getBjjStyle } from "@/types/domain";
import SkillTreeGraph from "@/components/tree/SkillTreeGraph";

export const metadata = { title: "스킬트리" };
export const revalidate = 30;

const STREAM_COLORS: Record<string, { color: string; bg: string }> = {
  "가드포지션": { color: "#2E80F0", bg: "rgba(46,128,240,0.12)" },
  "탑포지션":   { color: "#FF8C42", bg: "rgba(255,140,66,0.12)"  },
  "이스케이프": { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  "스탠딩":     { color: "#FBBF24", bg: "rgba(251,191,36,0.12)"  },
};

export default async function TreePage() {
  const [techniques, sessions] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
  ]);

  const countMap = buildTrainingCountMap(sessions);

  // 총 XP 계산
  const techMap = new Map(techniques.map((t) => [t.recordId, t]));
  let totalXP = 0;
  for (const session of sessions) {
    for (const id of session.techniqueRecordIds) {
      totalXP += techMap.get(id)?.xpValue ?? 0;
    }
    totalXP += session.sequenceRecordIds.length * 200;
  }

  const beltRank  = getBeltRank(totalXP);
  const trained   = Object.values(countMap).filter((c) => c > 0).length;
  const total     = techniques.length;

  // 스트림별 수련 합계 → 스타일 분석 (주력 기술 개념 제거)
  const streamCounts: Record<string, number> = {};
  for (const t of techniques) {
    if (t.stream) {
      streamCounts[t.stream] = (streamCounts[t.stream] ?? 0) + (countMap[t.recordId] ?? 0);
    }
  }
  const bjjStyle = getBjjStyle(streamCounts, sessions.length);

  // 주력 기술 (isMainSkill) — 스킬트리 UI 표시용으로만 유지
  const mainSkills = techniques.filter((t) => t.isMainSkill);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* ── 상단 헤더 ─────────────────────────────────────────── */}
      <header className="px-4 pt-5 pb-3 shrink-0 space-y-3">
        {/* 1행: 제목 + XP */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">
              스킬트리 <span className="text-brand-primary">🌳</span>
            </h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {total}개 기술 · {trained}개 수련 중 · 주력 {mainSkills.length}개
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-tertiary">{beltRank.label}</div>
            <span className="text-lg font-black text-brand-primary tabular-nums">{totalXP.toLocaleString()}</span>
            <span className="text-xs text-text-tertiary ml-1">XP</span>
          </div>
        </div>

        {/* 2행: BJJ 스타일 카드 */}
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-4 bg-bg-elevated border border-border-subtle"
          
        >
          {/* 스타일 아이덴티티 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{bjjStyle.emoji}</span>
              <span className="text-sm font-black text-text-primary">{bjjStyle.label}</span>
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5 truncate">{bjjStyle.desc}</p>
          </div>

          {/* 스트림 분포 바 */}
          {mainSkills.length > 0 ? (
            <div className="flex flex-col gap-1 min-w-[90px]">
              {(["가드포지션", "탑포지션", "이스케이프", "스탠딩"] as const).map((stream) => {
                const cnt   = streamCounts[stream] ?? 0;
                const pct   = mainSkills.length > 0 ? Math.round((cnt / mainSkills.length) * 100) : 0;
                const sc    = STREAM_COLORS[stream];
                return (
                  <div key={stream} className="flex items-center gap-1.5">
                    <div className="w-[52px] h-1 rounded-full bg-bg-overlay overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: sc.color }}
                      />
                    </div>
                    <span className="text-[9px] text-text-tertiary tabular-nums w-6">{cnt > 0 ? cnt : ""}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] text-text-disabled text-right leading-relaxed">
              수련 3회 이상 기술을<br/>주력으로 등록하세요
            </p>
          )}
        </div>
      </header>

      {/* ── 스킬트리 그래프 ───────────────────────────────────── */}
      <div className="flex-1 min-h-0 pb-16 lg:pb-0">
        <SkillTreeGraph techniques={techniques} trainingCountMap={countMap} />
      </div>
    </div>
  );
}
