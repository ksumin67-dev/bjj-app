import { Skeleton } from "@/components/ui/Skeleton";

export default function TreeLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 헤더 바 */}
      <div className="px-4 pt-5 pb-3 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-5 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-3.5 w-40 rounded" />
      </div>

      {/* 스트림 필터 탭 */}
      <div className="px-4 pb-3 shrink-0">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="px-4 pb-3 shrink-0 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" />
        ))}
        <div className="flex-1 flex items-center">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* 포지션 컬럼 그리드 */}
      <div className="flex-1 overflow-x-auto px-3 pb-24">
        <div className="flex gap-3 h-full min-w-max">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="w-[160px] shrink-0 space-y-2.5">
              {/* 포지션 헤더 */}
              <Skeleton className="h-9 w-full rounded-xl" />
              {/* 기술 카드 7개 */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 space-y-2"
                  style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-3.5 flex-1 rounded" />
                    <Skeleton className="h-3 w-6 rounded shrink-0" />
                  </div>
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
