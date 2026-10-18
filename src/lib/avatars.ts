/**
 * 프로필 캐릭터 — Kenney "Animal Pack Redux" (CC0) 기반.
 * 동물마다 주짓수 수련 성향(tag + desc)을 붙여 단순 동물 아이콘이 아니라
 * "내 플레이 스타일"을 고르는 느낌이 나도록 한다. 문구는 자유롭게 수정 가능.
 * 이미지: public/avatars/animals/{key}.png
 */
export type AvatarPreset = {
  key: string;
  name: string;
  tag: string;
  desc: string;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  { key: "snake",     name: "뱀",       tag: "레그락",   desc: "다리를 휘감는 타입" },
  { key: "buffalo",   name: "버팔로",   tag: "패싱",     desc: "밀어붙이는 프레셔 타입" },
  { key: "monkey",    name: "원숭이",   tag: "가드",     desc: "유연하게 움직이는 타입" },
  { key: "gorilla",   name: "고릴라",   tag: "파워",     desc: "힘으로 누르는 타입" },
  { key: "panda",     name: "판다",     tag: "기본기",   desc: "기본에 충실한 타입" },
  { key: "owl",       name: "올빼미",   tag: "분석",     desc: "영상 보며 연구하는 타입" },
  { key: "sloth",     name: "나무늘보", tag: "롤링",     desc: "느긋하게 즐기는 타입" },
  { key: "bear",      name: "곰",       tag: "압박",     desc: "묵직한 탑 플레이 타입" },
  { key: "crocodile", name: "악어",     tag: "백",       desc: "한번 물면 놓지 않는 타입" },
  { key: "frog",      name: "개구리",   tag: "스크램블", desc: "튀어나가는 타입" },
  { key: "dog",       name: "늑대",     tag: "공격형",   desc: "먼저 달려드는 타입" },
  { key: "rhino",     name: "코뿔소",   tag: "테이크다운", desc: "돌진하는 타입" },
];

export const DEFAULT_AVATAR_KEY = "panda";

export function getAvatarPreset(key: string | null | undefined): AvatarPreset | null {
  if (!key) return null;
  return AVATAR_PRESETS.find((p) => p.key === key) ?? null;
}

export function avatarImageSrc(key: string): string {
  return `/avatars/animals/${key}.png`;
}
