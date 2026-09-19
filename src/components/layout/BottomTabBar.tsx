"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BookOpen, ListOrdered, UserCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { href: string; label: string; icon: LucideIcon };

const TABS: Tab[] = [
  { href: "/",          label: "홈",       icon: Home },
  { href: "/calendar",  label: "캘린더",   icon: Calendar },
  { href: "/tree",      label: "기술도감", icon: BookOpen },
  { href: "/sequences", label: "시퀀스",   icon: ListOrdered },
  { href: "/profile",   label: "프로필",   icon: UserCircle },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── 모바일: 하단 고정 탭바 ─────────────────────────────── */}
      <nav
        aria-label="주요 네비게이션"
        className="lg:hidden fixed inset-x-0 bottom-0 z-bottomtab bg-bg-elevated/96 backdrop-blur-lg border-t border-border-subtle"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch h-16">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center justify-center h-full gap-0.5 transition-all duration-fast",
                    active ? "text-brand-primary" : "text-text-tertiary",
                  )}
                >
                  <div className={cn(
                    "w-12 h-7 flex items-center justify-center rounded-full transition-all duration-base",
                    active ? "bg-brand-subtle" : "",
                  )}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold transition-colors duration-fast leading-none",
                    active ? "text-brand-primary" : "text-text-disabled",
                  )}>
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── PC: 좌측 사이드바 ──────────────────────────────────── */}
      <aside
        aria-label="주요 네비게이션"
        className="hidden lg:flex fixed left-0 inset-y-0 z-sticky w-60 flex-col bg-bg-elevated border-r border-border-subtle"
      >
        {/* 로고 */}
        <div className="px-5 py-5 border-b border-border-subtle">
          <span className="text-xl font-black tracking-tight text-text-primary">
            grapp<span className="text-brand-primary">log</span>
          </span>
          <p className="text-[11px] text-text-tertiary mt-0.5">주짓수 스킬 로그</p>
        </div>

        {/* 탭 목록 */}
        <ul className="flex-1 px-3 py-4 space-y-0.5">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-fast",
                    active
                      ? "bg-brand-subtle text-brand-primary"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 버전 */}
        <div className="px-5 py-4 border-t border-border-subtle">
          <span className="text-[11px] text-text-tertiary">v1.0 · grapplog</span>
        </div>
      </aside>
    </>
  );
}
