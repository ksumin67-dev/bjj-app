import { BottomTabBar } from "./BottomTabBar";

/**
 * AppShell — 전체 앱 레이아웃 쉘.
 * 하단 탭바 / PC 사이드바 포함.
 * ToastProvider는 layout.tsx → Providers 에서 주입 (revalidatePath 재마운트 방지).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      {/* lg: 사이드바 너비만큼 왼쪽 여백
          (2026-09-19) overflow-x-hidden → overflow-x-clip으로 변경.
          CSS 스펙상 overflow-x/-y 중 하나만 visible이 아니면 나머지 쪽도
          강제로 auto가 되는데(hidden이면 overflow-y:auto로 승격), 그 결과
          <main>이 실제로는 스크롤 안 하는(뷰포트 높이로 안 잘림) "유령"
          스크롤 컨테이너가 되어 하위 트리의 position:sticky가 전부 깨짐
          (스크롤 기준점이 window가 아니라 이 <main>이 되어버림).
          clip은 이 강제 승격이 없어서 가로 스크롤 방지 효과는 그대로 두고
          sticky만 정상 동작하게 함 (/tree 탭 스위처에서 발견). */}
      <main className="flex-1 lg:pl-60 overflow-x-clip">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
