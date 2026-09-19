import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── 한글 검색 정규화 ──────────────────────────────────────────────────────
// 외래어 표기 시 된소리(ㄲㄸㅃㅆㅉ)/예사소리(ㄱㄷㅂㅅㅈ)가 혼용되는 경우가
// 많음 (예: "라쏘"/"라소 가드", "써클"/"서클"). 검색창에 어느 쪽으로 입력해도
// 매칭되도록 비교 전에 된소리를 예사소리로 정규화한다. 표시용 원본 텍스트는
// 건드리지 않고 검색 매칭에만 사용할 것.
const CHO  = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JONG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const CHO_TENSE_TO_LAX:  Record<string, string> = { "ㄲ":"ㄱ", "ㄸ":"ㄷ", "ㅃ":"ㅂ", "ㅆ":"ㅅ", "ㅉ":"ㅈ" };
const JONG_TENSE_TO_LAX: Record<string, string> = { "ㄲ":"ㄱ", "ㅆ":"ㅅ" };

export function normalizeKorean(str: string): string {
  let out = "";
  for (const ch of str) {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) { out += ch; continue; }
    const jongIdx = code % 28;
    const jungIdx = Math.floor(code / 28) % 21;
    const choIdx  = Math.floor(code / (28 * 21));
    const cho  = CHO_TENSE_TO_LAX[CHO[choIdx]] ?? CHO[choIdx];
    const jong = JONG_TENSE_TO_LAX[JONG[jongIdx]] ?? JONG[jongIdx];
    const newChoIdx  = CHO.indexOf(cho);
    const newJongIdx = JONG.indexOf(jong);
    out += String.fromCharCode(0xAC00 + (newChoIdx * 21 + jungIdx) * 28 + newJongIdx);
  }
  return out.toLowerCase();
}
