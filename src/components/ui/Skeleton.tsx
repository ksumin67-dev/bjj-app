import { cn } from "@/lib/utils";

/**
 * Skeleton — shimmer 로딩 플레이스홀더.
 * globals.css 의 .skeleton 클래스 (background-gradient 애니메이션) 활용.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
