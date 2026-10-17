/**
 * 관리자 계정 (기술도감 마스터 데이터를 수정할 수 있는 유일한 계정).
 * 미들웨어(경로 차단)와 서버 액션(requireAdmin)이 같은 값을 쓰도록 한 곳에 둔다.
 * server-only가 아니어야 한다 — 미들웨어(edge)에서도 import함.
 */
export const ADMIN_EMAIL = "ksumin67@gmail.com";
