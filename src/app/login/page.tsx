"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-black tracking-tight">BJJ 스킬트리</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-bg-elevated p-3 text-sm text-text-primary outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-bg-elevated p-3 text-sm text-text-primary outline-none"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {mode === "signin" ? "로그인" : "회원가입"}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm rounded-xl border border-border-subtle py-3 text-sm font-bold text-text-primary"
      >
        구글로 계속하기
      </button>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="text-xs text-text-tertiary"
      >
        {mode === "signin"
          ? "계정이 없나요? 회원가입"
          : "이미 계정이 있나요? 로그인"}
      </button>
    </div>
  );
}
