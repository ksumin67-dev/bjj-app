"use client";

import { ToastProvider } from "@/contexts/ToastContext";

/**
 * Providers — 레이아웃 최상단 클라이언트 래퍼.
 * revalidatePath 등 서버 컴포넌트 재렌더로 ToastProvider가
 * 재마운트되지 않도록 root layout 바로 아래에 위치.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
