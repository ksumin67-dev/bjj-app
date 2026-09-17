/**
 * 선수 실사진 매핑 — Airtable Athletes recordId 기준.
 * 라이선스가 확보(또는 사용자가 직접 확보)된 선수부터 하나씩 등록한다.
 * 매핑에 없는 선수는 AthleteAvatar가 기존 실루엣 일러스트로 자동 폴백된다.
 *
 * (2026-09-15) 고든 라이언/로저 그레이시/마이키 무수메시 사진 등록.
 * 로저 그레이시·마이키 무수메시·마르셀로 가르시아는 얼굴 클로즈업 400x400 정사각형 크롭.
 * 고든 라이언은 원본 전신샷(1000x563) 그대로 사용 — 2026-09-17 사용자 요청으로 크롭 이전 버전 복원.
 */
export const ATHLETE_PHOTOS: Record<string, string> = {
  recULMLJ1l6t7ljTI: "/athletes/gordon-ryan.png", // 고든 라이언 (Gordon Ryan)
  recF6GerAPtr1HIjj: "/athletes/roger-gracie.png", // 로저 그레이시 (Roger Gracie)
  recBJHkMV2xJ2O2Hh: "/athletes/mikey-musumeci.png", // 마이키 무수메시 (Mikey Musumeci)
  recjRbC4XwwiMKWNh: "/athletes/marcelo-garcia.png", // 마르셀로 가르시아 (Marcelo Garcia)
};

export function getAthletePhoto(recordId: string): string | null {
  return ATHLETE_PHOTOS[recordId] ?? null;
}
