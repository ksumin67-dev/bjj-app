/**
 * 선수 실사진 매핑 — Airtable Athletes recordId 기준.
 * 라이선스가 확보(또는 사용자가 직접 확보)된 선수부터 하나씩 등록한다.
 * 매핑에 없는 선수는 AthleteAvatar가 기존 실루엣 일러스트로 자동 폴백된다.
 *
 * (2026-09-15~17) 12명 전원 사진 등록 완료.
 * 대부분 얼굴 클로즈업 400x400 정사각형 크롭 — 고든 라이언만 사용자 요청으로
 * 크롭 이전 원본 전신샷(1000x563) 유지.
 * 사진 출처/라이선스 확보는 사용자가 직접 진행 (docs/athlete_photo_research.md 참고).
 */
export const ATHLETE_PHOTOS: Record<string, string> = {
  recULMLJ1l6t7ljTI: "/athletes/gordon-ryan.png", // 고든 라이언 (Gordon Ryan)
  recF6GerAPtr1HIjj: "/athletes/roger-gracie.png", // 로저 그레이시 (Roger Gracie)
  recBJHkMV2xJ2O2Hh: "/athletes/mikey-musumeci.png", // 마이키 무수메시 (Mikey Musumeci)
  recjRbC4XwwiMKWNh: "/athletes/marcelo-garcia.png", // 마르셀로 가르시아 (Marcelo Garcia)
  rec2TVw75b4AONjQ5: "/athletes/craig-jones.png", // 크레이그 존스 (Craig Jones)
  recKkQ0so0zhNMVN4: "/athletes/buchecha.png", // 부셰샤 (Marcus "Buchecha" Almeida)
  recLKjAG2ER82V8C2: "/athletes/rafael-mendes.png", // 라파엘 멘데스 (Rafael Mendes)
  recNlBU8ydgmIaNO6: "/athletes/lachlan-giles.png", // 라클란 자일스 (Lachlan Giles)
  reccxwyAH6feJeCfT: "/athletes/adam-wardzinski.png", // 아담 와르진스키 (Adam Wardzinski)
  receWCXuLUVyoOM4n: "/athletes/ryan-hall.png", // 라이언 홀 (Ryan Hall)
  recllgUJ1rcdNWTzU: "/athletes/andre-galvao.png", // 안드레 갈바오 (Andre Galvao)
  recQaHA3TEEKGHGhJ: "/athletes/mica-galvao.png", // 미카 갈바오 (Mica Galvao)
};

export function getAthletePhoto(recordId: string): string | null {
  return ATHLETE_PHOTOS[recordId] ?? null;
}
