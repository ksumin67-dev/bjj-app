"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useMemo } from "react";
import {
  Search, X, ChevronDown, ArrowUp, ArrowDown, Star, Plus, Heart, History,
  Sparkles, Pencil, ListOrdered, FileText, SlidersHorizontal, type LucideIcon,
} from "lucide-react";
import {
  createGamePlanAction,
  updateGamePlanAction,
  type CreateGamePlanFormState,
} from "@/lib/actions/gamePlans";
import type { RecommendedPlan, Recommendations } from "@/lib/gamePlanRecommend";
import type { Technique, GamePlan } from "@/types/domain";
import { cn, normalizeKorean } from "@/lib/utils";

/*
 * 홈 화면 톤앤매너 (2026-09-20)
 *   섹션 대제목   14.5px bold white + 아이콘 (홈 '오늘의 수련' 등과 동일)
 *   본문/입력/목록 13~13.5px normal
 *   보조 설명     11px #8A8A94
 *   섹션 면       #14171D 라운드 14 (홈 톤온톤 서피스), 면 안의 입력칸은 한 단계 더 어둡게
 */

const MUTED = "#8A8A94";
const SURFACE = "#14171D";   // 섹션 카드
const FIELD_BG = "#0A0C10";  // 카드 안 입력칸/목록 행
const FIELD_BORDER = "#23262E";

