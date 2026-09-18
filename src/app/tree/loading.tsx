import { Skeleton } from "@/components/ui/Skeleton";

/**
 * /tree 및 하위 전체(선수 목록/포지션 목록/선수 상세/포지션 상세/기술 상세)가
 * 공유하는 단일 loading.tsx. 예전엔 "포지션 컬럼 4개 x 카드 7개" 그리드
 * 스켈레톤이었는데, 이건 2026-09-14 선수 중심 개편 이전 드릴다운 레이아웃용이라
 * 지금의 어떤 /tree 하위 페이지와도 모양이 안 맞아서(로딩→실제 콘텐츠 전환 시
 * 레이아웃이 확 바뀌는 문제) 전 페이지 공통 뼈대인
 * "헤더 카드 + 세로 리스트" 형태로 교체 (2026-09-18).
 */
export default function TreeLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 pb-20">
      {/* 뒤로가기/탭 자리 */}
      <Skeleton className="h-4 w-24 rounded mb-4" />

      {/* 헤더 카드 */}
      <div className="rounded-2xl p-5 mb-6 space-y-3" style={{ backgroundColor: "var(--bg-elevated)" }}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-3 w-44 rounded" />
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>

      {/* 섹션 라벨 */}
      <Skeleton className="h-3 w-20 rounded mb-2" />

      {/* 세로 리스트 (선수/포지션/기술 목록 공통 형태) */}
      <div className="space-y-2.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl p-3.5"
            style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/5 rounded" />
              <Skeleton className="h-2.5 w-1/4 rounded" />
            </div>
            <Skeleton className="h-3 w-8 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
