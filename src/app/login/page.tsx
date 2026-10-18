"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage, authRedirectErrorMessage } from "@/lib/authErrors";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [isNativeApp, setIsNativeApp] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // 인증 링크 처리 실패 시 /login?error=... 로 돌아옴 — 사유를 보여줌
    const params = new URLSearchParams(window.location.search);
    const msg = authRedirectErrorMessage(params.get("error"));
    if (msg) setError(msg);

    // 앱(Capacitor 웹뷰)에서는 구글이 웹뷰 로그인을 막으므로 구글 버튼 숨김
    const cap = (window as unknown as {
      Capacitor?: { isNativePlatform?: () => boolean };
    }).Capacitor;
    setIsNativeApp(Boolean(cap?.isNativePlatform?.()));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (password !== passwordConfirm) {
        setError("비밀번호가 일치하지 않아요.");
        return;
      }
      if (!agreed) {
        setError("이용약관과 개인정보처리방침에 동의해 주세요.");
        return;
      }
    }

    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      setLoading(false);
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      setResetSent(true);
      return;
    }

    const { data, error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          });

    setLoading(false);

    if (error) {
      setError(authErrorMessage(error));
      setNeedsConfirm(error.code === "email_not_confirmed");
      return;
    }
    setNeedsConfirm(false);

    // 이미 가입된 이메일로 다시 가입하면 Supabase는 에러 없이 identities가 빈
    // 사용자를 돌려줌(계정 존재 여부 노출 방지). 메일은 가지 않으므로 안내 필요.
    if (
      mode === "signup" &&
      data.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    ) {
      setError("이미 가입된 이메일이에요. 로그인하거나 비밀번호를 재설정해 주세요.");
      return;
    }

    // 이메일 확인이 필요한 프로젝트 설정이면 가입 직후 세션이 없음 —
    // 이 경우 홈으로 보내지 않고 "이메일을 확인해주세요" 안내로 전환.
    if (mode === "signup" && !data.session) {
      setSignupSent(true);
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
      setError(authErrorMessage(error));
      setGoogleLoading(false);
    }
    // 성공 시 구글 페이지로 리다이렉트되므로 별도 로딩 해제 불필요
  }

  async function handleResend() {
    setResendMsg(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setResendMsg(authErrorMessage(error));
      return;
    }
    setResendMsg("인증 메일을 다시 보냈어요. 스팸함도 확인해 주세요.");
  }

  function switchMode(next: "signin" | "signup" | "forgot") {
    setMode(next);
    setError(null);
    setNeedsConfirm(false);
    setResendMsg(null);
    setPassword("");
    setPasswordConfirm("");
    setAgreed(false);
  }

  function backToSignin() {
    switchMode("signin");
    setSignupSent(false);
    setResetSent(false);
  }

  const MODE_TITLE = {
    signin: { title: "로그인", desc: "이메일과 비밀번호로 로그인하세요." },
    signup: { title: "회원가입", desc: "이메일과 비밀번호를 입력해 계정을 만들어요." },
    forgot: {
      title: "비밀번호 찾기",
      desc: "가입한 이메일을 입력하면 재설정 링크를 보내드려요.",
    },
  } as const;

  const showSuccessScreen = signupSent || resetSent;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      {/* 브랜드 마크 — 워드마크를 크게, 부가 아이콘 없이 */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          grapp<span className="text-brand-primary">log</span>
        </h1>
        <p className="text-[12px] text-text-tertiary mt-2">주짓수 스킬 로그</p>
      </div>

      {showSuccessScreen ? (
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-brand-subtle border border-border-subtle px-4 py-6">
            <CheckCircle2 size={22} className="text-brand-primary" />
            <p className="text-sm text-text-primary font-semibold">
              {signupSent ? "확인 이메일을 보냈어요" : "재설정 링크를 보냈어요"}
            </p>
            <p className="text-xs text-text-tertiary leading-relaxed">
              {email}로 보낸 메일의 링크를 눌러
              {signupSent ? " 가입을 완료해주세요." : " 새 비밀번호를 설정해주세요."}
            </p>
            <p className="text-[11px] text-text-disabled leading-relaxed">
              메일이 안 보이면 스팸함을 확인해 주세요. 링크는 휴대폰 브라우저에서
              열릴 수 있어요. 완료한 뒤 이 앱으로 돌아와 로그인해 주세요.
            </p>
          </div>
          {signupSent && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleResend}
                className="text-xs text-brand-primary"
              >
                인증 메일 다시 받기
              </button>
              {resendMsg && (
                <p className="text-[11px] text-text-tertiary">{resendMsg}</p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={backToSignin}
            className="text-xs text-text-tertiary"
          >
            로그인으로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-text-primary">
              {MODE_TITLE[mode].title}
            </h2>
            <p className="mt-1 text-[12px] text-text-tertiary">
              {MODE_TITLE[mode].desc}
            </p>
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
            {mode !== "forgot" && (
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
            )}

            {mode === "signup" && (
              <>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full rounded-xl bg-bg-elevated border border-border-subtle pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-disabled outline-none focus:border-border-focus transition-colors duration-fast"
                  />
                </div>
                <label className="flex items-start gap-2 text-[11px] text-text-tertiary leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-[var(--brand-primary,#F59E0B)]"
                  />
                  <span>
                    <Link href="/terms" className="underline">이용약관</Link>과{" "}
                    <Link href="/privacy" className="underline">개인정보처리방침</Link>에
                    동의합니다.
                  </span>
                </label>
              </>
            )}

            {mode === "signin" && (
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="block ml-auto text-[11px] text-text-tertiary"
              >
                비밀번호를 잊으셨나요?
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/30 px-3 py-2.5">
                <AlertCircle size={14} className="text-danger shrink-0" />
                <p className="text-xs text-danger">{error}</p>
              </div>
            )}
            {needsConfirm && (
              <div className="text-center space-y-1">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs text-brand-primary"
                >
                  인증 메일 다시 받기
                </button>
                {resendMsg && (
                  <p className="text-[11px] text-text-tertiary">{resendMsg}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-text-inverse hover:bg-brand-hover active:scale-[0.98] transition-all duration-fast disabled:opacity-50"
            >
              {loading
                ? (mode === "signin" ? "로그인 중…" : mode === "signup" ? "가입 중…" : "전송 중…")
                : (mode === "signin" ? "로그인" : mode === "signup" ? "회원가입" : "재설정 링크 보내기")}
            </button>
          </form>

          {mode !== "forgot" && !isNativeApp && (
            <>
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
            </>
          )}

          <div className="w-full max-w-sm text-center space-y-2">
            <p className="text-[11px] text-text-tertiary">
              {mode === "signin"
                ? "아직 계정이 없나요?"
                : mode === "signup"
                  ? "이미 계정이 있나요?"
                  : ""}
            </p>
            <button
              type="button"
              onClick={() => {
                if (mode === "forgot") { backToSignin(); return; }
                switchMode(mode === "signin" ? "signup" : "signin");
              }}
              className="w-full rounded-xl border border-border-subtle py-3 text-sm font-bold text-brand-primary hover:bg-bg-hover active:scale-[0.98] transition-all duration-fast"
            >
              {mode === "signin"
                ? "회원가입 하기"
                : mode === "signup"
                  ? "로그인 하기"
                  : "로그인으로 돌아가기"}
            </button>
          </div>
        </>
      )}

      <p className="text-[10px] text-text-disabled">
        <Link href="/terms" className="hover:text-text-tertiary">이용약관</Link>
        {" · "}
        <Link href="/privacy" className="hover:text-text-tertiary">개인정보처리방침</Link>
      </p>
    </div>
  );
}
