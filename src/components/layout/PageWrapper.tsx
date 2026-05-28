/**
 * PageWrapper — 일반 페이지에 공통 패딩/맥스너비 부여.
 * 스킬트리처럼 풀스크린이 필요한 페이지는 이 컴포넌트를 사용하지 않음.
 */
export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl px-4 py-6 pb-24 lg:pb-8">
      {children}
    </div>
  );
}
