"use client";

/**
 * TechDetailSheet v3 — Status 시스템 제거, 수련 횟수 기반 표시
 */

import { motion, AnimatePresence } from "framer-motion";
import { useTransition, useState } from "react";
import {
  X, ExternalLink, Search, Hand, Lightbulb, Target,
  AlertTriangle, ShieldX, PersonStanding, Flame, Star, Zap, Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Technique } from "@/types/domain";
import { trainingCountLabel } from "@/types/domain";
import { toggleMainSkillAction } from "@/lib/actions/techniques";
import { TypeChip } from "./TypeChip";
import { StreamChip } from "./StreamChip";
import { Chip } from "@/components/ui/Chip";

// ── 스트림 색상 ─────────────────────────────────────────────────────────────

const STREAM_STYLE: Record<string, { bg: string; text: string; glow: string }> = {
  가드포지션: { bg: "rgba(46,128,240,0.12)",  text: "#2E80F0", glow: "#2E80F0" },
  탑포지션:   { bg: "rgba(255,140,66,0.12)",  text: "#FF8C42", glow: "#FF8C42" },
  이스케이프: { bg: "rgba(167,139,250,0.12)", text: "#A78BFA", glow: "#A78BFA" },
  스탠딩:     { bg: "rgba(251,191,36,0.12)",  text: "#FBBF24", glow: "#FBBF24" },
};

// ── 수련 횟수 스타일 ─────────────────────────────────────────────────────────

function countColor(count: number): string {
  if (count === 0) return "#4A5160";
  if (count <= 2)  return "#A78BFA";
  if (count <= 9)  return "#60A5FA";
  return "#34D399";
}

function CountIcon({ count, size = 20 }: { count: number; size?: number }) {
  const Icon = count === 0 ? Circle : count <= 2 ? Flame : count <= 9 ? Zap : Star;
  const color = countColor(count);
  return <Icon size={size} color={color} />;
}

// ── 심화정보 섹션 ───────────────────────────────────────────────────────────

