"use client";

import { useState, type FormEvent } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          새 비밀번호 설정
        </h1>
        <p className="text-[12px] text-text-tertiary mt-2">
          새로 사용할 비밀번호를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="새 비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-bg-elevated border border-border-subtle pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-disabled outline-none focus:border-border-focus transition-colors duration-fast"
          />
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="새 비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl bg-bg-elevated border border-border-subtle pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-disabled outline-none focus:border-border-focus transition-colors duration-fast"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/30 px-3 py-2.5">
            <AlertCircle size={14} className="text-danger shrink-0" />
            <p className="text-xs text-danger">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-text-inverse hover:bg-brand-hover active:scale-[0.98] transition-all duration-fast disabled:opacity-50"
        >
          {loading ? "저장 중…" : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
