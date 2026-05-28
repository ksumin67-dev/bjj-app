import { Skeleton } from "@/components/ui/Skeleton";

export default function SequenceDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl px-4 py-6 pb-24 space-y-4">
      {/* 뒤로가기 + 제목 */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>

      {/* 스탯 카드 2열 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <Skeleton className="h-3.5 w-12 rounded" />
          <Skeleton className="h-8 w-10 rounded-lg" />
        </div>
        <div className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
      </div>

      {/* 기술 플로우 */}
      <div className="rounded-2xl p-4 space-y-4" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
        <Skeleton className="h-4 w-32 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: "var(--bg-base)" }}
            >
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full shrink-0" />
            </div>
            {i < 3 && <div className="flex justify-center"><Skeleton className="h-4 w-4 rounded" /></div>}
          </div>
        ))}
      </div>

      {/* 액션 버튼 */}
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
