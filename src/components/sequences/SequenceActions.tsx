"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { setPrimaryAction, deleteSequenceAction } from "@/lib/actions/sequences";
import { useToast } from "@/contexts/ToastContext";

export function SequenceActions({
  recordId,
  seqName,
  isPrimary,
}: {
  recordId: string;
  seqName: string;
  isPrimary: boolean;
}) {
  const [primaryPending, startPrimary] = useTransition();
  const [delPending, startDel] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleTogglePrimary() {
    startPrimary(async () => {
      try {
        await setPrimaryAction(recordId, !isPrimary);
        toast.show("success", isPrimary ? "주력 표시를 해제했습니다." : "주력 기술로 표시했습니다.");
      } catch {
        toast.show("error", "변경에 실패했습니다.");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`"${seqName}"을 삭제할까요?`)) return;
    startDel(async () => {
      try {
        await deleteSequenceAction(recordId);
        toast.show("success", "게임플랜이 삭제됐습니다.");
        router.push("/sequences");
      } catch {
        toast.show("error", "삭제에 실패했습니다.");
      }
    });
  }

  return (
    <section className="space-y-2.5 pt-2">
      <button
        type="button"
        onClick={handleTogglePrimary}
        disabled={primaryPending}
        className="w-full py-3 rounded-xl font-bold text-[14px] hover:brightness-110 active:scale-[0.97] transition-all duration-fast inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          isPrimary
            ? { backgroundColor: "#D9772E", color: "#fff" }
            : { backgroundColor: "transparent", border: "1px solid rgba(217,119,46,0.4)", color: "#D9772E" }
        }
      >
        <Star size={16} fill={isPrimary ? "#fff" : "none"} />
        {primaryPending ? "변경 중…" : isPrimary ? "주력 기술 해제" : "주력 기술로 표시"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={delPending}
        className="w-full py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-danger hover:bg-danger/10 hover:border-danger/40 active:scale-[0.97] transition-all duration-fast inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={16} />
        {delPending ? "삭제 중…" : "게임플랜 삭제"}
      </button>
    </section>
  );
}
