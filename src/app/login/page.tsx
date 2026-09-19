"use client";

import { useState, type FormEvent } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/";
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // 성공 시 구글 페이지로 리다이렉트되므로 별도 로딩 해제 불필요
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      {/* 브랜드 마크 — 워드마크를 크게, 부가 아이콘 없이 */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          grapp<span className="text-brand-primary">log</span>
        </h1>
        <p className="text-[12px] text-text-tertiary mt-2">주짓수 스킬 로그</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-bg-elevated border border-border-subtle pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-disabled outline-none focus:border-border-focus transition-colors duration-fast"
          />
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading
            ? (mode === "signin" ? "로그인 중…" : "가입 중…")
            : (mode === "signin" ? "로그인" : "회원가입")}
        </button>
      </form>

      <div className="w-full max-w-sm flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-[11px] text-text-tertiary">또는</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full max-w-sm rounded-xl border border-border-subtle py-3 text-sm font-bold text-text-primary hover:bg-bg-hover active:scale-[0.98] transition-all duration-fast disabled:opacity-50"
      >
        {googleLoading ? "연결 중…" : "구글로 계속하기"}
      </button>

      <button
        type="button"
        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
        className="text-xs text-text-tertiary"
      >
        {mode === "signin"
          ? "계정이 없나요? 회원가입"
          : "이미 계정이 있나요? 로그인"}
      </button>
    </div>
  );
}
