import { BottomTabBar } from "./BottomTabBar";

/**
 * AppShell — 전체 앱 레이아웃 쉘.
 * 하단 탭바 / PC 사이드바 포함.
 * ToastProvider는 layout.tsx → Providers 에서 주입 (revalidatePath 재마운트 방지).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      {/* lg: 사이드바 너비만큼 왼쪽 여백 */}
      <main className="flex-1 lg:pl-60 overflow-x-hidden">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
