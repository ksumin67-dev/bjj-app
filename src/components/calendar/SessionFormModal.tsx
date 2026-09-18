"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronDown, Check, Plus, Lightbulb, BookOpen, Pen, Link2, ChevronUp, Sparkles, Heart } from "lucide-react";
import {
  createTrainingSessionAction,
  updateTrainingSessionAction,
  type CreateSessionFormState,
} from "@/lib/actions/trainingSessions";
import type { Technique, Stream, TrainingSession } from "@/types/domain";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LevelUpCelebration } from "@/components/gamification/BeltUpCelebration";
import type { LearningLevel } from "@/types/domain";
import { useToast } from "@/contexts/ToastContext";

// ── 수정 모드: 저장된 notes 문자열을 기술별 메모 + 전체 메모로 파싱 ─────────────

function parseSessionNotes(
  combinedNotes: string,
  techniques: Technique[],
): { techNotes: Record<string, string>; sessionNote: string } {
  if (!combinedNotes.trim()) return { techNotes: {}, sessionNote: "" };

  // Airtable은 \r\n으로 저장 → 먼저 정규화
  const normalized = combinedNotes.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const techNotes: Record<string, string> = {};
  let sessionNote = "";

  // lookahead로 섹션 경계를 찾음: "\n\n[헤더]" 또는 문자열 끝
  // 이렇게 하면 섹션 내용 중 빈 줄이 있어도 올바르게 파싱됨
  const sectionPattern = /\[([^\]]+)\]\n([\s\S]*?)(?=\n\n\[[^\]]+\]|$)/g;
  let match: RegExpExecArray | null;
  let hasAnyHeader = false;

  while ((match = sectionPattern.exec(normalized)) !== null) {
    hasAnyHeader = true;
    const header = match[1];
    const content = match[2].trim();

    // 기술 메모: "[GP-19 롱 스텝 패스]"
    const techIdMatch = header.match(/^([A-Z]+-\d+) (.+)$/);
    if (techIdMatch) {
      const techId = techIdMatch[1];
      const tech = techniques.find((t) => t.id === techId);
      if (tech) techNotes[tech.recordId] = content;
    } else if (header === "전체 메모") {
      sessionNote = content;
    }
    // [미등록: name] 섹션은 customTechs 복원 불가 — skip
  }

  // 헤더가 전혀 없으면 전체가 세션 메모
  if (!hasAnyHeader) sessionNote = normalized.trim();

  return { techNotes, sessionNote };
}


// ── 시퀀스 이름 추천 ────────────────────────────────────────────────────────

function generateSeqNameSuggestions(
  orderedIds: string[],
  techniques: Technique[],
): string[] {
  const techs = orderedIds
    .map((id) => techniques.find((t) => t.recordId === id))
    .filter((t): t is Technique => Boolean(t));
  if (techs.length < 2) return [];

  const first = techs[0];
  const last  = techs[techs.length - 1];

  // 기술명에서 핵심 어휘만 추출
  const coreOf = (name: string): string => {
    let s = name
      .replace(/\s*→\s*.+$/, "")              // "→ X" 제거
      .replace(/\s*(전환|연결|컨트롤|포지션)$/, "") // 흔한 접미사 제거
      .trim();
    // 앞에 수식어가 있을 때만 "패스" 접미사 제거 (e.g. "롱 스텝 패스" → "롱 스텝")
    if (s.includes(" ") && s.endsWith("패스")) {
      s = s.replace(/\s*패스$/, "").trim();
    }
    // 공백 제거해서 붙여쓰기 (e.g. "롱 스텝" → "롱스텝")
    return s.replace(/\s+/g, "") || name.split(" ")[0];
  };

  const firstCore = coreOf(first.nameKo);
  const lastCore  = coreOf(last.nameKo);
  const midCore   =
    techs.length > 2
      ? coreOf(techs[Math.floor(techs.length / 2)].nameKo)
      : null;

  const streamLabel: Record<string, string> = {
    가드포지션: "가드",
    탑포지션:   "탑게임",
    이스케이프: "이스케이프",
    스탠딩:     "스탠딩",
  };
  const stream = last.stream || first.stream;

  const candidates: string[] = [
    // S1 — X 투 Y  (영한 믹스, 깔끔)
    `${firstCore} 투 ${lastCore}`,
    // S2 — X → Y 체인
    `${firstCore} → ${lastCore} 체인`,
    // S3 — 3단계 or 2단계 콤보
    midCore && midCore !== firstCore && midCore !== lastCore
      ? `${firstCore} · ${midCore} · ${lastCore}`
      : `${firstCore} ${lastCore} 콤보`,
    // S4 — 포지션/스트림 기반
    stream
      ? `${streamLabel[stream] ?? stream} ${lastCore} 플로우`
      : `${firstCore} 연계 ${lastCore}`,
  ];

  // 중복 제거 후 최대 4개
  return [...new Set(candidates)].slice(0, 4);
}

