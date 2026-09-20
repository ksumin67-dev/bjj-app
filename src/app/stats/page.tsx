import { BarChart3, Shield, Swords, Zap, Users, Flame, type LucideIcon } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { buildTrainingCountMap, calculateStreak } from "@/types/domain";
import type { Stream, TrainingSession } from "@/types/domain";

export const metadata = { title: "통계" };
export const dynamic = "force-dynamic";

const STREAMS: Stream[] = ["가드포지션", "탑포지션", "이스케이프", "스탠딩"];
const STREAM_META: Record<Stream, { label: string; Icon: LucideIcon }> = {
  가드포지션: { label: "가드",       Icon: Shield },
  탑포지션:   { label: "탑",         Icon: Swords },
  이스케이프: { label: "이스케이프", Icon: Zap    },
  스탠딩:     { label: "스탠딩",     Icon: Users  },
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

/** 최근 N주(이번 주 포함)의 주간 XP 합계. 배열 첫 원소가 가장 오래된 주. */
function buildWeeklyXp(sessions: TrainingSession[], weeks: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: weeks }, () => 0);

  for (const s of sessions) {
    const [y, m, d] = s.date.split("-").map(Number);
    if (!y || !m || !d) continue;
    const date = new Date(y, m - 1, d);
    const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000);
    const weekIndex = Math.floor(diffDays / 7); // 0 = 이번 주
    if (weekIndex < 0 || weekIndex >= weeks) continue;
    buckets[weeks - 1 - weekIndex] += s.xpEarned ?? 0;
  }
  return buckets;
}

export default async function StatsPage() {
  const [techniques, sessions] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
  ]);

  const trainingCountMap = buildTrainingCountMap(sessions);
  const streak = calculateStreak(sessions);

  // 이번 달 / 지난달 XP·수련일수
  const now = new Date();
  const thisMonthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${pad(lastMonthDate.getMonth() + 1)}`;

  const thisMonthSessions = sessions.filter((s) => s.date.startsWith(thisMonthPrefix));
  const lastMonthSessions = sessions.filter((s) => s.date.startsWith(lastMonthPrefix));
  const thisMonthXp = thisMonthSessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const lastMonthXp = lastMonthSessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const thisMonthDays = new Set(thisMonthSessions.map((s) => s.date)).size;

  // 최근 8주 XP 추이
  const weeklyXp = buildWeeklyXp(sessions, 8);
  const maxWeeklyXp = Math.max(...weeklyXp, 1);

  // 스트림별 기술 커버리지(학습한 기술 수 / 전체 기술 수) — 반복 횟수가 아니라 "얼마나 넓게 배웠는지"
  const coverage = STREAMS.map((stream) => {
    const inStream = techniques.filter((t) => t.parentId !== null && t.stream === stream);
    const trained = inStream.filter((t) => (trainingCountMap[t.recordId] ?? 0) > 0);
    return {
      stream,
      trained: trained.length,
      total: inStream.length,
      pct: inStream.length > 0 ? Math.round((trained.length / inStream.length) * 100) : 0,
    };
  });

  // 가장 많이 수련한 기술 Top 5
  const techByRecordId = new Map(techniques.map((t) => [t.recordId, t]));
  const topTechniques = Object.entries(trainingCountMap)
    .map(([recordId, count]) => ({ tech: techByRecordId.get(recordId), count }))
    .filter((x): x is { tech: NonNullable<typeof x.tech>; count: number } => Boolean(x.tech))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const xpDiff = thisMonthXp - lastMonthXp;

  return (
    <PageWrapper>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-black tracking-tight">통계</h1>
          <p className="text-text-tertiary mt-1 text-sm">주간/월간 XP, 카테고리별 진척도</p>
        </header>

        {sessions.length === 0 ? (
          <section className="pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-text-tertiary" />
              <h2 className="text-sm font-semibold text-text-secondary">아직 기록이 없어요</h2>
            </div>
            <p className="text-sm text-text-tertiary">
              캘린더에서 수련을 기록하면 여기에 통계가 쌓여요.
            </p>
          </section>
        ) : (
          <>
            {/* 이번 달 요약 */}
            <section className="pt-4 border-t border-border-subtle">
              <h2 className="text-[13.5px] font-bold text-text-primary mb-3">이번 달</h2>
              <div className="grid grid-cols-3 divide-x divide-border-subtle">
                <div className="text-center">
                  <p className="text-lg font-black tabular-nums text-brand-primary">{thisMonthXp.toLocaleString()}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black tabular-nums text-text-primary">{thisMonthDays}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">수련일</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black tabular-nums text-text-primary inline-flex items-center gap-1">
                    <Flame size={14} className="text-brand-primary" />{streak}
                  </p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">연속 일수</p>
                </div>
              </div>
              {lastMonthXp > 0 && (
                <p className="text-[11px] text-text-tertiary mt-3 text-center">
                  지난달 대비{" "}
                  <span className={xpDiff >= 0 ? "text-brand-primary font-semibold" : "text-text-secondary font-semibold"}>
                    {xpDiff >= 0 ? "+" : ""}{xpDiff.toLocaleString()} XP
                  </span>
                </p>
              )}
            </section>

            {/* 최근 8주 XP 추이 */}
            <section className="pt-4 border-t border-border-subtle">
              <h2 className="text-[13.5px] font-bold text-text-primary mb-4">최근 8주 XP 추이</h2>
              <div className="flex items-end justify-between gap-1.5 h-24">
                {weeklyXp.map((xp, i) => {
                  const isCurrent = i === weeklyXp.length - 1;
                  const heightPct = xp > 0 ? Math.max((xp / maxWeeklyXp) * 100, 6) : 2;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: isCurrent ? "#D9772E" : "rgba(217,119,46,0.28)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-text-tertiary">8주 전</span>
                <span className="text-[10px] text-text-tertiary">이번 주</span>
              </div>
            </section>

            {/* 카테고리별 기술 커버리지 */}
            <section className="pt-4 border-t border-border-subtle">
              <h2 className="text-[13.5px] font-bold text-text-primary mb-4">카테고리별 진척도</h2>
              <div className="space-y-3">
                {coverage.map(({ stream, trained, total, pct }) => {
                  const { label, Icon } = STREAM_META[stream];
                  return (
                    <div key={stream} className="flex items-center gap-3">
                      <Icon size={15} className="text-text-tertiary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-text-secondary">{label}</span>
                          <span className="text-[11px] tabular-nums text-text-tertiary">{trained}/{total}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 가장 많이 수련한 기술 Top 5 */}
            {topTechniques.length > 0 && (
              <section className="pt-4 border-t border-border-subtle">
                <h2 className="text-[13.5px] font-bold text-text-primary mb-3">가장 많이 수련한 기술</h2>
                <div className="space-y-1">
                  {topTechniques.map(({ tech, count }, i) => (
                    <div key={tech.recordId} className="flex items-center gap-2.5 py-1.5">
                      <span className="text-[11px] font-bold tabular-nums text-text-tertiary w-4 shrink-0">{i + 1}</span>
                      <span className="font-mono text-[10px] text-text-tertiary shrink-0">{tech.id}</span>
                      <span className="text-sm flex-1 truncate text-text-primary">{tech.nameKo}</span>
                      <span className="text-xs font-semibold tabular-nums text-brand-primary shrink-0">{count}회</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