const fieldStyle = { backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER}` } as const;

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full py-3 rounded-xl font-bold text-[14px] text-white transition-all duration-base",
        "hover:brightness-110 active:scale-[0.97]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      style={{ backgroundColor: "#D9772E" }}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function GamePlanForm({
  mode = "create",
  initial,
  techniques,
  positionNameById,
  goalTechniqueIds = [],
  recentTechniqueIds = [],
  recommendations,
}: {
  mode?: "create" | "edit";
  initial?: GamePlan;
  /** AI 추천 게임플랜 — 새로 만들 때만 전달 */
  recommendations?: Recommendations;
  techniques: Technique[];
  /** 포지션 짧은 ID(예: "CG") → 한글 이름. 기술 선택창의 그룹 제목에 사용 */
  positionNameById: Record<string, string>;
  /** 내가 배우고 싶은 기술(찜) recordId */
  goalTechniqueIds?: string[];
  /** 최근 수련한 기술 recordId (최신순) */
  recentTechniqueIds?: string[];
}) {
  const isEdit = mode === "edit";
  const [state, formAction] = useFormState<CreateGamePlanFormState, FormData>(
    isEdit ? updateGamePlanAction : createGamePlanAction,
    { ok: true },
  );

  const [planName, setPlanName] = useState(initial?.planName ?? "");
  const [stepsText, setStepsText] = useState(initial?.stepsText ?? "");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(
    initial?.techniquesUsedRecordIds ?? [],
  );
  const [isPrimary, setIsPrimary] = useState(initial?.isPrimary ?? false);
  const [hasBranch, setHasBranch] = useState(initial?.hasBranch ?? false);
  const [branchCondition, setBranchCondition] = useState(initial?.branchCondition ?? "");
  const [moreOpen, setMoreOpen] = useState(
    Boolean(initial?.isPrimary || initial?.hasBranch),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [techPickerOpen, setTechPickerOpen] = useState(false);
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

  const techByRecordId = useMemo(() => {
    const m = new Map<string, Technique>();
    for (const t of techniques) m.set(t.recordId, t);
    return m;
  }, [techniques]);

  const goalTechs = useMemo(
    () => goalTechniqueIds.map((id) => techByRecordId.get(id)).filter((t): t is Technique => Boolean(t)),
    [goalTechniqueIds, techByRecordId],
  );
  const recentTechs = useMemo(
    () => recentTechniqueIds.map((id) => techByRecordId.get(id)).filter((t): t is Technique => Boolean(t)).slice(0, 8),
    [recentTechniqueIds, techByRecordId],
  );

  // 기술을 포지션 단위로 그룹핑 (parentId 기반) — 제목은 포지션 한글 이름
  const groupedTechniques = useMemo(() => {
    // normalizeKorean으로 된소리/예사소리 표기 차이(예: "라쏘"/"라소")를
    // 무시하고 매칭 — SessionFormModal의 기술 검색과 동일한 규칙.
    const q = normalizeKorean(searchQuery);
    const filtered = q
      ? techniques.filter(
          (t) =>
            normalizeKorean(t.nameKo).includes(q) ||
            normalizeKorean(t.nameEn).includes(q) ||
            normalizeKorean(t.id).includes(q),
        )
      : techniques;

    const groups: Record<string, Technique[]> = {};
    for (const t of filtered) {
      const posId = t.parentId ?? "기타";
      if (!groups[posId]) groups[posId] = [];
      groups[posId].push(t);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [techniques, searchQuery]);

  function toggleTechnique(recordId: string) {
    setSelectedTechniques((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId],
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setSelectedTechniques((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setSelectedTechniques((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  function applyRecommendation(plan: RecommendedPlan) {
    setPlanName(plan.name);
    setStepsText(plan.note);
    setSelectedTechniques(plan.techRecordIds);
    setAppliedTemplate(plan.id);
  }

  return (
    <form action={formAction} className="space-y-3">
      {isEdit && initial && <input type="hidden" name="planId" value={initial.recordId} />}

      {state.error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 p-3 text-[13px] text-danger">
          {state.error}
        </div>
      )}

      {/* AI 추천 게임플랜 — 새로 만들 때만. 수련 기록·좋아요한 기술/선수 기반, 없으면 기본 템플릿 */}
      {!isEdit && recommendations && recommendations.plans.length > 0 && (
        <SectionCard
          icon={Sparkles}
          title="AI 추천 게임플랜"
          hint={
            recommendations.personalized
              ? "내 수련 기록과 좋아요한 기술·선수를 바탕으로 만들었어요. 고르면 아래에 채워져요."
              : "기본 추천이에요. 수련을 기록하거나 기술·선수에 좋아요를 누르면 나만의 추천이 만들어져요."
          }
        >
          <div className="space-y-2">
            {recommendations.plans.map((plan) => {
              const active = appliedTemplate === plan.id;
              const names = plan.techRecordIds
                .map((id) => techByRecordId.get(id)?.nameKo)
                .filter((n): n is string => Boolean(n));
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => applyRecommendation(plan)}
                  className="w-full text-left rounded-xl px-3.5 py-3 transition-colors duration-fast active:scale-[0.98]"
                  style={{
                    backgroundColor: FIELD_BG,
                    border: active ? "1px solid rgba(217,119,46,0.6)" : `1px solid ${FIELD_BORDER}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-white">{plan.name}</p>
                    {active && (
                      <span className="text-[11px] font-semibold shrink-0" style={{ color: "#D9772E" }}>
                        적용됨
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] font-normal mt-1" style={{ color: "#B4BCC8" }}>
                    {names.join(" → ")}
                  </p>
                  <p className="text-[11px] font-normal mt-1.5" style={{ color: MUTED }}>
                    {plan.reason}
                  </p>
                </button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* 게임플랜 이름 */}
      <SectionCard icon={Pencil} title="게임플랜 이름" required>
        <input
          type="text"
          name="planName"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="예) 클가 → 백테이크 가는 길"
          required
          maxLength={120}
          className="w-full h-11 rounded-xl px-4 text-[13.5px] text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
          style={fieldStyle}
        />
      </SectionCard>

      {/* 사용 기술 (순서 포함 멀티 선택) */}
      <SectionCard
        icon={ListOrdered}
        title={`사용 기술 · ${selectedTechniques.length}개`}
        hint="순서대로 이어서 쓸 기술을 골라주세요. 첫 기술의 포지션이 시작 포지션으로 자동 지정돼요."
      >
        {selectedTechniques.length > 0 && (
          <div className="mb-2 space-y-1.5">
            {selectedTechniques.map((recordId, idx) => {
              const t = techByRecordId.get(recordId);
              if (!t) return null;
              return (
                <div
                  key={recordId}
                  className="flex items-center gap-2 rounded-lg px-2 py-2"
                  style={{ backgroundColor: FIELD_BG }}
                >
                  <span
                    className="size-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#D9772E30", color: "#D9772E" }}
                  >
                    {idx + 1}
                  </span>

                  <span className="flex-1 min-w-0 flex items-center gap-1.5 text-[13px] font-normal truncate text-white">
                    <span className="font-mono text-[11px]" style={{ color: MUTED }}>{t.id}</span>
                    <span className="truncate">{t.nameKo}</span>
                  </span>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="size-7 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
                      aria-label="위로"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === selectedTechniques.length - 1}
                      className="size-7 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
                      aria-label="아래로"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTechnique(recordId)}
                      className="size-7 rounded flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-bg-elevated transition-colors"
                      aria-label="제거"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* hidden inputs for selected technique recordIds (순서 유지) */}
        {selectedTechniques.map((recordId) => (
          <input key={recordId} type="hidden" name="techniques" value={recordId} />
        ))}

        <button
          type="button"
          onClick={() => setTechPickerOpen((v) => !v)}
          className="w-full h-11 rounded-xl px-4 text-left text-[13px] font-normal text-text-secondary hover:bg-bg-hover transition-colors duration-fast flex items-center justify-between"
          style={fieldStyle}
        >
          <span className="inline-flex items-center gap-1.5">
            <Plus size={14} />기술 추가 / 편집
          </span>
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-base", techPickerOpen && "rotate-180")}
          />
        </button>

        {techPickerOpen && (
          <div className="mt-2 rounded-2xl p-3 max-h-96 overflow-y-auto" style={{ backgroundColor: FIELD_BG }}>
            <div className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="기술명 / 영문 / ID 검색"
                className="w-full h-9 rounded-xl pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
                style={{ backgroundColor: SURFACE, border: `1px solid ${FIELD_BORDER}` }}
              />
            </div>

            {/* 빠른 추가 — 검색 중에는 숨김 */}
            {!searchQuery.trim() && (goalTechs.length > 0 || recentTechs.length > 0) && (
              <div className="mb-4 space-y-3">
                {goalTechs.length > 0 && (
                  <QuickGroup
                    icon={<Heart size={12} fill="#F87171" color="#F87171" />}
                    title="내가 배우고 싶은 기술"
                    techs={goalTechs}
                    selected={selectedTechniques}
                    onToggle={toggleTechnique}
                  />
                )}
                {recentTechs.length > 0 && (
                  <QuickGroup
                    icon={<History size={12} color={MUTED} />}
                    title="최근 수련한 기술"
                    techs={recentTechs}
                    selected={selectedTechniques}
                    onToggle={toggleTechnique}
                  />
                )}
              </div>
            )}

            {groupedTechniques.length === 0 ? (
              <p className="text-[12px] text-text-tertiary py-4 text-center">검색 결과 없음</p>
            ) : (
              <div className="space-y-3">
                {groupedTechniques.map(([posId, list]) => (
                  <div key={posId}>
                    <div className="text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                      {positionNameById[posId] ?? posId}
                    </div>
                    <div className="space-y-0.5">
                      {list.map((t) => (
                        <TechRow
                          key={t.recordId}
                          tech={t}
                          orderNum={selectedTechniques.indexOf(t.recordId) + 1}
                          onToggle={toggleTechnique}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* 설명 (선택) */}
      <SectionCard
        icon={FileText}
        title="설명 (선택)"
        hint="언제 쓰는지, 막히면 어떻게 하는지 같은 흐름을 자유롭게 적어두세요."
      >
        <textarea
          name="stepsText"
          rows={4}
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          placeholder={"예) 힙범프가 막히면 암바로, 상대가 팔을 빼면 기무라로 이어가기"}
          className="w-full rounded-xl px-4 py-3 text-[13.5px] text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none resize-none transition-colors duration-fast"
          style={fieldStyle}
        />
      </SectionCard>

      {/* 추가 옵션 — 주력 표시 / 분기 조건 (접어둠. 닫혀 있어도 값은 그대로 제출됨) */}
      <SectionCard
        icon={SlidersHorizontal}
        title="추가 옵션"
        iconColor={MUTED}
        onHeaderClick={() => setMoreOpen((v) => !v)}
        open={moreOpen}
      >
        <div className={cn("space-y-4", !moreOpen && "hidden")}>
          <label
            className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors duration-fast"
            style={{ backgroundColor: FIELD_BG }}
          >
            <span className="flex items-center gap-2">
              <Star size={14} color="#D9772E" fill={isPrimary ? "#D9772E" : "none"} />
              <span className="text-[13px] font-semibold text-white">주력 기술로 표시</span>
            </span>
            <input
              type="checkbox"
              name="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="size-4 accent-[#D9772E]"
            />
          </label>

          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                name="hasBranch"
                checked={hasBranch}
                onChange={(e) => setHasBranch(e.target.checked)}
                className="size-4 accent-[#D9772E]"
              />
              <span className="text-[13px] font-normal text-white">분기 조건 있음</span>
            </label>
            {hasBranch && (
              <input
                type="text"
                name="branchCondition"
                value={branchCondition}
                onChange={(e) => setBranchCondition(e.target.value)}
                placeholder="예) 상대가 일어서면 → 암 드래그 → 백 테이크"
                className="w-full h-11 rounded-xl px-4 text-[13.5px] text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
                style={fieldStyle}
              />
            )}
          </div>
        </div>
      </SectionCard>

      <div className="pt-2">
        <SubmitButton
          label={isEdit ? "수정 내용 저장" : "게임플랜 저장"}
          pendingLabel="저장 중..."
        />
      </div>
    </form>
  );
}

function TechRow({
  tech, orderNum, onToggle,
}: { tech: Technique; orderNum: number; onToggle: (recordId: string) => void }) {
  const checked = orderNum > 0;
  return (
    <button
      type="button"
      onClick={() => onToggle(tech.recordId)}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-[13px] transition-colors duration-fast",
        checked ? "bg-brand-subtle text-brand-primary" : "hover:bg-bg-hover text-text-secondary",
      )}
    >
      {checked ? (
        <span className="size-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 bg-brand-primary text-text-inverse">
          {orderNum}
        </span>
      ) : (
        <span className="size-2 rounded-full shrink-0 ml-1 bg-text-tertiary" />
      )}
      <span className="font-mono text-[11px] opacity-70">{tech.id}</span>
      <span className="flex-1 truncate">{tech.nameKo}</span>
    </button>
  );
}

function QuickGroup({
  icon, title, techs, selected, onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  techs: Technique[];
  selected: string[];
  onToggle: (recordId: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[11px] font-semibold" style={{ color: MUTED }}>{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {techs.map((t) => {
          const idx = selected.indexOf(t.recordId);
          const on = idx >= 0;
          return (
            <button
              key={t.recordId}
              type="button"
              onClick={() => onToggle(t.recordId)}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[12px] font-normal transition-colors duration-fast"
              style={
                on
                  ? { backgroundColor: "rgba(217,119,46,0.18)", color: "#D9772E" }
                  : { backgroundColor: "rgba(255,255,255,0.06)", color: "#E5E7EB" }
              }
            >
              {on && <span className="text-[11px] font-bold">{idx + 1}</span>}
              {t.nameKo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 섹션 카드 — 홈 화면과 같은 톤온톤 서피스 + 아이콘 달린 대제목(14.5px bold).
 * onHeaderClick이 있으면 헤더를 눌러 접고 펼치는 섹션(추가 옵션)이 된다.
 */
function SectionCard({
  icon: Icon,
  title,
  hint,
  required,
  iconColor = "#D9772E",
  onHeaderClick,
  open,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  required?: boolean;
  iconColor?: string;
  onHeaderClick?: () => void;
  open?: boolean;
  children: React.ReactNode;
}) {
  const header = (
    <>
      <Icon size={16} color={iconColor} className="shrink-0" />
      <h2 className="text-[14.5px] font-bold text-white">
        {title}
        {required && <span className="text-danger ml-1">*</span>}
      </h2>
      {onHeaderClick && (
        <ChevronDown
          size={16}
          className={cn("ml-auto transition-transform duration-base", open && "rotate-180")}
          style={{ color: MUTED }}
        />
      )}
    </>
  );

  const collapsed = onHeaderClick && !open;

  return (
    <section style={{ backgroundColor: SURFACE, borderRadius: 14, padding: 14 }}>
      {onHeaderClick ? (
        <button
          type="button"
          onClick={onHeaderClick}
          className={cn("w-full flex items-center gap-1.5 text-left", !collapsed && "mb-3")}
        >
          {header}
        </button>
      ) : (
        <div className={cn("flex items-center gap-1.5", hint ? "mb-1" : "mb-3")}>{header}</div>
      )}
      {hint && !onHeaderClick && (
        <p className="text-[11px] font-normal mb-3" style={{ color: MUTED }}>
          {hint}
        </p>
      )}
      {children}
    </section>
  );
}
