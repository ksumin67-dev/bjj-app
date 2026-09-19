import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "그래플로그",
    template: "%s · 그래플로그",
  },
  description: "그래플로그 — 주짓수(BJJ) 기술 기록, 포지션별 스킬트리, 수련 일지, 시퀀스 관리",
  applicationName: "그래플로그",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "그래플로그",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F1115",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-theme="dark">
      <body className="bg-bg-base text-text-primary antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
