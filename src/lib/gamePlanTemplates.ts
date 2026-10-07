/**
 * 게임플랜 추천 템플릿 (2026-09-20)
 *
 * 처음 쓰는 사람이 빈 폼 앞에서 막히지 않도록, 새 게임플랜 화면 상단에서
 * 한 번에 이름·기술 순서·설명을 채워주는 시작점. techShortIds는 Airtable
 * Techniques의 짧은 ID(예: "CG-01")이며, 폼에서 recordId로 변환해 사용한다.
 * (변환되지 않는 ID는 조용히 건너뜀 — 기술도감이 바뀌어도 폼이 깨지지 않게.)
 */
export type GamePlanTemplate = {
  id: string;
  name: string;
  /** 카드에 보이는 한 줄 설명 */
  summary: string;
  techShortIds: string[];
  /** 폼의 '설명' 칸에 채워지는 내용 */
  note: string;
};

export const GAME_PLAN_TEMPLATES: GamePlanTemplate[] = [
  {
    id: "closed-guard-basic",
    name: "클로즈드 가드 기본 3콤보",
    summary: "힙범프로 시작해 암바·기무라·초크로 연결",
    techShortIds: ["CG-20", "CG-01", "CG-11", "CG-13", "CG-10"],
    note: "힙범프를 먼저 시도하고, 상대가 막으면 암바 → 기무라 → 크로스 초크 순으로 이어가요.",
  },
  {
    id: "side-control-finish",
    name: "사이드 컨트롤 마무리",
    summary: "컨트롤 유지 → 서브미션 → 마운트 전환",
    techShortIds: ["SC-20", "SC-03", "SC-01", "SC-02", "SC-10"],
    note: "압박을 유지한 채 다르세 초크, 기무라, 암바를 번갈아 시도하고 막히면 마운트로 올라가요.",
  },
  {
    id: "pass-to-mount",
    name: "패스에서 마운트까지",
    summary: "가드 패스 → 사이드 컨트롤 → 마운트",
    techShortIds: ["GP-11", "GP-14", "GP-20", "SC-10"],
    note: "싱글 언더나 니 슬라이스로 패스한 뒤 사이드 컨트롤을 굳히고 마운트로 전환해요.",
  },
  {
    id: "back-control-finish",
    name: "백 컨트롤 마무리",
    summary: "백 컨트롤 유지 → 초크 → 암바",
    techShortIds: ["BC-20", "BC-01", "BC-02", "BC-03"],
    note: "백 컨트롤을 먼저 안정시키고 RNC가 막히면 보우 앤 애로우, 이후 암바로 연결해요.",
  },
];
