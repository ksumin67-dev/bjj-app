/**
 * 선수 실사진 매핑 — Airtable Athletes recordId 기준.
 * 라이선스가 확보(또는 사용자가 직접 확보)된 선수부터 하나씩 등록한다.
 * 매핑에 없는 선수는 AthleteAvatar가 기존 실루엣 일러스트로 자동 폴백된다.
 *
 * (2026-09-15) 고든 라이언 사진 최초 등록 — public/athletes/gordon-ryan.png
 */
export const ATHLETE_PHOTOS: Record<string, string> = {
  recULMLJ1l6t7ljTI: "/athletes/gordon-ryan.png", // 고든 라이언 (Gordon Ryan)
};

export function getAthletePhoto(recordId: string): string | null {
  return ATHLETE_PHOTOS[recordId] ?? null;
}
