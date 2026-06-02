"use client";

/**
 * PositionDetailClient — 포지션 상세 (목업 정렬)
 *  - conic-gradient 레벨 링 + 규칙 문구
 *  - 난이도 섹션 + 소프트 잠금(점선 설명) + 다음 추천
 *  - 기술 탭 → 바텀 시트
 */

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Star, X, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { trainingCountLabel } from "@/types/domain";
import type { Difficulty, Technique, PositionLevel } from "@/types/domain";

const DIFF_ORDER: Difficulty[] = ["기본", "정착", "트렌드"];
const DIFF_META: Record<Difficulty, { dot: string; text: string; desc: string }> = {
  기본:   { dot: "#10B981", text: "#34D399", desc: "이 포지션의 토대" },
  정착:   { dot: "#2563EB", text: "#60A5FA", desc: "기본기 위에 쌓는 확장" },
  트렌드: { dot: "#A78BFA", text: "#A78BFA", desc: "현대 메타·고급 옵션" },
};
const UNLOCK_LEVEL: Record<Difficulty, number> = { 기본: 1, 정착: 2, 트렌드: 3 };

function statusOf(count: number) {
  if (count >= 10) return { sym: "✓", color: "#34D399", bg: "rgba(16,185,129,.2)", badge: "익숙" };
  if (count >= 3)  return { sym: "●", color: "#60A5FA", bg: "rgba(37,99,235,.22)", badge: "드릴 중" };
  if (count >= 1)  return { sym: "▶", color: "#b794f6", bg: "rgba(124,58,237,.22)", badge: "시작" };
  return { sym: "○", color: "#3A3A4A", bg: "#22222E", badge: "미수련" };
}

type Props = {
  position: { id: string; nameKo: string; nameEn: string };
  techniques: Technique[];
  countMap: Record<string, number>;
  level: PositionLevel;
  hideHints: boolean;
  streamColor: string;
};

