"use client";

import { useState, useTransition, useMemo } from "react";
import type { Technique, Stream, GiNogi, TechniqueType } from "@/types/domain";
import type { CustomTechnique } from "@/lib/airtable/customTechniques";
import { actionDeleteCustomTechnique } from "@/app/admin/techniques/actions";
import {
  actionCreateTechnique,
  actionUpdateTechnique,
  actionDeleteTechnique,
} from "@/app/admin/techniques/actions";

// ── constants ────────────────────────────────────────────────────────────────

const STREAMS: (Stream | "전체")[] = ["전체", "가드포지션", "탑포지션", "이스케이프", "스탠딩"];
const GI_NOGI_OPTS: GiNogi[] = ["기전용", "노기전용", "기·노기공통"];
const TYPES: TechniqueType[] = [
  "스윕", "서브미션", "패스", "이탈", "전환", "컨트롤",
  "디펜스", "리텐션", "혈관초크", "무릎", "발목", "팔꿈치",
  "어깨", "셋업", "포지션", "이스케이프", "테이크다운",
  "가드", "탑포지션", "방어",
];

const STREAM_COLOR: Record<string, string> = {
  가드스윕: "bg-blue-500/15 text-blue-300",
  탑패스: "bg-orange-500/15 text-orange-300",
  이스케이프: "bg-violet-500/15 text-violet-300",
  스탠딩: "bg-amber-500/15 text-amber-300",
};

// ── types ────────────────────────────────────────────────────────────────────

type FormData = {
  id: string;
  nameKo: string;
  nameEn: string;
  stream: string;
  type: string;
  giNogi: string;
  xpValue: string;
  parentId: string;
  grip: string;
  bodyType: string;
  keyPoint: string;
  practicalTip: string;
  commonMistake: string;
  counter: string;
  ytSearchGeneral: string;
  ytSearchKo: string;
  curatedInstructor: string;
  videoUrl: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  id: "", nameKo: "", nameEn: "",
  stream: "", type: "컨트롤", giNogi: "기·노기공통", xpValue: "10",
  parentId: "",
  grip: "", bodyType: "", keyPoint: "", practicalTip: "",
  commonMistake: "", counter: "", ytSearchGeneral: "", ytSearchKo: "",
  curatedInstructor: "", videoUrl: "", notes: "",
};

function techniqueToForm(t: Technique): FormData {
  return {
    id: t.id,
    nameKo: t.nameKo,
    nameEn: t.nameEn ?? "",
    stream: t.stream ?? "",
    type: t.type,
    giNogi: t.giNogi,
    xpValue: String(t.xpValue),
    parentId: t.parentId ?? "",
    grip: t.grip ?? "",
    bodyType: t.bodyType ?? "",
    keyPoint: t.keyPoint ?? "",
    practicalTip: t.practicalTip ?? "",
    commonMistake: t.commonMistake ?? "",
    counter: t.counter ?? "",
    ytSearchGeneral: t.ytSearchGeneral ?? "",
    ytSearchKo: t.ytSearchKo ?? "",
    curatedInstructor: t.curatedInstructor ?? "",
    videoUrl: t.videoUrl ?? "",
    notes: t.notes ?? "",
  };
}

// ── sub-components ───────────────────────────────────────────────────────────