// ── 디테일 가이드 프롬프트 ────────────────────────────────────────────────────

const DETAIL_GUIDES = [
  { emoji: "🎯", label: "핵심 발견",    desc: "오늘 새롭게 깨달은 것",             template: "🎯 핵심 발견\n→ " },
  { emoji: "❓", label: "안 된 점",      desc: "왜 실패했는지 분석",               template: "❓ 안 된 점\n→ " },
  { emoji: "⏱️", label: "타이밍/디테일", desc: "성공한 순간의 작은 디테일",          template: "⏱️ 타이밍/디테일\n→ " },
  { emoji: "🤼", label: "상대 반응",     desc: "상대가 어떻게 반응했나",             template: "🤼 상대 반응\n→ " },
  { emoji: "🔄", label: "다음 집중",     desc: "다음 수련에서 의도적으로 연습할 것", template: "🔄 다음 집중\n→ " },
] as const;

// ── DetailGuidePanel ─────────────────────────────────────────────────────────

function DetailGuidePanel({ onInsert }: { onInsert: (text: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-bg-hover transition-colors"
      >
        <span className="flex items-center gap-2 font-medium text-text-secondary">
          <Lightbulb size={14} className="text-yellow-400" />
          디테일 가이드
          <span className="text-[10px] text-text-tertiary font-normal">— 기억을 구조화하는 질문들</span>
        </span>
        <ChevronDown size={13} className={cn("transition-transform text-text-tertiary", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-3 pb-3 border-t border-border-subtle space-y-3">
          <p className="text-[11px] text-text-tertiary pt-2.5 leading-relaxed">
            버튼을 클릭하면 메모창에 가이드가 삽입돼요.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DETAIL_GUIDES.map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => onInsert(g.template)}
                title={g.desc}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-bg-base border border-border-default hover:border-brand-primary/50 hover:bg-brand-subtle/30 text-xs text-text-secondary transition-all"
              >
                <span>{g.emoji}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-bg-base/60 border border-border-subtle p-3">
            <p className="text-[10px] font-semibold text-text-tertiary mb-1.5 flex items-center gap-1">
              <BookOpen size={10} /> 작성 예시
            </p>
            <p className="text-[10px] text-text-tertiary font-mono leading-[1.7] whitespace-pre-wrap">{`🎯 핵심 발견\n→ 기무라 그립은 팔꿈치 위에서 — 손목 아님\n\n❓ 안 된 점\n→ 상대가 몸 쪽으로 당기면 레버리지가 사라짐\n\n⏱️ 타이밍/디테일\n→ 상대가 업포스처 할 때가 그립 진입 타이밍\n\n🔄 다음 집중\n→ 팔 멀리 유지한 상태로 드릴 20회`}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PerTechNote — 기술별 디테일 메모 ──────────────────────────────────────────

function PerTechNote({
  technique, value, onChange,
}: {
  technique: Technique; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertGuide = useCallback((template: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end   = el.selectionEnd   ?? el.value.length;
    const before  = el.value.slice(0, start);
    const after   = el.value.slice(end);
    const newVal  = before + (before && !before.endsWith("\n") ? "\n" : "") + template + after;
    onChange(newVal);
    setTimeout(() => {
      el.focus();
      const pos = (before + (before && !before.endsWith("\n") ? "\n" : "") + template).length;
      el.setSelectionRange(pos, pos);
    }, 10);
  }, [onChange]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <div className={cn("rounded-xl border transition-all duration-base overflow-hidden",
      focused ? "border-brand-primary/50 bg-bg-elevated" : "border-border-subtle bg-bg-elevated",
    )}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-bg-overlay/50">
        <span className="text-[10px] font-mono text-brand-primary opacity-80">{technique.id}</span>
        <span className="text-[12px] font-semibold text-text-primary">{technique.nameKo}</span>
        <span className="ml-auto text-[9px] text-text-tertiary italic">{technique.nameEn}</span>
      </div>
      {(focused || value) && (
        <div className="flex gap-1 px-3 pt-2 flex-wrap">
          {DETAIL_GUIDES.map((g) => (
            <button key={g.label} type="button"
              onMouseDown={(e) => { e.preventDefault(); insertGuide(g.template); }}
              title={g.desc}
              className="flex items-center gap-1 h-6 px-2 rounded-full bg-bg-base border border-border-subtle hover:border-brand-primary/40 text-[10px] text-text-tertiary hover:text-text-secondary transition-all"
            >
              <span>{g.emoji}</span>
              <span className="hidden sm:inline">{g.label}</span>
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={`${technique.nameKo}에서 오늘 발견한 디테일을 기록해보세요.\n예) 타이밍, 그립 포지션, 성공/실패 이유…`}
        rows={2}
        className="w-full bg-transparent px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled resize-none outline-none leading-relaxed min-h-[64px]"
        style={{ overflow: "hidden" }}
      />
    </div>
  );
}

// ── SubmitButton ──────────────────────────────────────────────────────────────

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        "w-full py-3 rounded-xl font-bold text-[14px] transition-all duration-base",
        "bg-brand-primary text-text-inverse hover:bg-brand-hover active:scale-[0.97]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      {pending ? "저장 중…" : label}
    </button>
  );
}

// ── TechPicker ────────────────────────────────────────────────────────────────

function TechPicker({
  techniques, techniqueByShortId, selectedTech, customTechs, goalTechRecordIds = [],
  onToggleTech, onAddCustom, onRemoveCustom,
}: {
  techniques: Technique[];
  techniqueByShortId: Record<string, Technique>;
  selectedTech: string[];
  customTechs: { name: string; stream: Stream }[];
  goalTechRecordIds?: string[];
  onToggleTech: (id: string) => void;
  onAddCustom: (name: string, stream: Stream) => void;
  onRemoveCustom: (name: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const groupedTechniques = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qNoSpace = q.replace(/\s+/g, "");

    /**
     * 검색어 연관성 스코어링 — 이전엔 필터링만 하고 정렬을 안 해서 매칭된
     * 기술들이 원본 데이터 순서(사실상 무작위)로 나열됐음. "클로즈드"를 쳤을
     * 때 이름이 정확히 그걸로 시작하는 "클로즈드 가드"가 맨 아래 나오는 등
     * 불편함 발생 → 매칭 방식별 우선순위를 점수화해서 정렬(2026-09-15).
     * 점수가 높을수록 연관성 높음: 자기 이름/ID 일치 > 시작 일치 > 포함 >
     * 포지션(부모)명으로만 매칭된 하위 기술.
     */
    function matchScore(t: Technique): number {
      if (!q) return 0;
      const nameKo = t.nameKo.toLowerCase();
      const nameEn = t.nameEn.toLowerCase();
      const id = t.id.toLowerCase();
      const nameKoNoSpace = nameKo.replace(/\s+/g, "");
      const parent = t.parentId ? techniqueByShortId[t.parentId] : null;
      const parentNameKo = (parent?.nameKo ?? "").toLowerCase();
      const parentNameEn = (parent?.nameEn ?? "").toLowerCase();
      const parentId = (parent?.id ?? "").toLowerCase();

      if (nameKo === q || nameEn === q || id === q) return 100;
      if (nameKo.startsWith(q) || nameEn.startsWith(q) || nameKoNoSpace.startsWith(qNoSpace)) return 90;
      if (id.startsWith(q)) return 80;
      if (nameKo.includes(q) || nameEn.includes(q) || nameKoNoSpace.includes(qNoSpace)) return 60;
      if (id.includes(q)) return 55;
      if (parentNameKo === q || parentNameEn === q) return 50;
      if (parentNameKo.startsWith(q) || parentNameEn.startsWith(q)) return 45;
      if (
        parentNameKo.includes(q) || parentNameEn.includes(q) || parentId.includes(q) ||
        parentNameEn.replace(/\s+/g, "").includes(qNoSpace) ||
        parentNameKo.replace(/\s+/g, "").includes(qNoSpace)
      ) return 20;
      return 0;
    }

    const filtered = q ? techniques.filter((t) => matchScore(t) > 0) : techniques;

    // 포지션(부모) 레코드(parentId=null)는 자기 자신의 shortId로 그룹핑해서
    // 그 포지션의 자식 기술들과 같은 그룹에 묶는다 — "클로즈드 가드" 자체를
    // "포지션 전체"로 골라 태그할 수 있게 함(2026-09-15, 이전엔 "기타"에
    // 묻혀서 사실상 찾을 수 없었음).
    const groups: Record<string, { label: string; shortId: string; parent: Technique | null; list: Technique[]; bestScore: number }> = {};
    for (const t of filtered) {
      const isPositionSelf = t.parentId === null;
      const key = t.parentId ?? t.id;
      if (!groups[key]) {
        const parent = isPositionSelf ? t : (techniqueByShortId[key] ?? null);
        groups[key] = { label: parent?.nameKo ?? t.nameKo, shortId: parent?.id ?? t.id, parent, list: [], bestScore: 0 };
      }
      groups[key].list.push(t);
      groups[key].bestScore = Math.max(groups[key].bestScore, matchScore(t));
    }

    // 그룹 내부: 연관성 점수 높은 순(동점이면 포지션 전체 항목 우선)
    for (const group of Object.values(groups)) {
      group.list.sort((a, b) => {
        const scoreDiff = matchScore(b) - matchScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return Number(a.parentId !== null) - Number(b.parentId !== null);
      });
    }

    // 그룹 간: 그룹 내 최고 연관성 점수 높은 순 (검색어 없으면 원본 순서 유지)
    const groupList = Object.entries(groups).map(([key, g]) => ({ key, ...g }));
    if (q) groupList.sort((a, b) => b.bestScore - a.bestScore);
    return groupList;
  }, [techniques, query, techniqueByShortId]);

  const goalTechniques = useMemo(
    () => goalTechRecordIds
      .map((id) => techniques.find((t) => t.recordId === id))
      .filter((t): t is Technique => Boolean(t)),
    [goalTechRecordIds, techniques],
  );

  const totalResults = groupedTechniques.reduce((acc, g) => acc + g.list.length, 0);
  const q = query.trim();
  const exactMatch = q ? techniques.some((t) =>
    t.nameKo.toLowerCase() === q.toLowerCase() || t.nameEn.toLowerCase() === q.toLowerCase()
  ) : false;
  const canAddCustom = q.length > 0 && !exactMatch && !customTechs.some((c) => c.name === q);
  const [pendingStream, setPendingStream] = useState<string | null>(null);

  const STREAM_OPTS: { stream: Stream; emoji: string; label: string; color: string }[] = [
    { stream: "가드포지션", emoji: "🛡",  label: "가드",       color: "#2E80F0" },
    { stream: "탑포지션",   emoji: "⚔️", label: "탑/패스",   color: "#FF8C42" },
    { stream: "이스케이프", emoji: "🏃",  label: "이스케이프", color: "#A78BFA" },
    { stream: "스탠딩",     emoji: "🥋",  label: "스탠딩",    color: "#FBBF24" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (totalResults === 1) {
        const only = groupedTechniques.flatMap((g) => g.list)[0];
        onToggleTech(only.recordId);
        setQuery("");
      } else if (canAddCustom) {
        setPendingStream(q);
      }
    }
  };

  return (
    <div>
      {(selectedTech.length > 0 || customTechs.length > 0) && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedTech.map((id) => {
            const t = techniques.find((x) => x.recordId === id);
            if (!t) return null;
            return (
              <span key={id} className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-brand-subtle text-brand-primary text-[12px]">
                <span className="font-mono text-[10px] opacity-80">{t.id}</span>
                <span>{t.nameKo}</span>
                <button type="button" onClick={() => onToggleTech(id)} aria-label="제거"><X size={12} /></button>
              </span>
            );
          })}
          {customTechs.map(({ name, stream }) => (
            <span key={name} className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-orange-500/15 text-orange-300 text-[12px]">
              <span className="text-[9px] opacity-50">
                {stream === "가드포지션" ? "🛡" : stream === "탑포지션" ? "⚔️" : stream === "이스케이프" ? "🏃" : "🥋"}
              </span>
              <span>{name}</span>
              <button type="button" onClick={() => onRemoveCustom(name)} aria-label="제거"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 rounded-lg bg-bg-elevated border border-border-default px-3 text-left text-sm text-text-secondary hover:bg-bg-hover flex items-center justify-between"
      >
        <span>+ 기술 추가/편집</span>
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-border-default bg-bg-elevated p-3 max-h-72 overflow-y-auto">
          {goalTechniques.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <Heart size={11} fill="#F87171" color="#F87171" />
                <span className="text-[10px] font-semibold" style={{ color: "#F87171" }}>내 목표 기술</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {goalTechniques.map((t) => {
                  const checked = selectedTech.includes(t.recordId);
                  return (
                    <button
                      key={t.recordId}
                      type="button"
                      onClick={() => onToggleTech(t.recordId)}
                      className={cn(
                        "inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-[12px] font-medium transition-colors duration-fast border",
                        checked
                          ? "bg-brand-subtle text-brand-primary border-brand-primary/40"
                          : "bg-bg-base text-text-secondary border-border-subtle hover:bg-bg-hover",
                      )}
                    >
                      <span className="font-mono text-[10px] opacity-70">{t.id}</span>
                      <span>{t.nameKo}</span>
                      {checked && <Check size={11} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              ref={searchRef}
              type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="포지션명 또는 기술명 검색 (예: 하프 가드, CG-01)"
              className="w-full h-9 rounded-xl bg-bg-base border border-border-subtle pl-9 pr-8 text-sm focus:border-border-focus outline-none transition-colors duration-fast"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                <X size={13} />
              </button>
            )}
          </div>

          {canAddCustom && !pendingStream && (
            <button type="button" onClick={() => setPendingStream(q)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl text-sm text-left border border-dashed border-border-subtle hover:bg-bg-hover text-text-secondary transition-colors duration-fast">
              <Plus size={13} className="text-brand-primary shrink-0" />
              <span>
                <span className="text-text-tertiary text-xs">DB에 없는 기술 추가: </span>
                <span className="font-medium text-text-primary">"{q}"</span>
              </span>
            </button>
          )}

          {pendingStream && (
            <div className="mb-3 rounded-lg border border-orange-500/40 bg-orange-500/5 p-3">
              <p className="text-xs text-text-secondary mb-2">
                <span className="font-semibold text-orange-300">"{pendingStream}"</span> 스트림 선택
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {STREAM_OPTS.map(({ stream, emoji, label, color }) => (
                  <button key={stream} type="button"
                    onClick={() => { onAddCustom(pendingStream, stream); setPendingStream(null); setQuery(""); searchRef.current?.focus(); }}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border text-xs font-medium transition-all hover:brightness-110"
                    style={{ borderColor: color + "55", backgroundColor: color + "15", color }}>
                    <span>{emoji}</span><span>{label}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setPendingStream(null)}
                className="mt-2 w-full text-xs text-text-tertiary hover:text-text-secondary">취소</button>
            </div>
          )}

          {totalResults === 0 && !canAddCustom ? (
            <p className="text-xs text-text-tertiary py-4 text-center">검색 결과 없음</p>
          ) : (
            <div className="space-y-3">
              {groupedTechniques.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-medium text-text-secondary">{group.label}</span>
                    <span className="text-[9px] font-mono text-text-tertiary opacity-50">{group.shortId}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.list.map((t) => {
                      const checked = selectedTech.includes(t.recordId);
                      const isPositionSelf = t.parentId === null;
                      return (
                        <button key={t.recordId} type="button"
                          onClick={() => { onToggleTech(t.recordId); if (query) setQuery(""); }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-colors duration-fast",
                            isPositionSelf && !checked && "border border-dashed border-border-subtle",
                            checked ? "bg-brand-subtle text-brand-primary" : "hover:bg-bg-hover text-text-secondary",
                          )}>
                          <span className="font-mono text-[10px] opacity-70 w-10 shrink-0">{t.id}</span>
                          <span className="flex-1 truncate">
                            {t.nameKo}
                            {isPositionSelf && (
                              <span className="ml-1.5 text-[9px] font-semibold opacity-70">(포지션 전체)</span>
                            )}
                          </span>
                          {checked && <Check size={12} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SessionFormModal ──────────────────────────────────────────────────────────

export function SessionFormModal({
  initialDate,
  techniques,
  techniqueByShortId,
  goalTechRecordIds = [],
  initialSession,
  onClose,
}: {
  initialDate: string;
  techniques: Technique[];
  techniqueByShortId: Record<string, Technique>;
  goalTechRecordIds?: string[];
  initialSession?: TrainingSession;  // 수정 모드일 때 기존 세션 데이터
  onClose: () => void;
}) {
  const isEditMode = Boolean(initialSession);
  const action = isEditMode ? updateTrainingSessionAction : createTrainingSessionAction;
  const toast = useToast();

  const [state, formAction] = useFormState<CreateSessionFormState, FormData>(
    action,
    { ok: false },
  );

  // 수정 모드면 기존 값으로 초기화
  const [date, setDate] = useState(initialSession?.date ?? initialDate);
  const [selectedTech, setSelectedTech] = useState<string[]>(initialSession?.techniqueRecordIds ?? []);
  const [customTechs, setCustomTechs] = useState<{ name: string; stream: Stream }[]>([]);

  // 수정 모드: 기존 notes를 기술별 메모 + 전체 메모로 파싱
  const _parsed = initialSession?.notes
    ? parseSessionNotes(initialSession.notes, techniques)
    : { techNotes: {}, sessionNote: "" };

  // 기술별 디테일 메모
  const [techNotes, setTechNotes] = useState<Record<string, string>>(_parsed.techNotes);
  const [customTechNotes, setCustomTechNotes] = useState<Record<string, string>>({});
  // 시퀀스 직접 생성
  const [createSeq, setCreateSeq] = useState(false);
  const [newSeqName, setNewSeqName] = useState("");
  const [newSeqTechOrder, setNewSeqTechOrder] = useState<string[]>([]);
  const [seqSuggestions, setSeqSuggestions] = useState<string[]>([]);
  // 전체 세션 메모
  const [sessionNote, setSessionNote] = useState(_parsed.sessionNote);
  const sessionNoteRef = useRef<HTMLTextAreaElement>(null);

  const closedRef = useRef(false);
  const [celebLevel, setCelebLevel] = useState<LearningLevel | null>(null);

  useEffect(() => {
    if (!createSeq) return;
    setNewSeqTechOrder((prev) => {
      const kept  = prev.filter((id) => selectedTech.includes(id));
      const added = selectedTech.filter((id) => !prev.includes(id));
      return [...kept, ...added];
    });
  }, [selectedTech, createSeq]);

  useEffect(() => {
    if (state.ok && state.sessionId && !closedRef.current) {
      closedRef.current = true;
      if (state.levelUp) {
        setCelebLevel(state.levelUp as LearningLevel);
        // XP toast separately — level celebration takes center stage
        if (state.xpEarned && state.xpEarned > 0) {
          toast.show("xp", "수련 기록 저장 완료!", state.xpEarned);
        }
        // close modal after level celebration dismisses
      } else if (state.xpEarned && state.xpEarned > 0) {
        toast.show("xp", isEditMode ? "수련 기록 수정 완료!" : "수련 기록 저장 완료!", state.xpEarned);
        const t = setTimeout(() => onClose(), 800);
        return () => clearTimeout(t);
      } else {
        toast.show("success", isEditMode ? "수련 기록 수정 완료!" : "수련 기록 저장 완료!");
        const t = setTimeout(() => onClose(), 800);
        return () => clearTimeout(t);
      }
    }
  }, [state, onClose, toast, isEditMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const selectedTechObjects = useMemo(
    () => selectedTech.map((id) => techniques.find((t) => t.recordId === id)).filter(Boolean) as Technique[],
    [selectedTech, techniques],
  );

  const toggleTech = (id: string) =>
    setSelectedTech((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const addCustom = (name: string, stream: Stream) =>
    setCustomTechs((prev) => prev.some((c) => c.name === name) ? prev : [...prev, { name, stream }]);

  const removeCustom = (name: string) => {
    setCustomTechs((prev) => prev.filter((c) => c.name !== name));
    setCustomTechNotes((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const moveSeqTech = (idx: number, dir: -1 | 1) => {
    setNewSeqTechOrder((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const insertGuideToSession = useCallback((template: string) => {
    const el = sessionNoteRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end   = el.selectionEnd   ?? el.value.length;
    const before = el.value.slice(0, start);
    const after  = el.value.slice(end);
    const sep    = before && !before.endsWith("\n") ? "\n" : "";
    const newVal = before + sep + template + after;
    setSessionNote(newVal);
    setTimeout(() => {
      el.focus();
      const pos = (before + sep + template).length;
      el.setSelectionRange(pos, pos);
    }, 10);
  }, []);

  const buildCombinedNotes = useCallback(() => {
    const parts: string[] = [];
    for (const tech of selectedTechObjects) {
      const note = techNotes[tech.recordId]?.trim();
      if (note) parts.push(`[${tech.id} ${tech.nameKo}]\n${note}`);
    }
    for (const { name } of customTechs) {
      const note = customTechNotes[name]?.trim();
      if (note) parts.push(`[미등록: ${name}]\n${note}`);
    }
    if (sessionNote.trim()) {
      parts.push(parts.length > 0 ? `[전체 메모]\n${sessionNote.trim()}` : sessionNote.trim());
    }
    return parts.join("\n\n");
  }, [selectedTechObjects, customTechs, techNotes, customTechNotes, sessionNote]);

  const totalTechCount = selectedTech.length + customTechs.length;
  const canSubmit = totalTechCount > 0;

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("notes");
    const combined = buildCombinedNotes();
    if (combined) fd.set("notes", combined);
    formAction(fd);
  }, [buildCombinedNotes, formAction]);

  const submitLabel = isEditMode ? "수정 저장" : "수련 기록 저장";
  const headerTitle = isEditMode ? "수련 기록 수정" : "수련 기록";
  const headerSub   = isEditMode ? "기술, 날짜, 메모를 수정할 수 있어요" : "오늘 배운 것을 디테일까지 남겨보세요";

  return (
    <div
      className="fixed inset-0 z-modal flex items-end lg:items-center justify-center"
      role="dialog" aria-modal="true" aria-labelledby="session-form-title"
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-label="닫기"
      />
      <motion.div
        className="relative w-full lg:max-w-lg lg:mx-4 max-h-[94vh] overflow-y-auto bg-bg-base border-t lg:border border-border-default rounded-t-2xl lg:rounded-2xl shadow-modal"
        initial={{ y: "100%", opacity: 0.9 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
      >

        {/* 헤더 */}
        <header className="sticky top-0 bg-bg-base border-b border-border-subtle px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="session-form-title" className="text-lg font-bold">{headerTitle}</h2>
            <p className="text-[11px] text-text-tertiary mt-px">{headerSub}</p>
          </div>
          <button type="button" onClick={onClose}
            className="size-8 rounded-xl hover:bg-bg-hover active:scale-95 transition-all duration-fast flex items-center justify-center text-text-tertiary" aria-label="닫기">
            <X size={18} />
          </button>
        </header>

        {/* 완료 화면 */}
        {state.ok && state.sessionId ? (
          <div className="p-8 text-center space-y-3">
            <div className="size-16 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center mx-auto">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold">{isEditMode ? "수정 완료! ✏️" : "기록 완료! 💪"}</h3>
            {!isEditMode && typeof state.xpEarned === "number" && (
              <div className="space-y-1">
                <p className="text-xl font-black text-brand-primary tabular-nums">
                  +{state.xpEarned.toLocaleString()} XP
                </p>
                {typeof state.streakBonus === "number" && state.streakBonus > 0 && (
                  <p className="text-sm text-orange-400 font-semibold">
                    🔥 {state.streak}일 연속 보너스 +{state.streakBonus} XP
                  </p>
                )}
              </div>
            )}
            {!isEditMode && typeof state.streak === "number" && state.streak > 0 && (
              <p className="text-xs text-orange-300/80">
                {state.streak >= 30 ? "전설의 수련러 👑" : state.streak >= 7 ? "🔥 강철 의지!" : `${state.streak}일 연속 수련 중`}
              </p>
            )}
            <p className="text-xs text-text-tertiary">기술도감과 시퀀스에 자동 반영됐어요</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {state.error && (
              <div className="rounded-xl bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
                {state.error}
              </div>
            )}

            {/* 수정 모드: 세션 ID hidden */}
            {isEditMode && initialSession && (
              <input type="hidden" name="sessionRecordId" value={initialSession.recordId} />
            )}

            {/* 날짜 */}
            <Field label="날짜" required>
              <input
                type="date" name="date" value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-11 rounded-xl bg-bg-base border border-border-subtle px-4 text-text-primary focus:border-border-focus outline-none transition-colors duration-fast"
              />
            </Field>

            {/* 기술 태그 */}
            <Field
              label={`기술 태그${totalTechCount > 0 ? ` (${totalTechCount}개 선택됨)` : ""}`}
              hint="DB 검색 또는 직접 입력으로 오늘 배운 기술을 태그하세요."
            >
              {selectedTech.map((id) => (
                <input key={id} type="hidden" name="techniques" value={id} />
              ))}
              {customTechs.map(({ name, stream }) => (
                <span key={name} style={{ display: "contents" }}>
                  <input type="hidden" name="customTechniques" value={name} />
                  <input type="hidden" name={`customTechStream_${name}`} value={stream} />
                </span>
              ))}
              <TechPicker
                techniques={techniques}
                techniqueByShortId={techniqueByShortId}
                selectedTech={selectedTech}
                customTechs={customTechs}
                goalTechRecordIds={goalTechRecordIds}
                onToggleTech={toggleTech}
                onAddCustom={addCustom}
                onRemoveCustom={removeCustom}
              />
            </Field>

            {/* 기술별 디테일 메모 */}
            {(selectedTechObjects.length > 0 || customTechs.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Pen size={13} className="text-brand-primary" />
                  <label className="text-sm font-semibold text-text-primary">기술별 디테일 메모</label>
                  <span className="text-[11px] text-text-tertiary">— 가장 중요한 부분이에요</span>
                </div>
                {selectedTechObjects.map((tech) => (
                  <PerTechNote
                    key={tech.recordId} technique={tech}
                    value={techNotes[tech.recordId] ?? ""}
                    onChange={(v) => setTechNotes((prev) => ({ ...prev, [tech.recordId]: v }))}
                  />
                ))}
                {customTechs.map(({ name, stream }) => (
                  <div key={name} className="rounded-lg border border-orange-500/30 bg-bg-elevated overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-bg-overlay/50">
                      <span className="text-[10px] font-mono text-orange-400 opacity-80">
                        {stream === "가드포지션" ? "🛡" : stream === "탑포지션" ? "⚔️" : stream === "이스케이프" ? "🏃" : "🥋"} 미등록
                      </span>
                      <span className="text-[12px] font-semibold text-text-primary">{name}</span>
                    </div>
                    <textarea
                      value={customTechNotes[name] ?? ""}
                      onChange={(e) => setCustomTechNotes((prev) => ({ ...prev, [name]: e.target.value }))}
                      placeholder={`${name} — 오늘 배운 디테일을 기록해보세요.`}
                      rows={2}
                      className="w-full bg-transparent px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled resize-none outline-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 전체 세션 메모 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">전체 수련 메모</label>
                <span className="text-[11px] text-text-tertiary">(선택)</span>
              </div>
              <DetailGuidePanel onInsert={insertGuideToSession} />
              <textarea
                ref={sessionNoteRef}
                name="notes_hidden"
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                rows={4}
                placeholder={`컨디션, 전체적인 인사이트, 파트너 피드백 등을 자유롭게 기록하세요.\n기술별 디테일은 위에서 각 기술마다 따로 적어주세요.`}
                className="w-full rounded-xl bg-bg-base border border-border-subtle p-3 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus outline-none resize-none leading-relaxed transition-colors duration-fast"
              />
            </div>

            {/* 이 기술들로 시퀀스 만들기 */}
            {selectedTech.length >= 2 && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (!createSeq) setNewSeqTechOrder([...selectedTech]);
                    setCreateSeq((v) => !v);
                    setNewSeqName("");
                    setSeqSuggestions([]);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm"
                  style={{
                    borderColor: createSeq ? "rgba(123,97,255,0.4)" : "rgba(255,255,255,0.06)",
                    backgroundColor: createSeq ? "rgba(123,97,255,0.08)" : "rgba(255,255,255,0.03)",
                    color: createSeq ? "#A78BFA" : "#6B7280",
                  }}
                >
                  <Link2 size={14} />
                  <span className="font-semibold flex-1 text-left">이 기술들로 시퀀스 만들기</span>
                  {createSeq ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {createSeq && (
                  <div className="mt-2 rounded-lg p-4 space-y-3 border"
                    style={{ backgroundColor: "rgba(123,97,255,0.06)", borderColor: "rgba(123,97,255,0.25)" }}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold" style={{ color: "#A78BFA" }}>
                          시퀀스 이름 <span style={{ color: "#F87171" }}>*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const suggestions = generateSeqNameSuggestions(newSeqTechOrder, techniques);
                            setSeqSuggestions(suggestions);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80 active:scale-95"
                          style={{ backgroundColor: "rgba(123,97,255,0.15)", color: "#A78BFA", border: "1px solid rgba(123,97,255,0.3)" }}
                        >
                          <Sparkles size={11} />
                          이름 추천
                        </button>
                      </div>
                      <input
                        type="text" value={newSeqName}
                        onChange={(e) => { setNewSeqName(e.target.value); setSeqSuggestions([]); }}
                        placeholder="예) 롱스텝 백테이크, 딥하프 스윕 콤보…"
                        className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-text-disabled outline-none focus:ring-1"
                        style={{ backgroundColor: "#0A0A0F", border: "1px solid rgba(123,97,255,0.3)" }}
                      />
                      {seqSuggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {seqSuggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { setNewSeqName(s); setSeqSuggestions([]); }}
                              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-90 active:scale-95"
                              style={{ backgroundColor: "rgba(123,97,255,0.2)", color: "#C4B5FD", border: "1px solid rgba(123,97,255,0.35)" }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#A78BFA" }}>
                        단계 순서 — ▲▼로 조정
                      </label>
                      <div className="space-y-1">
                        {newSeqTechOrder.map((id, idx) => {
                          const tech = techniques.find((t) => t.recordId === id);
                          if (!tech) return null;
                          return (
                            <div key={id} className="flex items-center gap-2 rounded-xl px-3 py-2"
                              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                              <span className="text-[10px] tabular-nums w-4 text-center font-bold" style={{ color: "#7B61FF" }}>
                                {idx + 1}
                              </span>
                              <span className="font-mono text-[10px] w-10 shrink-0" style={{ color: "#7B61FF", opacity: 0.8 }}>
                                {tech.id}
                              </span>
                              <span className="flex-1 text-sm text-white truncate">{tech.nameKo}</span>
                              <div className="flex flex-col gap-0.5 shrink-0">
                                <button type="button" onClick={() => moveSeqTech(idx, -1)} disabled={idx === 0}
                                  className="w-5 h-4 flex items-center justify-center rounded disabled:opacity-40 hover:bg-white/10 transition-colors"
                                  style={{ color: "#A78BFA" }}><ChevronUp size={10} /></button>
                                <button type="button" onClick={() => moveSeqTech(idx, 1)} disabled={idx === newSeqTechOrder.length - 1}
                                  className="w-5 h-4 flex items-center justify-center rounded disabled:opacity-40 hover:bg-white/10 transition-colors"
                                  style={{ color: "#A78BFA" }}><ChevronDown size={10} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {newSeqTechOrder.length >= 2 && (
                      <div className="rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                        style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#6B7280" }}>
                        <span style={{ color: "#A78BFA" }} className="font-semibold mr-1">미리보기:</span>
                        {newSeqTechOrder.map((id) => techniques.find((t) => t.recordId === id)?.nameKo).filter(Boolean).join(" → ")}
                      </div>
                    )}
                    {newSeqName.trim() && newSeqTechOrder.length >= 2 && (
                      <>
                        <input type="hidden" name="createSequence" value="true" />
                        <input type="hidden" name="newSeqName" value={newSeqName.trim()} />
                        {newSeqTechOrder.map((id) => (
                          <input key={id} type="hidden" name="newSeqTechOrder" value={id} />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* XP 미리보기 (신규 기록 전용) */}
            {!isEditMode && (
              <div className="rounded-lg bg-bg-elevated border border-border-subtle p-3 flex items-center justify-between">
                <span className="text-xs text-text-tertiary">예상 XP</span>
                <span className="text-lg font-black text-brand-primary tabular-nums">
                  +{(selectedTech.length * 100).toLocaleString()} XP
                </span>
              </div>
            )}

            <SubmitButton disabled={!canSubmit} label={submitLabel} />
            {!canSubmit && (
              <p className="text-[11px] text-text-tertiary text-center">
                기술을 최소 하나는 태그해야 저장할 수 있어요.
              </p>
            )}
          </form>
        )}
      </motion.div>
      <AnimatePresence>
        {celebLevel && (
          <LevelUpCelebration
            level={celebLevel}
            onDismiss={() => {
              setCelebLevel(null);
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label, hint, required, children,
}: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
    </div>
  );
}
