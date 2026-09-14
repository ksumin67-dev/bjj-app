"use client";

/**
 * AthleteEntryScreen — 선수 중심 스킬트리 진입 화면.
 * SkillTreeBrowser(스트림 세그먼트 → 포지션 카드)를 완전 교체 (2026-09-14 결정).
 *
 * 구성: 이달의 추천 배너(미니 히어로카드) → 스타일 태그 탭 → 선수 리스트.
 * 리스트 행의 오른쪽 칩은 임의 스탯이 아니라 선수의 실제 커리어 성과(heroStat/heroLabel).
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AthleteAvatar } from "./AthleteAvatar";
import { AthleteHeroCard } from "./AthleteHeroCard";
import { STYLE_TAG_META, STYLE_TAG_ORDER, STYLE_TAG_FALLBACK } from "@/types/domain";
import type { Athlete, StyleTag } from "@/types/domain";

const DEFAULT_ACCENT = STYLE_TAG_FALLBACK.color;
const DEFAULT_GLOW = STYLE_TAG_FALLBACK.glow;

function tagMeta(t: StyleTag) {
  return STYLE_TAG_META[t] ?? STYLE_TAG_FALLBACK;
}
function primaryTag(a: Athlete): StyleTag | null {
  return (a.styleTags[0] as StyleTag) ?? null;
}
function accentFor(a: Athlete): string {
  const t = primaryTag(a);
  return t ? tagMeta(t).color : DEFAULT_ACCENT;
}
function glowFor(a: Athlete): string {
  const t = primaryTag(a);
  return t ? tagMeta(t).glow : DEFAULT_GLOW;
}

export default function AthleteEntryScreen({ athletes }: { athletes: Athlete[] }) {
  const availableTags = useMemo(() => {
    const set = new Set<StyleTag>();
    athletes.forEach((a) => a.styleTags.forEach((t) => set.add(t as StyleTag)));
    return STYLE_TAG_ORDER.filter((t) => set.has(t));
  }, [athletes]);

  const [active, setActive] = useState<StyleTag | "전체">("전체");

  const filtered = active === "전체" ? athletes : athletes.filter((a) => a.styleTags.includes(active));

  const featured = useMemo(() => {
    return [...athletes]
      .sort((a, b) => (parseInt(b.heroStat, 10) || 0) - (parseInt(a.heroStat, 10) || 0))
      .slice(0, 4);
  }, [athletes]);

  if (athletes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <p className="text-text-tertiary text-sm text-center">
          등록된 선수가 없습니다. Airtable Athletes 테이블을 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 이달의 추천 — 미니 히어로카드 가로 스크롤 */}
      <div className="px-4 pt-1 pb-3 shrink-0">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">
          이달의 추천
        </span>
        <div className="flex gap-2.5 mt-2 overflow-x-auto pb-1">
          {featured.map((a) => (
            <Link key={a.recordId} href={`/tree/athlete/${a.recordId}`}>
              <AthleteHeroCard athlete={a} accent={accentFor(a)} glow={glowFor(a)} />
            </Link>
          ))}
        </div>
      </div>

      {/* 스타일 태그 탭 */}
      <div className="px-3 pb-2 shrink-0 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActive("전체")}
          className={cn(
            "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors duration-base",
            active === "전체" ? "text-white" : "bg-bg-elevated text-text-tertiary hover:bg-bg-hover",
          )}
          style={active === "전체" ? { backgroundColor: DEFAULT_ACCENT } : {}}
        >
          전체 {athletes.length}
        </button>
        {availableTags.map((tag) => {
          const count = athletes.filter((a) => a.styleTags.includes(tag)).length;
          const isActive = active === tag;
          return (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors duration-base",
                isActive ? "text-white" : "bg-bg-elevated text-text-tertiary hover:bg-bg-hover",
              )}
              style={isActive ? { backgroundColor: tagMeta(tag).color } : {}}
            >
              {tag} {count}
            </button>
          );
        })}
      </div>

      {/* 섹션 라벨 */}
      <div className="px-4 pb-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-text-tertiary">
          {active === "전체" ? "전체 선수" : active} · {filtered.length}명
        </span>
      </div>

      {/* 선수 리스트 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 space-y-2.5">
        {filtered.map((a) => (
          <Link
            key={a.recordId}
            href={`/tree/athlete/${a.recordId}`}
            className="group flex items-center gap-3 rounded-2xl border border-border-subtle bg-bg-elevated p-3.5 transition-all duration-base ease-out-soft hover:bg-bg-hover hover:border-border-default active:scale-[0.985]"
          >
            <AthleteAvatar color={accentFor(a)} size={34} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[13.5px] font-bold truncate text-text-primary">{a.nameKo}</h3>
              <p className="text-[10px] text-text-tertiary truncate">{a.beltAcademy}</p>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-1">
              <span className="text-[12px] font-black tabular-nums" style={{ color: accentFor(a) }}>
                {a.heroStat}
              </span>
              <span className="text-[8px] text-text-tertiary whitespace-nowrap">{a.heroLabel}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-text-tertiary text-sm text-center py-10">해당 스타일의 선수가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
