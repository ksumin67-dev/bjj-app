"use client";

import { useState, type FormEvent } from "react";
import { deleteAccountAction } from "@/lib/actions/account";

/** 로그인한 사용자의 확인 폼. 삭제는 deleteAccountAction 한 곳만 호출한다. */
export function DeleteAccountConfirm({ email }: { email: string | null }) {
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed || pending) return;
    setError(null);
    setPending(true);
    const res = await deleteAccountAction();
    if (res.ok) {
      window.location.href = "/login?deleted=1";
      return;
    }
    setPending(false);
    setError(res.error ?? "계정 삭제에 실패했습니다.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-4">
      <p className="text-sm text-text-secondary">
        {email ? (
          <>
            로그인한 계정: <span className="font-semibold text-text-primary">{email}</span>
          </>
        ) : (
          "로그인된 계정으로 삭제를 진행합니다."
        )}
      </p>
      <label className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-1"
        />
        <span>삭제가 영구적이며 복구할 수 없음을 이해했습니다.</span>
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!confirmed || pending}
        className="w-full rounded-xl bg-danger py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {pending ? "삭제 중…" : "계정을 영구 삭제"}
      </button>
    </form>
  );
}
