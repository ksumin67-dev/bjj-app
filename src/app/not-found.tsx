import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[17px] font-bold text-text-primary">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-[13px] text-text-secondary">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Link
        href="/"
        className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-semibold text-black"
      >
        홈으로
      </Link>
    </div>
  );
}
