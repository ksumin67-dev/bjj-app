"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ArrowUp, ArrowDown, Star } from "lucide-react";
import {
  createSequenceAction,
  type CreateSequenceFormState,
} from "@/lib/actions/sequences";
import type { Technique } from "@/types/domain";
import { cn, normalizeKorean } from "@/lib/utils";

function SubmitButton() {
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
      {pending ? "저장 중..." : "게임플랜 저장"}
    </button>
  );
}

export function SequenceForm({
  positions,
  techniques,
  positionsById,
}: {
  positions: Technique[];
  techniques: Technique[];
  positionsById: Record<string, Technique>;
}) {
  const [state, formAction] = useFormState<
    CreateSequenceFormState,
    FormData
  >(createSequenceAction, { ok: true });

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [hasBranch, setHasBranch] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [techPickerOpen, setTechPickerOpen] = useState(false);

  // 기술을 포지션 순으로 그룹핑 (parentId 기반)
  const groupedTechniques = useMemo(() => {
    // normalizeKorean으로 된소리/예사소리 표기 차이(예: "라쏘"/"라소")를
    // 무시하고 매칭 — SessionFormModal의 기술 검색과 동일한 규칙(2026-09-19).
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
    return groups;
  }, [techniques, searchQuery]);

  const sortedPositions = useMemo(
    () => [...positions].sort((a, b) => a.id.localeCompare(b.id)),
    [positions],
  );

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

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* 게임플랜 이름 */}
      <FormField label="게임플랜 이름" required>
        <input
          type="text"
          name="seqName"
          placeholder="예) 클가 → 백테이크 가는 길"
          required
          maxLength={120}
          className="w-full h-11 rounded-xl bg-bg-base border border-border-subtle px-4 text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
        />
      </FormField>

      {/* 주력 기술로 표시 */}
      <label
        className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors duration-fast"
        style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(217,119,46,0.35)" }}
      >
        <span className="flex items-center gap-2">
          <Star size={14} color="#D9772E" fill={isPrimary ? "#D9772E" : "none"} />
          <span className="text-sm font-bold text-white">주력 기술로 표시</span>
        </span>
        <input
          type="checkbox"
          name="isPrimary"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
          className="size-4 accent-[#D9772E]"
        />
      </label>

      {/* 시작 포지션 */}
      <FormField label="시작 포지션">
        <div className="relative">
          <select
            name="startPosition"
            defaultValue=""
            className="w-full h-11 rounded-xl bg-bg-base border border-border-subtle px-4 pr-9 text-text-primary appearance-none focus:border-border-focus outline-none transition-colors duration-fast"
          >
            <option value="">선택 안 함</option>
            {sortedPositions.map((pos) => (
              <option key={pos.recordId} value={pos.recordId}>
                {pos.id} · {pos.nameKo}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
        </div>
      </FormField>

      {/* 사용 기술 (순서 포함 멀티 선택) */}
      <FormField label={`사용 기술 (${selectedTechniques.length}개 선택)`}>
        {/* 선택된 기술 — 순서 재정렬 가능 */}
        {selectedTechniques.length > 0 && (
          <div className="mb-2 space-y-1.5">
            {selectedTechniques.map((recordId, idx) => {
              const t = techniques.find((x) => x.recordId === recordId);
              if (!t) return null;
              return (
                <div
                  key={recordId}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  style={{ backgroundColor: "#1A1A24", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* 순서 번호 */}
                  <span
                    className="size-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#D9772E30", color: "#D9772E" }}
                  >
                    {idx + 1}
                  </span>

                  {/* 기술 정보 */}
                  <span className="flex-1 min-w-0 flex items-center gap-1.5 text-[12px] font-normal truncate text-white">
                    <span className="font-mono text-[10px] opacity-70">{t.id}</span>
                    <span>{t.nameKo}</span>
                  </span>

                  {/* 순서 버튼 */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="size-6 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
                      aria-label="위로"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === selectedTechniques.length - 1}
                      className="size-6 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 transition-colors"
                      aria-label="아래로"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTechnique(recordId)}
                      className="size-6 rounded flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-bg-elevated transition-colors"
                      aria-label="제거"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* hidden inputs for selected technique recordIds (순서 유지) */}
        {selectedTechniques.map((recordId) => (
          <input
            key={recordId}
            type="hidden"
            name="techniques"
            value={recordId}
          />
        ))}

        {/* 토글 버튼 */}
        <button
          type="button"
          onClick={() => setTechPickerOpen((v) => !v)}
          className="w-full h-11 rounded-xl bg-bg-base border border-border-subtle px-4 text-left text-sm text-text-secondary hover:bg-bg-hover transition-colors duration-fast flex items-center justify-between"
        >
          <span>+ 기술 추가/편집</span>
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-base",
              techPickerOpen && "rotate-180",
            )}
          />
        </button>

        {techPickerOpen && (
          <div className="mt-2 rounded-2xl border border-border-subtle bg-bg-elevated p-3 max-h-80 overflow-y-auto">
            {/* 검색 */}
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
                className="w-full h-9 rounded-xl bg-bg-base border border-border-subtle pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
              />
            </div>

            {Object.keys(groupedTechniques).length === 0 ? (
              <p className="text-xs text-text-tertiary py-4 text-center">
                검색 결과 없음
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedTechniques).map(([posId, list]) => (
                  <div key={posId}>
                    <div className="text-[10px] font-mono uppercase text-text-tertiary mb-1">
                      {posId}
                    </div>
                    <div className="space-y-1">
                      {list.map((t) => {
                        const checked = selectedTechniques.includes(t.recordId);
                        const orderNum = selectedTechniques.indexOf(t.recordId) + 1;
                        return (
                          <button
                            key={t.recordId}
                            type="button"
                            onClick={() => toggleTechnique(t.recordId)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm transition-colors duration-fast",
                              checked
                                ? "bg-brand-subtle text-brand-primary"
                                : "hover:bg-bg-hover text-text-secondary",
                            )}
                          >
                            {checked ? (
                              <span className="size-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 bg-brand-primary text-text-inverse">
                                {orderNum}
                              </span>
                            ) : (
                              <span className="size-2 rounded-full shrink-0 ml-1 bg-text-tertiary" />
                            )}
                            <span className="font-mono text-[10px] opacity-70">
                              {t.id}
                            </span>
                            <span className="flex-1 truncate">
                              {t.nameKo}
                            </span>
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
      </FormField>

      {/* 단계 텍스트 */}
      <FormField
        label="단계 메모"
        hint="기술 순서나 흐름을 자유롭게 적어두세요. 줄바꿈으로 단계 구분 권장."
      >
        <textarea
          name="stepsText"
          rows={5}
          placeholder={"1) 자세 무너뜨리기\n2) 시저 스윕 시도\n3) 마운트 컨트롤 진입"}
          className="w-full rounded-xl bg-bg-base border border-border-subtle px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none resize-none transition-colors duration-fast"
        />
      </FormField>

      {/* 분기 */}
      <FormField label="분기 조건 (선택)">
        <label className="inline-flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            name="hasBranch"
            checked={hasBranch}
            onChange={(e) => setHasBranch(e.target.checked)}
            className="size-4 accent-brand-primary"
          />
          <span className="text-sm text-text-secondary">분기 있음</span>
        </label>
        {hasBranch && (
          <input
            type="text"
            name="branchCondition"
            placeholder="예) 상대가 일어서면 → BF-03 암 드래그→백 사용"
            className="w-full h-11 rounded-xl bg-bg-base border border-border-subtle px-4 text-text-primary placeholder:text-text-tertiary focus:border-border-focus outline-none transition-colors duration-fast"
          />
        )}
      </FormField>

      <SubmitButton />
    </form>
  );
}

function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
    </div>
  );
}
