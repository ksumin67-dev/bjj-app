import type { TechniqueType } from "@/types/domain";
import { cn } from "@/lib/utils";

// 알려진 타입에는 스타일 지정, 그 외엔 fallback
const STYLES: Partial<Record<TechniqueType, { bg: string; text: string }>> = {
  스윕:       { bg: "bg-type-sweep/15",   text: "text-type-sweep" },
  서브미션:   { bg: "bg-type-submit/15",  text: "text-type-submit" },
  패스:       { bg: "bg-type-pass/15",    text: "text-type-pass" },
  이탈:       { bg: "bg-type-escape/20",  text: "text-text-secondary" },
  전환:       { bg: "bg-type-trans/15",   text: "text-type-trans" },
  컨트롤:     { bg: "bg-type-control/15", text: "text-type-control" },
  // v3 신규 — 서브미션 계열
  혈관초크:   { bg: "bg-type-submit/15",  text: "text-type-submit" },
  무릎:       { bg: "bg-type-submit/10",  text: "text-type-submit" },
  발목:       { bg: "bg-type-submit/10",  text: "text-type-submit" },
  팔꿈치:     { bg: "bg-type-submit/10",  text: "text-type-submit" },
  어깨:       { bg: "bg-type-submit/10",  text: "text-type-submit" },
  // v3 신규 — 가드 계열
  리텐션:     { bg: "bg-type-sweep/10",   text: "text-type-sweep" },
  // v3 신규 — 방어/탑패스 계열
  디펜스:     { bg: "bg-type-escape/15",  text: "text-text-secondary" },
  이스케이프: { bg: "bg-type-escape/15",  text: "text-text-secondary" },
  // v3 신규 — 기타
  셋업:       { bg: "bg-type-trans/10",   text: "text-type-trans" },
  포지션:     { bg: "bg-type-control/10", text: "text-type-control" },
  테이크다운: { bg: "bg-type-pass/10",    text: "text-type-pass" },
};

const FALLBACK = { bg: "bg-bg-elevated", text: "text-text-secondary" };

export function TypeChip({
  type,
  className,
}: {
  type: TechniqueType;
  className?: string;
}) {
  const style = STYLES[type] ?? FALLBACK;
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-full text-[11px] font-medium leading-none",
        style.bg,
        style.text,
        className,
      )}
    >
      {type}
    </span>
  );
}
