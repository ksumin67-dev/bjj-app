import { Skeleton } from "@/components/ui/Skeleton";

export default function CalendarLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl lg:max-w-4xl px-4 py-6 pb-24 space-y-4">
      {/* 페이지 헤더 */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-28 rounded-lg" />
        <Skeleton className="h-3.5 w-44 rounded" />
      </div>

      {/* CTA 배너 */}
      <Skeleton className="h-16 w-full rounded-2xl" />

      {/* 스탯 칩 3개 */}
      <div className="flex gap-2">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 flex-1 rounded-2xl" />
      </div>

      {/* 캘린더 컨테이너 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-2 py-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="flex justify-center">
              <Skeleton className="h-3.5 w-4 rounded" />
            </div>
          ))}
        </div>

        {/* 날짜 그리드 5주 */}
        <div className="grid grid-cols-7 gap-px px-2 pb-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center py-1.5 gap-1">
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
