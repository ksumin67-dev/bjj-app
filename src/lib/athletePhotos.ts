/**
 * 선수 실사진 매핑 — Airtable Athletes recordId 기준.
 * 라이선스가 확보(또는 사용자가 직접 확보)된 선수부터 하나씩 등록한다.
 * 매핑에 없는 선수는 AthleteAvatar가 기존 실루엣 일러스트로 자동 폴백된다.
 *
 * (2026-09-15) 고든 라이언/로저 그레이시/마이키 무수메시 사진 등록.
 * 사진은 모두 얼굴 클로즈업 400x400 정사각형으로 크롭 후 등록.
 */
export const ATHLETE_PHOTOS: Record<string, string> = {
  recULMLJ1l6t7ljTI: "/athletes/gordon-ryan.png", // 고든 라이언 (Gordon Ryan)
  recF6GerAPtr1HIjj: "/athletes/roger-gracie.png", // 로저 그레이시 (Roger Gracie)
  recBJHkMV2xJ2O2Hh: "/athletes/mikey-musumeci.png", // 마이키 무수메시 (Mikey Musumeci)
};

export function getAthletePhoto(recordId: string): string | null {
  return ATHLETE_PHOTOS[recordId] ?? null;
}
