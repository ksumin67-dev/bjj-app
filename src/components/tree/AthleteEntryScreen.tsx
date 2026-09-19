"use client";

/**
 * AthleteEntryScreen — 선수 중심 스킬트리 진입 화면.
 * SkillTreeBrowser(스트림 세그먼트 → 포지션 카드)를 완전 교체 (2026-09-14 결정).
 *
 * 2026-09-18 리디자인: "이달의 추천" 히어로카드 캐러셀(박스 중첩)을 제거하고
 * 이 화면의 히어로 모먼트는 page.tsx의 벨트 진행바 하나로 집중시킴.
 * 대신 최신 등록 선수 2명만 가볍게 보여주는 "최근 추가"로 축소.
 * 리스트도 박스 카드 → 헤어라인 구분선 플랫 리스트로 전환, 스탯 숫자는
 * 선수별 색이 아니라 브랜드 액센트 하나로 통일(데이터=액센트 색 원칙).
 *
 * 2026-09-19: 고정 높이(h-full) + 내부 overflow-y-auto 스크롤 구조를
 * 제거하고 일반 문서 흐름으로 전환(리스트가 화면 대부분을 자연스럽게
 * 차지, 이중 스크롤 제거는 page.tsx 참고). 필터 전환 시 크로스페이드,
 * 리스트 진입 시 순차 등장, 행/칩 탭 시 스케일 피드백을 추가.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AthleteAvatar } from "./AthleteAvatar";
import { getAthletePhoto } from "@/lib/athletePhotos";
import { STYLE_TAG_META, STYLE_TAG_ORDER, STYLE_TAG_FALLBACK } from "@/types/domain";
import type { Athlete, StyleTag } from "@/types/domain";

const DEFAULT_ACCENT = STYLE_TAG_FALLBACK.color;

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

export default function AthleteEntryScreen({
  athletes,
  preferredStyleTag = null,
}: {
  athletes: Athlete[];
  preferredStyleTag?: StyleTag | null;
}) {
  const availableTags = useMemo(() => {
    const set = new Set<StyleTag>();
    athletes.forEach((a) => a.styleTags.forEach((t) => set.add(t as StyleTag)));
    return STYLE_TAG_ORDER.filter((t) => set.has(t));
  }, [athletes]);

  const [active, setActive] = useState<StyleTag | "전체">("전체");

  const filtered = active === "전체" ? athletes : athletes.filter((a) => a.styleTags.includes(active));

  // 최신 등록순 정렬 (2026-09-18) — heroStat은 선수마다 단위가 다른 필드
  // (우승 횟수/나이/포지션명 혼재)라 크기순 비교가 무의미함이 확인되어 교체.
  const recentlyAdded = useMemo(() => {
    return [...athletes]
      .sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""))
      .slice(0, 2);
  }, [athletes]);

  // 추천 선수 (2026-09-19) — 온보딩에서 고른 선호 스타일과 겹치는 선수를
  // 우선 노출. 선호 스타일을 안 골랐거나(온보딩 건너뜀) 해당 스타일
  // 선수가 없으면 기존 "최근 추가"로 자연스럽게 폴백.
  const recommended = useMemo(() => {
    if (!preferredStyleTag) return null;
    const matches = athletes.filter((a) => a.styleTags.includes(preferredStyleTag));
    return matches.length > 0 ? matches.slice(0, 2) : null;
  }, [athletes, preferredStyleTag]);

  const highlightAthletes = recommended ?? recentlyAdded;
  const highlightLabel = recommended ? "추천 선수" : "최근 추가";

  if (athletes.length === 0) {
    return (
      <div className="px-6 py-16">
        <p className="text-text-tertiary text-sm text-center">
          등록된 선수가 없습니다. Airtable Athletes 테이블을 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 추천 선수 / 최근 추가 — 박스 없이 아바타+텍스트 인라인 페어 2개만 (2026-09-18) */}
      {highlightAthletes.length > 0 && (
        <div className="px-4 pt-4 pb-3">
          <span className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">
            {highlightLabel}
          </span>
          <div className="flex gap-5 mt-2.5">
            {highlightAthletes.map((a) => (
              <Link
                key={a.recordId}
                href={`/tree/athlete/${a.recordId}`}
                className="flex items-center gap-2 min-w-0 active:opacity-70 active:scale-[0.97] transition-all duration-fast"
              >
                <AthleteAvatar
                  color={accentFor(a)}
                  size={30}
                  photoUrl={getAthletePhoto(a.recordId)}
                  alt={a.nameKo}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-text-primary truncate">{a.nameKo}</p>
                  <p className="text-[9.5px] text-text-tertiary truncate">{a.heroLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mx-4 h-px bg-border-subtle" />

      {/* 스타일 태그 탭 — 플랫 아웃라인 (2026-09-18, 채워진 필 대신 테두리만) */}
      <div className="px-3 pt-3 pb-2 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActive("전체")}
          className={cn(
            "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-base active:scale-[0.94]",
            active === "전체"
              ? "text-text-inverse bg-brand-primary border-brand-primary"
              : "text-text-tertiary border-border-subtle hover:border-border-default",
          )}
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
                "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-base active:scale-[0.94]",
                isActive ? "text-white" : "text-text-tertiary border-border-subtle hover:border-border-default",
              )}
              style={isActive ? { backgroundColor: tagMeta(tag).color, borderColor: tagMeta(tag).color } : {}}
            >
              {tag} {count}
            </button>
          );
        })}
      </div>

      {/* 섹션 라벨 */}
      <div className="px-4 pb-1">
        <span className="text-[10px] tracking-[0.5px] font-semibold text-text-tertiary">
          {active === "전체" ? "전체 선수" : active} · {filtered.length}명
        </span>
      </div>

      {/* 선수 리스트 — 내부 스크롤 없이 일반 문서 흐름 (2026-09-19) */}
      <div className="px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.map((a, i) => (
              <motion.div
                key={a.recordId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.02, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/tree/athlete/${a.recordId}`}
                  className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 active:opacity-70 active:scale-[0.99] transition-all duration-fast origin-left"
                >
                  <AthleteAvatar
                    color={accentFor(a)}
                    size={36}
                    photoUrl={getAthletePhoto(a.recordId)}
                    alt={a.nameKo}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13.5px] font-bold truncate text-text-primary">{a.nameKo}</h3>
                    <p className="text-[10.5px] text-text-tertiary truncate mt-0.5">{a.beltAcademy}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="text-[17px] font-bold tabular-nums text-brand-primary">
                      {a.heroStat}
                    </span>
                    <span className="text-[8.5px] text-text-tertiary whitespace-nowrap">{a.heroLabel}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-10">해당 스타일의 선수가 없습니다.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
