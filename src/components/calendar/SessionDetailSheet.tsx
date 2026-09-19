"use client";

import { useTransition } from "react";
import Link from "next/link";
import { X, Plus, Trash2, Trophy, Pencil, Star } from "lucide-react";
import type { TrainingSession, Technique, Sequence } from "@/types/domain";
import { deleteTrainingSessionAction } from "@/lib/actions/trainingSessions";
import { TypeChip } from "@/components/tree/TypeChip";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/ToastContext";

function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  const dt  = new Date(y, m - 1, d);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

export function SessionDetailSheet({
  date,
  sessions,
  techniqueByRecordId,
  sequenceByRecordId,
  techniqueByShortId,
  onClose,
  onAdd,
  onEdit,
}: {
  date: string;
  sessions: TrainingSession[];
  techniqueByRecordId: Map<string, Technique>;
  sequenceByRecordId: Map<string, Sequence>;
  techniqueByShortId: Record<string, Technique>;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (session: TrainingSession) => void;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const totalXp = sessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
  const isEmpty = sessions.length === 0;

  function handleDelete(sessionId: string) {
    if (!confirm("이 수련 기록을 삭제할까요?\n(기술도감 카운트는 자동 차감되지 않음)")) return;
    startTransition(async () => {
      try {
        await deleteTrainingSessionAction(sessionId);
        toast.show("success", "수련 기록이 삭제됐습니다.");
      } catch (e) {
        console.error("[delete session]", e);
        toast.show("error", "삭제에 실패했습니다.");
      }
    });
  }

  return (
    <section
      className="rounded-2xl bg-bg-elevated border border-border-subtle overflow-hidden"
      aria-label={`${formatDate(date)} 수련 상세`}
    >
      <header className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="font-semibold truncate">{formatDate(date)}</h3>
          {totalXp > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-brand-primary tabular-nums">
              <Trophy size={12} />
              {totalXp.toLocaleString()} XP
            </span>
          )}
        </div>
        <button type="button" onClick={onClose}
          className="size-8 rounded-xl hover:bg-bg-hover active:scale-95 flex items-center justify-center text-text-tertiary transition-all duration-fast" aria-label="닫기">
          <X size={16} />
        </button>
      </header>

      {isEmpty ? (
        <div className="p-6 text-center space-y-3">
          <p className="text-sm text-text-secondary">이 날엔 기록이 없어요.</p>
          <button type="button" onClick={onAdd}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-brand-primary text-text-inverse text-sm font-semibold hover:bg-brand-hover active:scale-[0.97] transition-all duration-fast">
            <Plus size={16} strokeWidth={2.5} />
            이 날에 기록하기
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {sessions.map((session) => {
            const techList = session.techniqueRecordIds
              .map((id) => techniqueByRecordId.get(id))
              .filter((t): t is Technique => Boolean(t));
            const seqList = session.sequenceRecordIds
              .map((id) => sequenceByRecordId.get(id))
              .filter((s): s is Sequence => Boolean(s));

            return (
              <article key={session.recordId} className="p-4 space-y-3">
                {/* 헤더: XP + 수정/삭제 버튼 */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-text-tertiary tabular-nums">
                    +{(session.xpEarned ?? 0).toLocaleString()} XP
                  </span>
                  <div className="flex items-center gap-1">
                    {/* 수정 버튼 */}
                    <button type="button" onClick={() => onEdit(session)} disabled={pending}
                      className="size-7 rounded-lg text-text-tertiary hover:bg-brand-subtle/40 hover:text-brand-primary flex items-center justify-center disabled:opacity-50 transition-colors duration-fast"
                      aria-label="세션 수정">
                      <Pencil size={13} />
                    </button>
                    {/* 삭제 버튼 */}
                    <button type="button" onClick={() => handleDelete(session.recordId)} disabled={pending}
                      className="size-7 rounded-lg text-text-tertiary hover:bg-danger/10 hover:text-danger flex items-center justify-center disabled:opacity-50 transition-colors duration-fast"
                      aria-label="세션 삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {techList.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">기술 ({techList.length})</div>
                    <div className="space-y-1.5">
                      {techList.map((t) => {
                        const parentName = t.parentId ? techniqueByShortId[t.parentId]?.nameKo : undefined;
                        const posId = t.parentId ?? undefined;
                        return (
                          <Link key={t.recordId}
                            href={posId ? `/tree/${posId}/${t.id}` : `/tree`}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-base hover:bg-bg-hover transition-colors duration-fast">
                            <span className="font-mono text-[10px] text-text-tertiary">{t.id}</span>
                            <span className="text-sm flex-1 truncate">{t.nameKo}</span>
                            <TypeChip type={t.type} />
                            {parentName && (
                              <span className="text-[10px] text-text-tertiary hidden sm:inline">{parentName}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {seqList.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">게임플랜 ({seqList.length})</div>
                    <div className="space-y-1.5">
                      {seqList.map((s) => (
                        <Link key={s.recordId} href={`/sequences/${s.recordId}`}
                          className="flex items-center gap-1.5 p-2.5 rounded-xl bg-bg-base hover:bg-bg-hover transition-colors duration-fast">
                          {s.isPrimary && <Star size={11} className="text-brand-primary shrink-0" fill="currentColor" />}
                          <span className="text-sm flex-1 truncate">{s.seqName}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {session.notes && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">메모</div>
                    <p className="text-sm text-text-secondary whitespace-pre-wrap p-3 rounded-xl bg-bg-base">
                      {session.notes}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
          <div className="p-3">
            <button type="button" onClick={onAdd}
              className={cn("w-full h-10 rounded-xl border border-dashed border-border-default text-sm text-text-secondary hover:bg-bg-hover hover:border-border-strong inline-flex items-center justify-center gap-1.5 transition-colors duration-fast")}>
              <Plus size={14} />이 날에 추가 기록
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
