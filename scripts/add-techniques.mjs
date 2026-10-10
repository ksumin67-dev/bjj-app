// 콤보 라이브러리 보강용 기술 등록 스크립트 (Airtable Techniques 테이블에 새 기술 추가)
//
// 사용법 (저장소 루트에서):
//   node scripts/add-techniques.mjs            ← 미리보기(dry-run): 아무것도 저장하지 않음
//   node scripts/add-techniques.mjs --apply    ← 실제 등록
//
// - .env.local 의 AIRTABLE_API_KEY / AIRTABLE_BASE_ID 사용
// - 같은 포지션에 같은 한글/영문 이름이 이미 있으면 건너뜀 (여러 번 실행해도 중복 안 생김)
// - ID(예: CG-22), 스트림, XP, 기·노기 구분은 같은 포지션의 기존 기술에서 자동 결정
// - 결과는 docs/combo_library/new_techniques_result.json 에 저장
import fs from "node:fs";

const APPLY = process.argv.includes("--apply");
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]),
);
const KEY = env.AIRTABLE_API_KEY, BASE = env.AIRTABLE_BASE_ID;
if (!KEY || !BASE) throw new Error(".env.local 에서 AIRTABLE_API_KEY / AIRTABLE_BASE_ID 를 찾지 못했어요.");

const TABLE = "tblVrulFnmKVXHgkl";
const F = {
  ID: "fldxf6Wu6JY9mdxE5", NAME_KO: "fldV5IyWM0zWNfPqC", NAME_EN: "fldPFonLmINKCO5le",
  TYPE: "fldX1FGlEKWgb4T9n", XP: "fldZNAha9MhULJnei", GI_NOGI: "fldQdgbDOIc39f7z1",
  PARENT: "fldNxsRbjDpWQKVpY", STREAM: "fld9UUVZhYi5YCe7j",
};
const api = `https://api.airtable.com/v0/${BASE}/${TABLE}`;
const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function fetchAll() {
  const out = []; let offset;
  do {
    const url = new URL(api);
    url.searchParams.set("returnFieldsByFieldId", "true");
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`Airtable 조회 실패 ${r.status}: ${await r.text()}`);
    const j = await r.json(); out.push(...j.records); offset = j.offset;
  } while (offset);
  return out;
}

const norm = (s) => (s ?? "").toString().toLowerCase().replace(/[\s()·\-→]/g, "");
const median = (a) => { if (!a.length) return 10; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const num = (id) => parseInt(id.split("-")[1], 10);

const existing = (await fetchAll()).map((r) => ({
  id: r.fields[F.ID] ?? "", ko: r.fields[F.NAME_KO] ?? "", en: r.fields[F.NAME_EN] ?? "",
  type: r.fields[F.TYPE] ?? "", xp: r.fields[F.XP], gi: r.fields[F.GI_NOGI], parent: r.fields[F.PARENT] ?? "", stream: r.fields[F.STREAM],
}));
const wanted = JSON.parse(fs.readFileSync("docs/combo_library/new_techniques.json", "utf8"));

// ID 구간: 스윕/패스 01~09, 서브미션 10~19, 그 외(컨트롤/전환 등) 20~
const band = (type) => (type === "스윕" || type === "패스" ? [1, 9] : type === "서브미션" ? [10, 19] : [20, 99]);

const used = new Map(); // parent -> Set(number)
for (const e of existing) if (e.id.includes("-")) { const p = e.id.split("-")[0]; (used.get(p) ?? used.set(p, new Set()).get(p)).add(num(e.id)); }

const plan = []; const skipped = [];
for (const w of wanted) {
  const sibs = existing.filter((e) => e.parent === w.parent && e.id.includes("-"));
  if (!sibs.length && !existing.some((e) => e.id === w.parent)) { skipped.push({ ...w, reason: "포지션 코드를 찾지 못함" }); continue; }
  if (sibs.some((e) => norm(e.ko) === norm(w.nameKo) || (w.nameEn && norm(e.en) === norm(w.nameEn)))) { skipped.push({ ...w, reason: "이미 있음" }); continue; }
  if (plan.some((p) => p.parent === w.parent && norm(p.nameKo) === norm(w.nameKo))) continue;

  const [lo, hi] = band(w.type); const set = used.get(w.parent) ?? new Set(); used.set(w.parent, set);
  let n = lo; while (set.has(n) && n < 99) n++;
  if (n > hi && hi !== 99) { n = Math.max(20, ...[...set].filter((x) => x >= 20), 19) + 1; }
  set.add(n);
  const id = `${w.parent}-${String(n).padStart(2, "0")}`;

  const streamCount = {}; for (const s of sibs) if (s.stream) streamCount[s.stream] = (streamCount[s.stream] ?? 0) + 1;
  const stream = Object.entries(streamCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const sameType = sibs.filter((s) => s.type === w.type && typeof s.xp === "number").map((s) => s.xp);
  const xp = median(sameType.length ? sameType : sibs.filter((s) => typeof s.xp === "number").map((s) => s.xp));
  plan.push({ ...w, id, stream, xp, giNogi: w.giNogi ?? "기·노기공통" });
}

console.log(`\n등록 예정 ${plan.length}개 / 건너뜀 ${skipped.length}개 (${APPLY ? "실제 등록 모드" : "미리보기"})\n`);
for (const p of plan) console.log(`  + ${p.id.padEnd(8)} ${p.nameKo}  [${p.type} · ${p.stream ?? "스트림 미지정"} · ${p.xp}XP · ${p.giNogi}]`);
for (const s of skipped) console.log(`  - ${s.nameKo}: ${s.reason}`);

if (!APPLY) { console.log("\n실제로 등록하려면: node scripts/add-techniques.mjs --apply\n"); process.exit(0); }

const created = [];
for (let i = 0; i < plan.length; i += 10) {
  const chunk = plan.slice(i, i + 10);
  const body = { typecast: true, records: chunk.map((p) => ({ fields: {
    [F.ID]: p.id, [F.NAME_KO]: p.nameKo, [F.NAME_EN]: p.nameEn, [F.TYPE]: p.type, [F.XP]: p.xp,
    [F.GI_NOGI]: p.giNogi, [F.PARENT]: p.parent, ...(p.stream ? { [F.STREAM]: p.stream } : {}),
  } })) };
  const r = await fetch(api, { method: "POST", headers, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Airtable 등록 실패 ${r.status}: ${await r.text()}`);
  const j = await r.json();
  j.records.forEach((rec, k) => created.push({ recordId: rec.id, id: chunk[k].id, nameKo: chunk[k].nameKo, parent: chunk[k].parent }));
  console.log(`  등록 완료 ${Math.min(i + 10, plan.length)}/${plan.length}`);
}
fs.writeFileSync("docs/combo_library/new_techniques_result.json", JSON.stringify(created, null, 2));
console.log("\n완료! 결과: docs/combo_library/new_techniques_result.json\n");