function DetailRow({ icon, label, content }: {
  icon: React.ReactNode;
  label: string;
  content: string | null;
}) {
  if (!content) return null;
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-overlay p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-brand-primary">{icon}</span>
        <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function TechDetailSheet({
  technique,
  trainingCount = 0,
  onClose,
}: {
  technique: Technique | null;
  trainingCount?: number;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticMain, setOptimisticMain] = useState<boolean | null>(null);

  // technique이 바뀌면 optimistic 초기화
  const currentMain = optimisticMain ?? (technique?.isMainSkill ?? false);
  const canMarkMain = trainingCount >= 3;

  function handleToggleMain() {
    if (!technique || !canMarkMain) return;
    const next = !currentMain;
    setOptimisticMain(next);
    startTransition(async () => {
      await toggleMainSkillAction(technique.recordId, next);
      setOptimisticMain(null);
    });
  }
  const stream = technique?.stream ?? null;
  const streamStyle = stream ? (STREAM_STYLE[stream] ?? null) : null;
  const countLabel = trainingCountLabel(trainingCount);
  const color = countColor(trainingCount);

  const hasDetails =
    technique?.keyPoint ||
    technique?.practicalTip ||
    technique?.commonMistake ||
    technique?.counter ||
    technique?.grip ||
    technique?.bodyType;

  return (
    <AnimatePresence>
      {technique && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 시트 본체 */}
          <motion.div
            key="sheet"
            className={cn(
              "fixed z-modal bg-bg-elevated overflow-y-auto",
              // 모바일: 바텀 시트
              "bottom-0 left-0 right-0 rounded-t-2xl max-h-[85dvh]",
              // PC: 사이드 패널
              "lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[400px] lg:rounded-none lg:rounded-l-2xl lg:max-h-none",
            )}
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* 스트림 색상 상단 줄 */}
            {streamStyle && (
              <div
                className="h-1 w-full rounded-t-2xl lg:rounded-tl-2xl"
                style={{ backgroundColor: streamStyle.text }}
              />
            )}

            <div className="p-5 space-y-5">
              {/* ── 헤더 ────────────────────────────────────────── */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* ID + stream 뱃지 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg"
                      style={streamStyle
                        ? { backgroundColor: streamStyle.bg, color: streamStyle.text }
                        : { backgroundColor: "#1e293b", color: "#94a3b8" }}
                    >
                      {technique.id}
                    </span>
                    {stream && (
                      <StreamChip stream={stream as import("@/types/domain").Stream} size="xs" />
                    )}
                  </div>
                  {/* 기술명 */}
                  <h2 className="text-xl font-black tracking-tight text-text-primary leading-tight">
                    {technique.nameKo}
                  </h2>
                  <p className="text-xs text-text-tertiary">{technique.nameEn}</p>
                </div>

                <button
                  onClick={onClose}
                  className="size-8 rounded-xl hover:bg-bg-hover active:scale-95 transition-all duration-fast flex items-center justify-center text-text-tertiary shrink-0"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── 메타 정보 ────────────────────────────────────── */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-bold text-brand-primary">
                  {technique.xpValue} XP
                </span>
                {technique.type && (
                  <TypeChip type={technique.type} />
                )}
                {technique.giNogi !== "기·노기공통" && (
                  <Chip size="xs">{technique.giNogi}</Chip>
                )}
              </div>

              {/* ── 내 수련 현황 ─────────────────────────────────── */}
              <div
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{ borderColor: color + "44", backgroundColor: color + "0D" }}
              >
                <CountIcon count={trainingCount} size={28} />
                <div>
                  <p className="text-xs text-text-tertiary">수련 현황</p>
                  <p className="text-base font-bold" style={{ color }}>
                    {countLabel}
                    <span className="ml-2 text-sm font-normal text-text-tertiary">
                      총 {trainingCount}회
                    </span>
                  </p>
                </div>
              </div>

              {/* ── 영상 링크 ────────────────────────────────────── */}
              {(technique.videoUrl || technique.ytSearchGeneral || technique.ytSearchKo) && (
                <div className="flex flex-wrap gap-2">
                  {technique.videoUrl && (
                    <a
                      href={technique.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25 transition-colors"
                    >
                      <ExternalLink size={12} />
                      영상 보기
                    </a>
                  )}
                  {technique.ytSearchGeneral && (
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique.ytSearchGeneral)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-bg-overlay text-text-secondary hover:bg-bg-hover transition-colors"
                    >
                      <Search size={12} />
                      YouTube (EN)
                    </a>
                  )}
                  {technique.ytSearchKo && (
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(technique.ytSearchKo)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-bg-overlay text-text-secondary hover:bg-bg-hover transition-colors"
                    >
                      <Search size={12} />
                      YouTube (KO)
                    </a>
                  )}
                </div>
              )}

              {/* ── 심화 정보 ────────────────────────────────────── */}
              {hasDetails && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    심화 정보
                  </p>
                  <DetailRow icon={<Hand size={14} />} label="그립" content={technique.grip} />
                  <DetailRow icon={<PersonStanding size={14} />} label="체형 추천" content={technique.bodyType} />
                  <DetailRow icon={<Lightbulb size={14} />} label="핵심 포인트" content={technique.keyPoint} />
                  <DetailRow icon={<Target size={14} />} label="실전 팁" content={technique.practicalTip} />
                  <DetailRow icon={<AlertTriangle size={14} />} label="흔한 실수" content={technique.commonMistake} />
                  <DetailRow icon={<ShieldX size={14} />} label="카운터" content={technique.counter} />
                </div>
              )}

              {/* ── 주력 기술 등록 ───────────────────────────────── */}
              <button
                type="button"
                onClick={handleToggleMain}
                disabled={!canMarkMain || isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all",
                  currentMain
                    ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                    : canMarkMain
                      ? "border-border-default text-text-secondary hover:bg-bg-hover hover:border-yellow-500/40 hover:text-yellow-400"
                      : "border-border-subtle text-text-disabled opacity-50 cursor-not-allowed",
                )}
                title={!canMarkMain ? "3회 이상 수련한 기술만 주력으로 등록할 수 있어요" : undefined}
              >
                <Star
                  size={16}
                  className={currentMain ? "fill-yellow-400 text-yellow-400" : ""}
                />
                {currentMain
                  ? "주력 기술 ✓"
                  : canMarkMain
                    ? "주력 기술로 등록"
                    : `주력 등록 (${trainingCount}/3회 수련 필요)`}
              </button>

              {/* ── 수련 기록 가기 ───────────────────────────────── */}
              <a
                href="/calendar"
                className="block w-full text-center py-3 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:bg-bg-hover hover:text-text-primary active:scale-[0.97] transition-all duration-fast"
              >
                📋 수련 기록하기
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
