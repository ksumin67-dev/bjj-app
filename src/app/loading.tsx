import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="px-4 pt-5 pb-24 space-y-4" style={{ paddingTop: "max(20px, env(safe-area-inset-top) + 12px)" }}>
      {/* 헤더: 벨트 + XP */}
      <div className="flex items-center justify-between px-0 py-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* 오늘 수련 CTA */}
      <Skeleton className="h-16 w-full rounded-2xl" />

      {/* 스탯 칩 3개 */}
      <div className="flex gap-2">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 flex-1 rounded-2xl" />
      </div>

      {/* 스트림 강도 카드 */}
      <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
        <Skeleton className="h-4 w-28 rounded-lg" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-5 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* 약점 카드 */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* 최근 기술 리스트 */}
      <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
        <Skeleton className="h-4 w-32 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
