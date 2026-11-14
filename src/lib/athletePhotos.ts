/**
 * 선수 실사진 매핑 — Airtable Athletes recordId → `public/` 경로.
 *
 * `ATHLETE_PHOTOS_ENABLED`가 false이면 `getAthletePhoto`는 항상 null이고,
 * `AthleteAvatar`가 같은 크기의 실루엣 일러스트로 폴백한다.
 *
 * 2026-11-14: `public/athletes/`의 실사 12장을 제거했다. 레포에 라이선스·허가·
 * 저작자 표시 증빙이 없고, `docs/athlete_photo_research.md` 기준으로 상업 사용이
 * 확인되지 않았다. 파일명 문자열은 다시 넣지 않는다. 배포 사이트가 그 경로를
 * 서빙하지 않게 하기 위해서다.
 *
 * 다시 켜려면 (선수 한 명씩):
 * 1. 아래 `ATHLETE_PHOTO_RIGHTS_PENDING`와 리서치 문서에서 그 선수의 권리를 확인한다.
 * 2. 허가된 파일만 `public/athletes/`에 추가하고, 필요한 저작자 표시를 앱에 넣는다.
 * 3. `ATHLETE_PHOTOS`에 `recordId → "/athletes/<파일>"` 항목만 추가한다.
 * 4. `ATHLETE_PHOTOS_ENABLED`를 true로 바꾼다. 맵에 없는 선수는 계속 실루엣이다.
 */

/** 권리 확인 전에는 false. true여도 맵에 없는 선수는 실루엣이다. */
export const ATHLETE_PHOTOS_ENABLED = false;

/** 권리가 확인된 선수만 등록한다. 지금은 비어 있다. */
export const ATHLETE_PHOTOS: Record<string, string> = {};

/**
 * 실사를 다시 넣기 전에 권리가 필요한 선수.
 * 2026-11-14에 이 12명의 파일이 `public/athletes/`에서 빠졌다.
 */
export const ATHLETE_PHOTO_RIGHTS_PENDING = [
  {
    recordId: "recULMLJ1l6t7ljTI",
    nameKo: "고든 라이언",
    nameEn: "Gordon Ryan",
    rights:
      "Commons CC 후보(2025-08 이전 YouTube CC 영상 캡처). 파일 페이지 재확인과 저작자 표시가 레포에 없음.",
  },
  {
    recordId: "recF6GerAPtr1HIjj",
    nameKo: "로저 그레이시",
    nameEn: "Roger Gracie",
    rights: "CC BY-SA 3.0 후보(업로더 Iwtbf42). 저작자 표시가 앱에 없고 파일 페이지 재확인이 없음.",
  },
  {
    recordId: "recBJHkMV2xJ2O2Hh",
    nameKo: "마이키 무수메시",
    nameEn: "Mikey Musumeci",
    rights: "CC0 / Public Domain Mark 1.0 후보. 파일 페이지 재확인이 레포에 없음.",
  },
  {
    recordId: "recjRbC4XwwiMKWNh",
    nameKo: "마르셀로 가르시아",
    nameEn: "Marcelo Garcia",
    rights: "Commons 카테고리만 확인됨. 개별 파일 라이선스가 확정되지 않음.",
  },
  {
    recordId: "rec2TVw75b4AONjQ5",
    nameKo: "크레이그 존스",
    nameEn: "Craig Jones",
    rights: "상업 사용 라이선스 없음. Commons 후보는 동명이인 사진뿐.",
  },
  {
    recordId: "recKkQ0so0zhNMVN4",
    nameKo: "부셰샤",
    nameEn: "Marcus Almeida",
    rights: "상업 사용 라이선스 없음. Getty/대회 미디어 경로만 확인됨.",
  },
  {
    recordId: "recLKjAG2ER82V8C2",
    nameKo: "라파엘 멘데스",
    nameEn: "Rafael Mendes",
    rights: "상업 사용 라이선스 없음. AOJ 등 팀 허가 필요.",
  },
  {
    recordId: "recNlBU8ydgmIaNO6",
    nameKo: "라클란 자일스",
    nameEn: "Lachlan Giles",
    rights: "상업 사용 라이선스 없음.",
  },
  {
    recordId: "reccxwyAH6feJeCfT",
    nameKo: "아담 와르진스키",
    nameEn: "Adam Wardzinski",
    rights: "상업 사용 라이선스 없음.",
  },
  {
    recordId: "receWCXuLUVyoOM4n",
    nameKo: "라이언 홀",
    nameEn: "Ryan Hall",
    rights: "Getty(Sean M. Haffey) 크레딧으로 추정. 상업 앱 사용 불가. UFC/Getty 라이선스 필요.",
  },
  {
    recordId: "recllgUJ1rcdNWTzU",
    nameKo: "안드레 갈바오",
    nameEn: "Andre Galvao",
    rights: "상업 사용 라이선스 없음. Atos 등 팀 허가 필요.",
  },
  {
    recordId: "recQaHA3TEEKGHGhJ",
    nameKo: "미카 갈바오",
    nameEn: "Mica Galvao",
    rights: "리서치 표에 없고 레포에 권리 근거가 없음. 상업 사용 허가 확인 전 재추가 금지.",
  },
] as const;

export function getAthletePhoto(recordId: string): string | null {
  if (!ATHLETE_PHOTOS_ENABLED) return null;
  return ATHLETE_PHOTOS[recordId] ?? null;
}