function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className ?? "bg-neutral-700 text-neutral-300"}`}>
      {label}
    </span>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-400 mb-1">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-500";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={2} className={`${inputCls} resize-none`} />;
}
function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputCls}>
      {children}
    </select>
  );
}

// ── TechniqueForm ─────────────────────────────────────────────────────────────

function TechniqueForm({
  form, setForm, allTechniques, positions, editTarget,
  onSubmit, onCancel, isPending,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  allTechniques: Technique[];
  positions: Technique[];
  editTarget: Technique | null;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const togglePrereq = (recordId: string) => {
    setForm((f) => ({
      ...f,

    }));
  };

  // Prerequisite candidates: exclude self
  const prereqCandidates = allTechniques.filter(
    (t) => t.recordId !== editTarget?.recordId,
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-700">
        <h2 className="text-base font-semibold">
          {editTarget ? "기술 편집" : "새 기술 추가"}
        </h2>
        <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-200 text-xl leading-none">✕</button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="기술 ID" required>
            <TextInput placeholder="CG-01" value={form.id} onChange={set("id")} />
          </Field>
          <Field label="XP">
            <TextInput type="number" min={0} value={form.xpValue} onChange={set("xpValue")} />
          </Field>
        </div>

        <Field label="한글 이름" required>
          <TextInput placeholder="클로즈드가드 스윕" value={form.nameKo} onChange={set("nameKo")} />
        </Field>

        <Field label="영문 이름">
          <TextInput placeholder="Closed Guard Sweep" value={form.nameEn} onChange={set("nameEn")} />
        </Field>

        <Field label="상위 포지션 (parentId)">
          <Select value={form.parentId} onChange={set("parentId")}>
            <option value="">— 없음 (최상위) —</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.nameKo}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="스트림">
            <Select value={form.stream} onChange={set("stream")}>
              <option value="">— 없음 —</option>
              {(["가드포지션", "탑포지션", "이스케이프", "스탠딩"] as Stream[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="타입">
            <Select value={form.type} onChange={set("type")}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
        </div>

        <Field label="기/노기">
          <Select value={form.giNogi} onChange={set("giNogi")}>
            {GI_NOGI_OPTS.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
        </Field>

        {/* Prerequisites */}
        <Field label="선행 기술">
          <div className="rounded-md border border-neutral-700 bg-neutral-800 max-h-36 overflow-y-auto p-2 space-y-1">
            {prereqCandidates.length === 0 && (
              <p className="text-xs text-neutral-500 py-1">기술 없음</p>
            )}
            {prereqCandidates.map((t) => (
              <label key={t.recordId} className="flex items-center gap-2 cursor-pointer py-0.5 rounded hover:bg-neutral-700/50 px-1">
                <input
                  type="checkbox"
                  onChange={() => togglePrereq(t.recordId)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-neutral-300">{t.id} {t.nameKo}</span>
              </label>
            ))}
          </div>
        </Field>

        {/* Toggle Advanced */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          {showAdvanced ? "▲ 심화 필드 숨기기" : "▼ 심화 필드 펼치기"}
        </button>

        {showAdvanced && (
          <div className="space-y-3">
            <Field label="그립">
              <TextInput placeholder="라펠, 소매..." value={form.grip} onChange={set("grip")} />
            </Field>
            <Field label="체형 적합도">
              <TextInput placeholder="유연성 높을수록 유리..." value={form.bodyType} onChange={set("bodyType")} />
            </Field>
            <Field label="핵심 포인트">
              <TextArea placeholder="엉덩이를 띄워..." value={form.keyPoint} onChange={set("keyPoint")} />
            </Field>
            <Field label="실전 팁">
              <TextArea placeholder="스파링에서는..." value={form.practicalTip} onChange={set("practicalTip")} />
            </Field>
            <Field label="흔한 실수">
              <TextArea placeholder="팔꿈치가 벌어지면..." value={form.commonMistake} onChange={set("commonMistake")} />
            </Field>
            <Field label="카운터">
              <TextInput placeholder="슈퍼맨 패스..." value={form.counter} onChange={set("counter")} />
            </Field>
            <Field label="유튜브 검색어 (영문)">
              <TextInput placeholder="closed guard sweep bjj" value={form.ytSearchGeneral} onChange={set("ytSearchGeneral")} />
            </Field>
            <Field label="유튜브 검색어 (한국어)">
              <TextInput placeholder="클로즈드 가드 스윕" value={form.ytSearchKo} onChange={set("ytSearchKo")} />
            </Field>
            <Field label="추천 강사">
              <TextInput placeholder="Gordon Ryan" value={form.curatedInstructor} onChange={set("curatedInstructor")} />
            </Field>
            <Field label="영상 URL">
              <TextInput placeholder="https://youtube.com/..." value={form.videoUrl} onChange={set("videoUrl")} />
            </Field>
            <Field label="메모">
              <TextArea placeholder="자유 메모..." value={form.notes} onChange={set("notes")} />
            </Field>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-neutral-700">
        <button
          disabled={isPending || !form.id || !form.nameKo}
          onClick={onSubmit}
          className="flex-1 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium py-2 transition-colors"
        >
          {isPending ? "저장 중…" : editTarget ? "수정 저장" : "기술 추가"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200">
          취소
        </button>
      </div>
    </div>
  );
}

// ── Main TechniqueManager ─────────────────────────────────────────────────────

export function TechniqueManager({ techniques: initial, positions, customTechniques: initialCustom }: { techniques: Technique[]; positions: Technique[]; customTechniques: CustomTechnique[] }) {
  const [techniques, setTechniques] = useState<Technique[]>(initial);
  const [customTechniques, setCustomTechniques] = useState<CustomTechnique[]>(initialCustom);
  const [search, setSearch] = useState("");
  const [streamFilter, setStreamFilter] = useState<string>("전체");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Technique | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<Technique | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Build shortId → position name lookup
  const positionMap = useMemo(
    () => new Map(positions.map((p) => [p.id, `${p.id} · ${p.nameKo}`])),
    [positions],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return techniques.filter((t) => {
      const matchStream = streamFilter === "전체" || t.stream === streamFilter;
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.nameKo.toLowerCase().includes(q) ||
        (t.nameEn ?? "").toLowerCase().includes(q);
      return matchStream && matchSearch;
    });
  }, [techniques, search, streamFilter]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDrawerOpen(true);
  };

  const openEdit = (t: Technique) => {
    setEditTarget(t);
    setForm(techniqueToForm(t));
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleSubmit = () => {
    startTransition(async () => {
      const input = {
        id: form.id,
        nameKo: form.nameKo,
        nameEn: form.nameEn || undefined,
        stream: form.stream || undefined,
        type: form.type || undefined,
        giNogi: form.giNogi || undefined,
        xpValue: form.xpValue ? Number(form.xpValue) : undefined,
        parentId: form.parentId || undefined,
        grip: form.grip || undefined,
        bodyType: form.bodyType || undefined,
        keyPoint: form.keyPoint || undefined,
        practicalTip: form.practicalTip || undefined,
        commonMistake: form.commonMistake || undefined,
        counter: form.counter || undefined,
        ytSearchGeneral: form.ytSearchGeneral || undefined,
        ytSearchKo: form.ytSearchKo || undefined,
        curatedInstructor: form.curatedInstructor || undefined,
        videoUrl: form.videoUrl || undefined,
        notes: form.notes || undefined,
      };

      if (editTarget) {
        const res = await actionUpdateTechnique(editTarget.recordId, input);
        if (res.ok) {
          setTechniques((prev) =>
            prev.map((t) =>
              t.recordId === editTarget.recordId
                ? {
                    ...t,
                    id: input.id ?? t.id,
                    nameKo: input.nameKo ?? t.nameKo,
                    nameEn: input.nameEn ?? t.nameEn,
                    stream: (input.stream as Stream) ?? null,
                    type: (input.type as TechniqueType) ?? t.type,
                    giNogi: (input.giNogi as GiNogi) ?? t.giNogi,
                    xpValue: input.xpValue !== undefined ? Number(input.xpValue) : t.xpValue,
                    parentId: input.parentId ?? t.parentId,
                    grip: input.grip ?? t.grip,
                    bodyType: input.bodyType ?? t.bodyType,
                    keyPoint: input.keyPoint ?? t.keyPoint,
                    practicalTip: input.practicalTip ?? t.practicalTip,
                    commonMistake: input.commonMistake ?? t.commonMistake,
                    counter: input.counter ?? t.counter,
                    ytSearchGeneral: input.ytSearchGeneral ?? t.ytSearchGeneral,
                    ytSearchKo: input.ytSearchKo ?? t.ytSearchKo,
                    curatedInstructor: input.curatedInstructor ?? t.curatedInstructor,
                    videoUrl: input.videoUrl ?? t.videoUrl,
                    notes: input.notes ?? t.notes,
                  }
                : t,
            ),
          );
          showToast("수정 완료 ✓", true);
          setDrawerOpen(false);
        } else {
          showToast("오류: " + res.error, false);
        }
      } else {
        const res = await actionCreateTechnique(input);
        if (res.ok) {
          const newTech: Technique = {
            recordId: res.recordId,
            id: form.id,
            nameKo: form.nameKo,
            nameEn: form.nameEn || "",
            type: (form.type as TechniqueType) || "컨트롤",
            giNogi: (form.giNogi as GiNogi) || "기·노기공통",
            xpValue: Number(form.xpValue) || 0,
            stream: (form.stream as Stream) || null,
            videoUrl: form.videoUrl || null,
            notes: form.notes || null,
            parentId: form.parentId || null,
                grip: form.grip || null,
            bodyType: form.bodyType || null,
            keyPoint: form.keyPoint || null,
            practicalTip: form.practicalTip || null,
            commonMistake: form.commonMistake || null,
            counter: form.counter || null,
            ytSearchGeneral: form.ytSearchGeneral || null,
            ytSearchKo: form.ytSearchKo || null,
            curatedInstructor: form.curatedInstructor || null,
            difficulty: null,
            isMainSkill: false,
          };
          setTechniques((prev) => [newTech, ...prev]);
          showToast("추가 완료 ✓", true);
          setDrawerOpen(false);
        } else {
          showToast("오류: " + res.error, false);
        }
      }
    });
  };

  const handleDelete = (t: Technique) => setConfirmDelete(t);

  const confirmDoDelete = () => {
    if (!confirmDelete) return;
    startTransition(async () => {
      const res = await actionDeleteTechnique(confirmDelete.recordId);
      if (res.ok) {
        setTechniques((prev) => prev.filter((t) => t.recordId !== confirmDelete.recordId));
        showToast("삭제 완료", true);
      } else {
        showToast("삭제 오류: " + res.error, false);
      }
      setConfirmDelete(null);
    });
  };

  const handleDeleteCustomTech = (recordId: string) => {
    startTransition(async () => {
      const res = await actionDeleteCustomTechnique(recordId);
      if (res.ok) {
        setCustomTechniques((prev) => prev.filter((t) => t.recordId !== recordId));
        showToast("삭제 완료", true);
      } else {
        showToast("삭제 오류: " + res.error, false);
      }
    });
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg
            ${toast.ok ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="검색 (ID, 이름)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] rounded-md bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-500"
        />
        <button
          onClick={openAdd}
          className="rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap"
        >
          + 기술 추가
        </button>
      </div>

      {/* Stream filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STREAMS.map((s) => (
          <button
            key={s}
            onClick={() => setStreamFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              streamFilter === s
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {s} {s !== "전체" && `(${techniques.filter((t) => t.stream === s).length})`}
          </button>
        ))}
        <span className="ml-auto text-xs text-neutral-500 self-center">
          {filtered.length}개
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 text-left text-xs text-neutral-400 uppercase tracking-wide">
              <th className="px-3 py-2.5 font-medium">ID</th>
              <th className="px-3 py-2.5 font-medium">이름</th>
              <th className="px-3 py-2.5 font-medium hidden sm:table-cell">포지션</th>
              <th className="px-3 py-2.5 font-medium hidden md:table-cell">스트림</th>
              <th className="px-3 py-2.5 font-medium hidden lg:table-cell">타입</th>
              <th className="px-3 py-2.5 font-medium hidden lg:table-cell">기/노기</th>
              <th className="px-3 py-2.5 font-medium text-right">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((t) => (
              <tr key={t.recordId} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-3 py-2.5 font-mono text-xs text-neutral-400">{t.id}</td>
                <td className="px-3 py-2.5 font-medium text-neutral-100">{t.nameKo}</td>
                <td className="px-3 py-2.5 hidden sm:table-cell text-xs text-neutral-400">
                  {t.parentId
                    ? positionMap.get(t.parentId) ?? t.parentId
                    : <span className="text-neutral-600">—</span>}
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  {t.stream ? (
                    <Badge label={t.stream} className={STREAM_COLOR[t.stream]} />
                  ) : (
                    <span className="text-neutral-600">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell text-neutral-400 text-xs">{t.type}</td>
                <td className="px-3 py-2.5 hidden lg:table-cell text-neutral-400 text-xs">{t.giNogi}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(t)}
                      className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 transition-colors"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-900/30 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-neutral-500">
                  일치하는 기술이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-neutral-900 shadow-2xl flex flex-col">
            <TechniqueForm
              form={form}
              setForm={setForm}
              allTechniques={techniques}
              positions={positions}
              editTarget={editTarget}
              onSubmit={handleSubmit}
              onCancel={closeDrawer}
              isPending={isPending}
            />
          </div>
        </>
      )}


      {/* ── 미등록 기술 목록 ───────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold">미등록 기술 목록</h2>
          <span className="rounded-full bg-orange-500/15 text-orange-300 text-xs px-2 py-0.5">
            {customTechniques.length}개
          </span>
          <span className="text-xs text-neutral-500 ml-1">
            · 수련 기록 시 DB에 없어 자유 입력된 기술들이에요. 정식 등록 후 체크하거나 삭제하세요.
          </span>
        </div>

        {customTechniques.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 px-4 py-8 text-center text-sm text-neutral-500">
            아직 미등록 기술이 없어요. 수련 기록 시 DB에 없는 기술을 입력하면 여기에 쌓여요.
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-left text-xs text-neutral-400 uppercase tracking-wide">
                  <th className="px-3 py-2.5 font-medium">기술명</th>
                  <th className="px-3 py-2.5 font-medium text-center">사용횟수</th>
                  <th className="px-3 py-2.5 font-medium hidden sm:table-cell">최초입력일</th>
                  <th className="px-3 py-2.5 font-medium hidden sm:table-cell">최근사용일</th>
                  <th className="px-3 py-2.5 font-medium text-right">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {customTechniques.map((ct) => (
                  <tr key={ct.recordId} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-100">{ct.name}</span>
                        {ct.registered && (
                          <span className="text-[10px] rounded-full bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5">등록됨</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center justify-center size-6 rounded-full bg-orange-500/15 text-orange-300 text-xs font-bold tabular-nums">
                        {ct.useCount}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell text-xs text-neutral-400">
                      {ct.firstUsed ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell text-xs text-neutral-400">
                      {ct.lastUsed ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteCustomTech(ct.recordId)}
                        disabled={isPending}
                        className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-900/30 transition-colors disabled:opacity-40"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl">
              <h3 className="text-base font-semibold text-neutral-100 mb-2">기술 삭제</h3>
              <p className="text-sm text-neutral-400 mb-5">
                <span className="text-neutral-200 font-medium">{confirmDelete.id} {confirmDelete.nameKo}</span>를 삭제합니다.
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDoDelete}
                  disabled={isPending}
                  className="flex-1 rounded-md bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-medium py-2 transition-colors"
                >
                  {isPending ? "삭제 중…" : "삭제"}
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm font-medium py-2 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
