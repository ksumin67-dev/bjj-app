import { Skeleton } from "@/components/ui/Skeleton";

export default function SequencesLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl px-4 py-6 pb-24 space-y-4">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* 게임플랜 카드 목록 */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-4 space-y-3"
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
        >
          {/* 카드 헤더 */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-xl shrink-0" />
          </div>

          {/* 기술 플로우 스텝 */}
          <div className="space-y-1.5">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded shrink-0" />
                <Skeleton className="h-3.5 flex-1 rounded" style={{ width: `${55 + j * 10}%` }} />
              </div>
            ))}
          </div>

          {/* 성공 카운트 */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
