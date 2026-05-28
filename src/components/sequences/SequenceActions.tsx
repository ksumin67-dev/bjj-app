"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Trash2 } from "lucide-react";
import { incrementSuccessAction, deleteSequenceAction } from "@/lib/actions/sequences";
import { useToast } from "@/contexts/ToastContext";

export function SequenceActions({
  recordId,
  seqName,
}: {
  recordId: string;
  seqName: string;
}) {
  const [incPending, startInc] = useTransition();
  const [delPending, startDel] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleSuccess() {
    startInc(async () => {
      try {
        await incrementSuccessAction(recordId);
        toast.show("success", `${seqName} 성공 기록!`);
        // revalidatePath in server action handles cache invalidation
        // No router.refresh() needed — avoids re-mounting ToastProvider
      } catch {
        toast.show("error", "기록에 실패했습니다.");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`"${seqName}"을 삭제할까요?`)) return;
    startDel(async () => {
      try {
        await deleteSequenceAction(recordId);
        toast.show("success", "시퀀스가 삭제됐습니다.");
        router.push("/sequences");
      } catch {
        toast.show("error", "삭제에 실패했습니다.");
      }
    });
  }

  return (
    <section className="space-y-3 pt-2">
      <button
        type="button"
        onClick={handleSuccess}
        disabled={incPending}
        className="w-full py-3 rounded-xl bg-brand-primary text-text-inverse font-bold text-[14px] hover:bg-brand-hover active:scale-[0.97] transition-all duration-fast inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trophy size={18} strokeWidth={2.5} />
        {incPending ? "기록 중…" : "오늘 성공 +1"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={delPending}
        className="w-full py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-danger hover:bg-danger/10 hover:border-danger/40 active:scale-[0.97] transition-all duration-fast inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={16} />
        {delPending ? "삭제 중…" : "시퀀스 삭제"}
      </button>
    </section>
  );
}
