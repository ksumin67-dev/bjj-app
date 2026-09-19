"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Flame, Trophy, Activity,
  Dumbbell, Check, LayoutList, CalendarDays, ChevronDown,
} from "lucide-react";
import type { Technique, Sequence, TrainingSession } from "@/types/domain";
import { SessionFormModal } from "./SessionFormModal";
import { SessionDetailSheet } from "./SessionDetailSheet";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(date: Date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }

function buildMonthGrid(year: number, month0: number): Date[] {
  const first = new Date(year, month0, 1);
  const startWeekday = first.getDay();
  const start = new Date(year, month0, 1 - startWeekday);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return cells;
}

function computeStreak(allDates: Set<string>, today: Date): number {
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!allDates.has(ymd(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (allDates.has(ymd(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function formatListDate(date: string, todayKey: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  const dt = new Date(y, m - 1, d);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yest = `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())}`;
  if (date === todayKey) return `오늘 (${dow})`;
  if (date === yest) return `어제 (${dow})`;
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

export function CalendarHome({
  techniques,
  sequences,
  sessions,
  goalTechRecordIds = [],
}: {
  techniques: Technique[];
  sequences: Sequence[];
  sessions: TrainingSession[];
  goalTechRecordIds?: string[];
}) {
  const today = useMemo(() => new Date(), []);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [cursorYM, setCursorYM] = useState({ y: today.getFullYear(), m0: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expandedHistoryDate, setExpandedHistoryDate] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialDate, setFormInitialDate] = useState<string>(ymd(today));
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

  const techniqueByRecordId = useMemo(() => {
    const m = new Map<string, Technique>();
    for (const t of techniques) m.set(t.recordId, t);
    return m;
  }, [techniques]);

  const sequenceByRecordId = useMemo(() => {
    const m = new Map<string, Sequence>();
    for (const s of sequences) m.set(s.recordId, s);
    return m;
  }, [sequences]);

  const techniqueByShortId = useMemo(() => {
    const m: Record<string, Technique> = {};
    for (const t of techniques) m[t.id] = t;
    return m;
  }, [techniques]);

  const sessionsByDate = useMemo(() => {
    const m = new Map<string, TrainingSession[]>();
    for (const s of sessions) {
      if (!s.date) continue;
      const arr = m.get(s.date) ?? [];
      arr.push(s);
      m.set(s.date, arr);
    }
    return m;
  }, [sessions]);

  const allDates = useMemo(() => new Set(sessionsByDate.keys()), [sessionsByDate]);
  const streak   = useMemo(() => computeStreak(allDates, today), [allDates, today]);

  // 날짜 내림차순 정렬 — 리스트 뷰 & 최근 히스토리 공용
  const sortedEntries = useMemo(() => {
    return Array.from(sessionsByDate.keys())
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, sessions: sessionsByDate.get(date)! }));
  }, [sessionsByDate]);

  const recentEntries = useMemo(() => sortedEntries.slice(0, 5), [sortedEntries]);

  const monthStats = useMemo(() => {
    const prefix = `${cursorYM.y}-${pad(cursorYM.m0 + 1)}`;
    const monthSessions = sessions.filter((s) => s.date.startsWith(prefix));
    const days = new Set(monthSessions.map((s) => s.date)).size;
    const xp   = monthSessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
    return { days, xp };
  }, [sessions, cursorYM]);

  const grid = useMemo(() => buildMonthGrid(cursorYM.y, cursorYM.m0), [cursorYM]);

  const monthLabel       = `${cursorYM.y}년 ${cursorYM.m0 + 1}월`;
  const todayKey         = ymd(today);
  const selectedSessions = selectedDate ? sessionsByDate.get(selectedDate) ?? [] : [];

  function gotoPrev() {
    setCursorYM(({ y, m0 }) => { const d = new Date(y, m0 - 1, 1); return { y: d.getFullYear(), m0: d.getMonth() }; });
  }
  function gotoNext() {
    setCursorYM(({ y, m0 }) => { const d = new Date(y, m0 + 1, 1); return { y: d.getFullYear(), m0: d.getMonth() }; });
  }
  function gotoToday() { setCursorYM({ y: today.getFullYear(), m0: today.getMonth() }); }

  function openFormForDate(date: string) {
    setEditingSession(null);
    setFormInitialDate(date);
    setFormOpen(true);
  }
  function openEditForm(session: TrainingSession) {
    setEditingSession(session);
    setFormInitialDate(session.date);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditingSession(null);
  }

  function toggleHistory(date: string) {
    setExpandedHistoryDate((prev) => (prev === date ? null : date));
  }
  function toggleList(date: string) {
    setSelectedDate((prev) => (prev === date ? null : date));
  }

  function sharedDetailProps(date: string, daySessions: TrainingSession[], onClose: () => void) {
    return {
      date,
      sessions: daySessions,
      techniqueByRecordId,
      sequenceByRecordId,
      techniqueByShortId,
      onClose,
      onAdd: () => openFormForDate(date),
      onEdit: openEditForm,
    };
  }

  return (
    <div className="space-y-6 pb-24">

      {/* ── 헤더 — 스트릭 배지를 이모지/오렌지 박스에서 브랜드 앰버 필
          아이콘으로 단순화 (2026-09-19 리뉴얼) ── */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">수련 캘린더</h1>
          <p className="text-text-tertiary mt-1 text-sm font-normal">오늘도 매트 위에서 한 단계 진화</p>
        </div>
        <div className="flex items-center gap-2">
          {streak >= 3 && (
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5"
              style={{ backgroundColor: "#D9772E1F" }}
            >
              <Flame size={13} style={{ color: "#D9772E" }} />
              <span className="text-xs font-bold tabular-nums" style={{ color: "#D9772E" }}>{streak}일</span>
            </div>
          )}

          {/* 뷰 토글 */}
          <div className="flex rounded-xl border border-border-subtle overflow-hidden">
            <button type="button" onClick={() => setViewMode("calendar")}
              className={cn("p-2 transition-colors",
                viewMode === "calendar"
                  ? "bg-brand-primary text-text-inverse"
                  : "bg-bg-elevated text-text-tertiary hover:text-text-primary")}
              aria-label="캘린더 보기">
              <CalendarDays size={16} />
            </button>
            <button type="button" onClick={() => setViewMode("list")}
              className={cn("p-2 transition-colors",
                viewMode === "list"
                  ? "bg-brand-primary text-text-inverse"
                  : "bg-bg-elevated text-text-tertiary hover:text-text-primary")}
              aria-label="리스트 보기">
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 오늘 기록 배너 — 가장 중요한 액션이라 앰버 틴트 박스 +
          원형 플러스 버튼으로 강조 (2026-09-19, 사용자 요청) ── */}
      {!sessionsByDate.has(todayKey) && (
        <button
          type="button"
          onClick={() => openFormForDate(todayKey)}
          className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left active:scale-[0.98] transition-transform duration-fast"
          style={{ backgroundColor: "#D9772E14", border: "1px solid #D9772E3D" }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-xl"
            style={{ width: 44, height: 44, backgroundColor: "#D9772E" }}
          >
            <Dumbbell size={21} style={{ color: "#0A0A0F" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-bold text-text-primary">오늘 수련 기록하기</p>
            <p className="text-[11.5px] font-normal mt-0.5" style={{ color: "#8A8A94" }}>기술 태그 + 디테일 메모 남기기</p>
          </div>
          <div
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{ width: 30, height: 30, backgroundColor: "#D9772E" }}
          >
            <Plus size={16} style={{ color: "#0A0A0F" }} strokeWidth={2.5} />
          </div>
        </button>
      )}
      {sessionsByDate.has(todayKey) && (
        <div
          className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3.5"
          style={{ backgroundColor: "#34D3991F", border: "1px solid #34D3993D" }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-xl"
            style={{ width: 44, height: 44, backgroundColor: "#34D399" }}
          >
            <Check size={21} style={{ color: "#0A0A0F" }} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-bold text-text-primary">오늘 수련 완료!</p>
            <p className="text-[11.5px] font-normal mt-0.5" style={{ color: "#8A8A94" }}>
              {(sessionsByDate.get(todayKey) ?? []).reduce((n, s) => n + s.techniqueRecordIds.length, 0)}개 기술 기록됨
            </p>
          </div>
          <button
            type="button"
            onClick={() => openFormForDate(todayKey)}
            className="flex items-center justify-center shrink-0 rounded-full active:scale-90 transition-transform duration-fast"
            style={{ width: 30, height: 30, backgroundColor: "#34D399" }}
            aria-label="오늘 기록 추가"
          >
            <Plus size={16} style={{ color: "#0A0A0F" }} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── 통계 스트립 — 박스 카드 대신 위아래 구분선 + 세로 구분선으로
          지표 3개를 하나의 묶음으로 시각화 (2026-09-19 리뉴얼) ── */}
      <section
        className="flex"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0" }}
      >
        <div className="flex-1 text-center">
          <Flame size={16} className="inline-block" style={{ color: streak > 0 ? "#D9772E" : "#5A5A64" }} />
          <p className="text-[17px] font-bold mt-1" style={{ color: streak > 0 ? "#D9772E" : "#5A5A64" }}>{streak}일</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#8A8A94" }}>연속</p>
        </div>
        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1 text-center">
          <Activity size={16} className="inline-block" style={{ color: "#8A8A94" }} />
          <p className="text-[17px] font-bold mt-1 text-text-primary">{monthStats.days}일</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#8A8A94" }}>이번 달</p>
        </div>
        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1 text-center">
          <Trophy size={16} className="inline-block" style={{ color: "#8A8A94" }} />
          <p className="text-[17px] font-bold mt-1 text-text-primary">{monthStats.xp.toLocaleString()}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#8A8A94" }}>이번 달 XP</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          캘린더 뷰
      ════════════════════════════════════════ */}
      {viewMode === "calendar" && (
        <>
          {/* 월 네비 */}
          <section className="flex items-center justify-between">
            <button type="button" onClick={gotoPrev}
              className="size-9 rounded-xl border border-border-subtle hover:border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-fast" aria-label="이전 달">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tabular-nums">{monthLabel}</h2>
              <button type="button" onClick={gotoToday}
                className="text-xs text-text-tertiary hover:text-brand-primary px-2 py-1 rounded-lg border border-border-subtle transition-colors duration-fast">
                오늘
              </button>
            </div>
            <button type="button" onClick={gotoNext}
              className="size-9 rounded-xl border border-border-subtle hover:border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-fast" aria-label="다음 달">
              <ChevronRight size={18} />
            </button>
          </section>

          {/* 캘린더 그리드 */}
          <section className="rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border-subtle">
              {WEEKDAYS.map((d, i) => (
                <div key={d} className={cn("text-[11px] font-medium text-center py-2",
                  i === 0 ? "text-danger/80" : i === 6 ? "text-info/80" : "text-text-tertiary")}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((d, i) => {
                const key        = ymd(d);
                const inMonth    = d.getMonth() === cursorYM.m0;
                const isToday    = key === todayKey;
                const isSelected = key === selectedDate;
                const dayList    = sessionsByDate.get(key) ?? [];
                const totalTechs = dayList.reduce((n, s) => n + s.techniqueRecordIds.length, 0);
                const totalSeqs  = dayList.reduce((n, s) => n + s.sequenceRecordIds.length, 0);
                const hasSession = dayList.length > 0;
                const dow        = d.getDay();
                return (
                  <button type="button" key={i} onClick={() => setSelectedDate(key)}
                    className={cn(
                      "aspect-square min-h-[64px] flex flex-col items-stretch justify-between p-1.5 text-left border-r border-b border-border-subtle last:border-r-0 transition-colors",
                      i % 7 === 6 && "border-r-0",
                      i >= 35   && "border-b-0",
                      inMonth ? "bg-bg-elevated" : "bg-[rgba(10,10,15,0.5)]",
                      isSelected && "bg-brand-subtle border-brand-primary",
                      !isSelected && "hover:bg-bg-hover",
                    )}>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[12px] tabular-nums font-medium",
                        !inMonth && "text-text-disabled",
                        inMonth && dow === 0 && "text-danger/90",
                        inMonth && dow === 6 && "text-info/90",
                        inMonth && dow !== 0 && dow !== 6 && "text-text-secondary",
                        isToday && "inline-flex items-center justify-center size-5 rounded-full bg-brand-primary text-text-inverse",
                      )}>
                        {d.getDate()}
                      </span>
                    </div>
                    {hasSession && inMonth && (
                      <div className="flex items-center justify-center gap-2 pb-0.5">
                        {totalTechs > 0 && (
                          <span className="size-1 rounded-full shrink-0" style={{ backgroundColor: "#D9772E" }} />
                        )}
                        {totalSeqs > 0 && (
                          <span className="size-1 rounded-full shrink-0" style={{ backgroundColor: "#8A8A94" }} />
                        )}
                      </div>
                    )}
                    {hasSession && !inMonth && (
                      <div className="size-1 rounded-full self-center" style={{ backgroundColor: "#D9772E66" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 선택된 날짜 디테일 */}
          {selectedDate && (
            <SessionDetailSheet
              {...sharedDetailProps(selectedDate, selectedSessions, () => setSelectedDate(null))}
            />
          )}

          {sessions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border-default p-6 text-center">
              <p className="text-sm text-text-secondary">아직 기록된 수련이 없어요.</p>
              <p className="text-xs text-text-tertiary mt-1">아래 + 버튼으로 첫 수련을 기록해보세요.</p>
            </div>
          )}

          {/* ── 최근 수련 히스토리 — 박스 카드 제거, 헤어라인 플랫 리스트
              (2026-09-19 리뉴얼) ── */}
          {recentEntries.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 mb-1">
                <Activity size={14} className="text-text-tertiary" />
                <h3 className="text-[13px] font-bold text-text-primary">최근 수련</h3>
              </div>
              <div>
                {recentEntries.map(({ date, sessions: daySessions }, i) => {
                  const totalTechs = daySessions.reduce((n, s) => n + s.techniqueRecordIds.length, 0);
                  const totalSeqs  = daySessions.reduce((n, s) => n + s.sequenceRecordIds.length, 0);
                  const totalXp    = daySessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
                  const isOpen     = expandedHistoryDate === date;
                  const metaParts  = [
                    totalTechs > 0 ? `${totalTechs}기술` : null,
                    totalSeqs > 0 ? `${totalSeqs}게임플랜` : null,
                  ].filter(Boolean);

                  return (
                    <div key={date}>
                      <button
                        type="button"
                        onClick={() => toggleHistory(date)}
                        className="w-full flex items-center justify-between gap-2 py-2.5 text-left active:opacity-70 transition-opacity duration-fast"
                        style={{
                          borderBottom: !isOpen && i < recentEntries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-normal text-text-primary">{formatListDate(date, todayKey)}</p>
                          {metaParts.length > 0 && (
                            <p className="text-[10.5px] font-normal mt-0.5" style={{ color: "#8A8A94" }}>{metaParts.join(" · ")}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11.5px] font-bold tabular-nums" style={{ color: "#D9772E" }}>+{totalXp.toLocaleString()} XP</span>
                          <ChevronDown size={13} className={cn("text-text-tertiary transition-transform duration-base", isOpen && "rotate-180")} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="pb-2">
                          <SessionDetailSheet
                            {...sharedDetailProps(date, daySessions, () => setExpandedHistoryDate(null))}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          리스트 뷰 — 박스 카드 제거, 헤어라인 플랫 리스트 (2026-09-19 리뉴얼)
      ════════════════════════════════════════ */}
      {viewMode === "list" && (
        <section>
          {sortedEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default p-6 text-center">
              <p className="text-sm text-text-secondary">아직 기록된 수련이 없어요.</p>
              <p className="text-xs text-text-tertiary mt-1">+ 버튼으로 첫 수련을 기록해보세요.</p>
            </div>
          ) : (
            sortedEntries.map(({ date, sessions: daySessions }, i) => {
              const totalTechs = daySessions.reduce((n, s) => n + s.techniqueRecordIds.length, 0);
              const totalSeqs  = daySessions.reduce((n, s) => n + s.sequenceRecordIds.length, 0);
              const totalXp    = daySessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
              const isOpen     = selectedDate === date;
              const metaParts  = [
                totalTechs > 0 ? `${totalTechs}기술` : null,
                totalSeqs > 0 ? `${totalSeqs}게임플랜` : null,
              ].filter(Boolean);

              return (
                <div key={date}>
                  <button
                    type="button"
                    onClick={() => toggleList(date)}
                    className="w-full flex items-center justify-between gap-2 py-2.5 text-left active:opacity-70 transition-opacity duration-fast"
                    style={{
                      borderBottom: !isOpen && i < sortedEntries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-text-primary">{formatListDate(date, todayKey)}</p>
                      {metaParts.length > 0 && (
                        <p className="text-[10.5px] font-normal mt-0.5" style={{ color: "#8A8A94" }}>{metaParts.join(" · ")}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11.5px] font-bold tabular-nums" style={{ color: "#D9772E" }}>+{totalXp.toLocaleString()} XP</span>
                      <ChevronDown size={13} className={cn("text-text-tertiary transition-transform duration-base", isOpen && "rotate-180")} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pb-2">
                      <SessionDetailSheet
                        {...sharedDetailProps(date, daySessions, () => setSelectedDate(null))}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {/* + FAB */}
      <button type="button" onClick={() => openFormForDate(selectedDate ?? todayKey)}
        className="fixed right-4 bottom-20 lg:bottom-6 lg:right-6 z-overlay size-14 rounded-full bg-brand-primary text-text-inverse shadow-glow hover:bg-brand-hover active:bg-brand-pressed transition-all duration-base flex items-center justify-center"
        aria-label="수련 기록">
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* 기록 / 수정 모달 */}
      {formOpen && (
        <SessionFormModal
          initialDate={formInitialDate}
          techniques={techniques}
          techniqueByShortId={techniqueByShortId}
          goalTechRecordIds={goalTechRecordIds}
          initialSession={editingSession ?? undefined}
          sessions={sessions}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
