import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/lib/supportContact";

const DELETED_ITEMS = [
  "로그인 계정(이메일)",
  "프로필 — 닉네임, 벨트, 올린 프로필 사진",
  "수련 기록, 게임플랜, 학습 목표",
  "직접 입력한 기술 이름",
];

const LOGIN_NEXT = `/login?next=${encodeURIComponent("/account/delete")}`;

/**
 * /account/delete 본문. 로그인 여부와 관계없이 삭제 범위와 문의 이메일을 보여 준다.
 * 실제 삭제는 인앱과 같은 서버 액션(confirm)만 호출한다.
 */
export function AccountDeleteView({
  signedIn,
  confirm,
}: {
  signedIn: boolean;
  confirm?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-16 space-y-6">
      <Link
        href={signedIn ? "/profile" : "/login"}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        {signedIn ? "프로필로 돌아가기" : "로그인으로 돌아가기"}
      </Link>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">계정 삭제</h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          그래플로그 계정을 삭제하면 아래 데이터가 서버에서 지워지며 되돌릴 수 없습니다.
          앱 프로필 화면의 계정 삭제와 같은 동작입니다.
        </p>
      </header>

      <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
        {DELETED_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {signedIn ? (
        confirm
      ) : (
        <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            이 페이지에서 계정을 지우려면 먼저 본인 계정으로 로그인해야 합니다.
          </p>
          <Link
            href={LOGIN_NEXT}
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-primary py-3 text-sm font-bold text-text-inverse"
          >
            로그인하고 계속
          </Link>
        </div>
      )}

      <section className="space-y-2 text-sm leading-relaxed text-text-secondary">
        <h2 className="font-semibold text-text-primary">직접 삭제가 어려우면</h2>
        <p>
          로그인할 수 없으면 아래 이메일로 계정 삭제를 요청해 주세요.
          <br />
          <a className="text-text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
