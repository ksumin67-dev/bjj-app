"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * 라우트 단위 에러 화면.
 * Airtable/Supabase 지연·장애로 서버 렌더링이 실패했을 때 기본 에러 페이지 대신 표시.
 * 내부 오류 내용은 화면에 노출하지 않는다(digest만 로그로 남김).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error.digest ?? "");
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[17px] font-bold text-text-primary">
        잠시 문제가 생겼어요
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        데이터를 불러오지 못했습니다. 네트워크 상태를 확인하고
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-semibold text-black"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/15 px-4 py-2 text-[13px] text-text-primary"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
