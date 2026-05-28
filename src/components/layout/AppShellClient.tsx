"use client";

import { ToastProvider } from "@/contexts/ToastContext";

export function AppShellClient({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
