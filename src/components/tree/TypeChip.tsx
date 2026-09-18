import type { TechniqueType } from "@/types/domain";
import { cn } from "@/lib/utils";

/**
 * (2026-09-19) 예전엔 bg-type-sweep/15 같은 Tailwind 오퍼시티 모디파이어를
 * 썼는데, tailwind.config.ts의 type.* 색상이 전부 var(--x) 참조라 모디파이어가
 * 조용히 실패해서 배경이 완전 투명하게 렌더링되고 있었음(design_system.md
 * "알려진 인프라 함정" 참고). 여기서는 인라인 style + hex 알파 접미사로
 * 우회 — 코드베이스 다른 곳(AthleteEntryScreen 스타일 태그 필 등)에서 이미
 * 쓰는 안전한 패턴.
 */
const COLORS: Partial<Record<TechniqueType, string>> = {
  스윕:       "#2E80F0",
  서브미션:   "#FF4D6D",
  패스:       "#FF8C42",
  이탈:       "#9CA3AF",
  전환:       "#FFC93C",
  컨트롤:     "#34D399",
  // v3 신규 — 서브미션 계열
  혈관초크:   "#FF4D6D",
  무릎:       "#FF4D6D",
  발목:       "#FF4D6D",
  팔꿈치:     "#FF4D6D",
  어깨:       "#FF4D6D",
  // v3 신규 — 가드 계열
  리텐션:     "#2E80F0",
  // v3 신규 — 방어/탑패스 계열
  디펜스:     "#9CA3AF",
  이스케이프: "#9CA3AF",
  // v3 신규 — 기타
  셋업:       "#FFC93C",
  포지션:     "#34D399",
  테이크다운: "#FF8C42",
};

const FALLBACK_COLOR = "#8A8A94";

export function TypeChip({
  type,
  className,
}: {
  type: TechniqueType;
  className?: string;
}) {
  const color = COLORS[type] ?? FALLBACK_COLOR;
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-full text-[11px] font-medium leading-none",
        className,
      )}
      style={{ backgroundColor: color + "26", color }}
    >
      {type}
    </span>
  );
}