export default function PositionDetailClient({ position, techniques, countMap, level, hideHints, streamColor }: Props) {
  const [sel, setSel] = useState<Technique | null>(null);

  const total = techniques.length;
  const trained = techniques.filter((t) => (countMap[t.recordId] ?? 0) > 0).length;
  const expert = techniques.filter((t) => (countMap[t.recordId] ?? 0) >= 10).length;

  // 링 채움 % (현재 난이도 진척 반영)
  const diffProgress = (d: Difficulty) => {
    const list = techniques.filter((t) => t.difficulty === d);
    if (list.length === 0) return 1;
    const drilled = list.filter((t) => (countMap[t.recordId] ?? 0) >= 3).length;
    return Math.min(1, drilled / Math.ceil(0.7 * list.length));
  };
  let frac = 1;
  if (level.level < 4 && level.targetDifficulty) {
    frac = (level.level - 1) / 3 + (1 / 3) * diffProgress(level.targetDifficulty);
  }
  const ringPct = Math.round(Math.min(1, frac) * 100);

  // 서브 문구
  const nextDiff: Record<Difficulty, Difficulty | null> = { 기본: "정착", 정착: "트렌드", 트렌드: null };
  let subMain: string;
  if (level.level >= 4 || !level.targetDifficulty) {
    subMain = "마스터 트랙 · 모든 난이도 공개됨";
  } else {
    const nd = nextDiff[level.targetDifficulty];
    subMain = `${level.targetDifficulty} 기술 ${level.remaining}개 더 3회+ 드릴 → Lv.${level.unlockNextLevel} 도달${nd ? ` → ${nd} 공개` : " → 마스터"}`;
  }
  const subRule = hideHints
    ? "⚡ 블루벨트+ : 추천 잠금 힌트 자동 숨김 (전 난이도 바로 접근)"
    : "📐 레벨 규칙: 해당 난이도 기술의 70%를 3회+ 드릴하면 다음 레벨 도달";

  // 그룹화
  const byDiff = new Map<Difficulty | "미분류", Technique[]>();
  for (const t of techniques) {
    const k = (t.difficulty ?? "미분류") as Difficulty | "미분류";
    if (!byDiff.has(k)) byDiff.set(k, []);
    byDiff.get(k)!.push(t);
  }
  const sortById = (a: Technique, b: Technique) => a.id.localeCompare(b.id, undefined, { numeric: true });
  const groups: { key: Difficulty | "미분류"; techs: Technique[] }[] = [];
  for (const d of DIFF_ORDER) {
    const l = byDiff.get(d);
    if (l && l.length) groups.push({ key: d, techs: [...l].sort(sortById) });
  }
  const misc = byDiff.get("미분류");
  if (misc && misc.length) groups.push({ key: "미분류", techs: [...misc].sort(sortById) });

  const selCount = sel ? countMap[sel.recordId] ?? 0 : 0;
  const selStatus = sel ? statusOf(selCount) : null;

  return (
    <div className="space-y-5 pb-10">
      <Link href="/tree" className="inline-flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-text-primary">
        <ChevronLeft size={16} /> 스킬트리
      </Link>

      {/* 레벨 링 헤더 */}
      <div className="flex items-center gap-4">
        <div
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0"
          style={{ background: `conic-gradient(${streamColor} ${ringPct}%, #22222E 0)` }}
        >
          <div className="w-12 h-12 rounded-full bg-bg-base flex flex-col items-center justify-center">
            <span className="text-[17px] font-black leading-none" style={{ color: streamColor }}>
              {level.level >= 4 ? "👑" : level.level}
            </span>
            <span className="text-[7px] text-text-tertiary tracking-[1px]">LV</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-extrabold text-text-primary">{position.nameKo}</h1>
          <p className="text-[11px] text-text-secondary mt-1 leading-snug">{subMain}</p>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">{subRule}</p>
        </div>
      </div>

      <div className="text-[11px] text-text-tertiary -mt-1">
        {position.id} · {total}개 기술 · {trained}개 수련{expert > 0 ? ` · 익숙 ${expert}` : ""}
      </div>

      {total === 0 ? (
        <p className="text-text-tertiary text-sm">이 포지션에 등록된 기술이 없습니다.</p>
      ) : (
        <div className="space-y-5">
          {groups.map(({ key, techs }) => {
            const isMisc = key === "미분류";
            const meta = isMisc
              ? { dot: "#4A5160", text: "#6B7280", desc: "난이도 미지정" }
              : DIFF_META[key];
            const locked = !isMisc && !level.unlocked.includes(key) && !hideHints;
            const reqLevel = isMisc ? 1 : UNLOCK_LEVEL[key];

            return (
              <section key={key}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 text-[12px] font-extrabold" style={{ color: meta.text }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.dot }} />
                    {key}
                    <span className="text-[10px] font-medium text-text-tertiary">· {meta.desc}</span>
                  </div>
                  {locked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-tertiary">
                      <Lock size={11} /> Lv.{reqLevel} 도달 시 추천
                    </span>
                  )}
                </div>

                {locked && (
                  <div className="flex items-start gap-2 text-[10px] text-text-tertiary bg-bg-elevated border border-dashed border-border-default rounded-xl px-3 py-2.5 mb-2 leading-relaxed">
                    <span>⚡</span>
                    <span>
                      <b className="text-[#b9a7ff]">도달형 공개</b> — 잠긴 게 아니라 <b className="text-[#b9a7ff]">추천 시점 안내</b>예요.
                      도장에서 배웠다면 지금 눌러 바로 기록할 수 있어요. (소프트)
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {techs.map((t) => {
                    const c = countMap[t.recordId] ?? 0;
                    const s = statusOf(c);
                    const isNext = t.recordId === level.recommendedRecordId;
                    return (
                      <button
                        key={t.recordId}
                        onClick={() => setSel(t)}
                        className={cn(
                          "w-full text-left flex items-center gap-3 rounded-2xl border p-3 transition-all duration-base active:scale-[0.985]",
                          isNext
                            ? "border-brand-primary bg-brand-primary/[0.08] ring-1 ring-brand-primary/50"
                            : "border-border-subtle bg-bg-elevated hover:bg-bg-hover",
                          locked && !isNext && "opacity-50",
                        )}
                      >
                        <span
                          className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[13px] font-black shrink-0"
                          style={isNext ? { background: "var(--brand, #34D399)", color: "#0A0A0F" } : { backgroundColor: s.bg, color: s.color }}
                        >
                          {isNext ? <Star size={15} /> : s.sym}
                        </span>
                        <span className="flex-1 min-w-0">
                          {isNext && (
                            <span className="inline-block text-[8px] font-black text-brand-primary bg-brand-primary/20 px-1.5 py-0.5 rounded-full mb-0.5">
                              ⚡ 다음 추천
                            </span>
                          )}
                          <span className="block text-[8px] font-mono font-bold tracking-wider" style={{ color: streamColor }}>{t.id}</span>
                          <span className="block text-[13px] font-bold text-text-primary truncate">{t.nameKo}</span>
                        </span>
                        <span className="text-[9px] font-mono text-text-tertiary shrink-0">{t.xpValue}xp</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* 바텀 시트 */}
      {sel && selStatus && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSel(null)} />
          <div className="fixed left-0 right-0 bottom-0 z-50 bg-bg-elevated rounded-t-3xl px-5 pt-2 pb-7 max-h-[82%] overflow-y-auto lg:left-auto lg:right-4 lg:bottom-4 lg:w-[400px] lg:rounded-3xl">
            <div className="w-9 h-1 rounded-full bg-border-default mx-auto my-2.5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: (sel.difficulty ? DIFF_META[sel.difficulty as Difficulty]?.dot : "#4A5160") + "33", color: sel.difficulty ? DIFF_META[sel.difficulty as Difficulty]?.text : "#6B7280" }}>
                  {sel.difficulty ?? "미분류"}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary tracking-wider">{sel.id}</span>
              </div>
              <button onClick={() => setSel(null)} aria-label="닫기" className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
            </div>
            <h2 className="text-xl font-extrabold mt-1.5">{sel.nameKo}</h2>
            {sel.nameEn && <p className="text-[11px] text-text-tertiary">{sel.nameEn}</p>}

            {sel.keyPoint && (
              <div className="mt-3 bg-bg-overlay rounded-xl p-3">
                <div className="text-[9px] uppercase tracking-wider text-text-tertiary font-bold mb-1.5">핵심 포인트</div>
                <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">{sel.keyPoint}</p>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <div className="flex-1 bg-bg-overlay rounded-xl py-2.5 text-center">
                <div className="text-base font-black text-brand-primary">{sel.xpValue}</div>
                <div className="text-[9px] text-text-tertiary mt-0.5">기술 XP</div>
              </div>
              <div className="flex-1 bg-bg-overlay rounded-xl py-2.5 text-center">
                <div className="text-base font-black">{selCount}회</div>
                <div className="text-[9px] text-text-tertiary mt-0.5">내 수련</div>
              </div>
              <div className="flex-1 bg-bg-overlay rounded-xl py-2.5 text-center">
                <div className="text-base font-black" style={{ color: selStatus.color }}>{trainingCountLabel(selCount)}</div>
                <div className="text-[9px] text-text-tertiary mt-0.5">상태</div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Link
                href="/log"
                className="flex-[2] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[13px] font-bold bg-brand-primary text-bg-base"
              >
                <Plus size={15} /> 오늘 수련 기록
              </Link>
              <Link
                href={`/tree/${position.id}/${sel.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-[13px] font-bold bg-bg-overlay text-text-secondary"
              >
                <FileText size={15} /> 전체 상세
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
