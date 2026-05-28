/**
 * Airtable 테이블 / 필드 ID 상수.
 * 베이스가 변경되면 이 파일만 갱신.
 *
 * 베이스: appkUqBmwhAK9F8AX (BJJ 스킬트리)
 */

export const TABLES = {
  TECHNIQUES: "tblVrulFnmKVXHgkl",
  SEQUENCES: "tbllF6ZyEnwnEj6uz",
  USER_PROGRESS: "tbl2azkdmIwl1Ev0x",
  TRAINING_SESSIONS: "tblSVjgBfwjVMTyVt",
  CUSTOM_TECHNIQUES: "tbldQmFu4FWfQF0JA",
  CUSTOM_TECHNIQUE: {
    NAME:       "fldJlPx7qWvbdG3UW",
    USE_COUNT:  "fldzUqdxBpNvhcreY",
    FIRST_USED: "fldCdihPfziPUY6Ov",
    LAST_USED:  "fldViuhqnt45FgPjN",
    REGISTERED: "fldWmhfDeXOeYr3Py",
    // TODO: Airtable에서 CUSTOM_TECHNIQUES 테이블에 "Stream" 단일텍스트 필드 추가 후 ID 입력
    STREAM:     "",
  },
} as const;

export const FIELDS = {
  TECHNIQUE: {
    // v1 기본
    ID: "fldxf6Wu6JY9mdxE5",
    NAME_KO: "fldV5IyWM0zWNfPqC",
    NAME_EN: "fldPFonLmINKCO5le",
    TYPE: "fldX1FGlEKWgb4T9n",
    XP_VALUE: "fldZNAha9MhULJnei",
    GI_NOGI: "fldQdgbDOIc39f7z1",
    VIDEO_URL: "fld6Em3JjMN8gkecD",
    NOTES: "fld2AoIhb37j393Pm",
    // 병합 후 신규
    PARENT_ID: "fldNxsRbjDpWQKVpY",
    // v3 신규 — 게이밍 스트림
    STREAM: "fld9UUVZhYi5YCe7j",
    // v3 신규 — 7 심화 필드
    GRIP: "fldMTJ8ry8Qu8pVjT",
    BODY_TYPE: "fldvyL4ODSJfk955k",
    KEY_POINT: "fldkifBWC5Azsg5On",
    PRACTICAL_TIP: "fld5iww4CI8hdFotU",
    COMMON_MISTAKE: "fldEItlqDheCq2tel",
    COUNTER: "fldAOoTW6PdD6dfDM",
    // v3 신규 — 유튜브 검색어 2분리
    YT_SEARCH_GENERAL: "fldgwgXc1hSStBvaV",
    YT_SEARCH_KO: "fldf7houHb8enFKn0",
    CURATED_INSTRUCTOR: "fldcecwUym64ZAI8Q",
    // TODO: Airtable Techniques 테이블에 "isMainSkill" 체크박스 필드 추가 후 ID 입력
    IS_MAIN_SKILL: "",
  },
  SEQUENCE: {
    SEQ_NAME: "fldA2Pd7RXCZqlljb",
    START_POSITION: "fldvjE7RforWP889d",
    TECHNIQUES_USED: "fldM9LJnV27aV7rSN",
    STEPS_TEXT: "fldAuggQJvEPz6b8r",
    HAS_BRANCH: "fldk62LNHXlTV9pZa",
    BRANCH_CONDITION: "fldR9ZS9o1I9iTCHa",
    TAGS: "fldJ0RTHdn4Qhavcr",
    SUCCESS_COUNT: "fldPNApKDFh7VuGXc",
    LAST_USED: "fldCzXYZtxdj9K0Uz",
  },
  USER_PROGRESS: {
    RECORD_LABEL: "fldSjfpYErdh15LZJ",
    TECHNIQUE: "fld7aaPkhLJgvGi82",
    STATUS: "fldcdAxgkyVaWUuqW",
    DRILL_COUNT: "fldVMPHzPc7vLCIfX",
    SPARRING_COUNT: "fld8xpsfj195T0kzR",
    LAST_PRACTICED: "fldfdiCnLPgcvMVw3",
    XP_EARNED: "flde19FNYqGBGXFiD",
  },
  TRAINING_SESSION: {
    SESSION_LABEL: "fldrKV1hWEOZpXMJW",
    DATE: "fldSr9zW6T0UxwJZk",
    TECHNIQUES: "fldjZcqzMF7JXOTYy",
    SEQUENCES: "fldjUFXwEODvfjdvf",
    NOTES: "fldE0obRfXmLhM8YT",
    CREATED_AT: "fldGeKvdTXdXbnReE",
    XP_EARNED: "fldYW7bJr2cRejBca",
  },
  CUSTOM_TECHNIQUE: {
    NAME:       "fldJlPx7qWvbdG3UW",
    USE_COUNT:  "fldzUqdxBpNvhcreY",
    FIRST_USED: "fldCdihPfziPUY6Ov",
    LAST_USED:  "fldViuhqnt45FgPjN",
    REGISTERED: "fldWmhfDeXOeYr3Py",
    // TODO: Airtable CUSTOM_TECHNIQUES 테이블에 "Stream" 단일텍스트 필드 추가 후 아래 ID 입력
    STREAM:     "",
  },
} as const;

export const USER_PROFILE = {
  TABLE_ID:  "tbl3KO3jxSRECsz7R",
  RECORD_ID: "recjfnno2SugyshCO",  // 단일 프로필 레코드
  FIELDS: {
    NAME:     "fldutt1GTv7xwUY2x",
    BELT:     "fldJJlxPhXW6cb1zf",  // singleLineText (교체: 기존 singleSelect는 Belt_legacy)
    STRIPE:   "fldq9M0h8eRVRqIuF",
    NICKNAME: "fldCU2DHFc3UtukIR",
  },
} as const;
