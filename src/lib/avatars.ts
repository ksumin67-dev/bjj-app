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
  { key: "horse",     name: "말",       tag: "체력",     desc: "지치지 않는 타입" },
  { key: "goat",      name: "염소",     tag: "디펜스",   desc: "끈질기게 버티는 타입" },
  { key: "penguin",   name: "펭귄",     tag: "50/50",    desc: "붙어서 엉키는 타입" },
  { key: "hippo",     name: "하마",     tag: "피니시",   desc: "한 방에 끝내는 타입" },
  { key: "rabbit",    name: "토끼",     tag: "스피드",   desc: "빠르게 치고 나가는 타입" },
  { key: "zebra",     name: "얼룩말",   tag: "도복 패션", desc: "도복 스타일에 진심인 타입" },
];

export const DEFAULT_AVATAR_KEY = "panda";

export function getAvatarPreset(key: string | null | undefined): AvatarPreset | null {
  if (!key) return null;
  return AVATAR_PRESETS.find((p) => p.key === key) ?? null;
}

export function avatarImageSrc(key: string): string {
  return `/avatars/animals/${key}.png`;
}

/** 사용자가 고른 프로필 이미지: 캐릭터(preset) 또는 내 사진(photo, Storage 경로) */
export type AvatarSel = { type: "preset" | "photo"; value: string } | null;

export const AVATAR_BUCKET = "avatars";

/** Storage 공개 URL (경로 → 이미지 주소) */
export function avatarPhotoUrl(path: string, supabaseUrl: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${path}`;
}

/** 서버 검증: preset은 등록된 키, photo는 본인 폴더의 경로만 허용 */
export function sanitizeAvatar(avatar: AvatarSel | undefined, userId: string): AvatarSel {
  if (!avatar) return null;
  if (avatar.type === "preset") return getAvatarPreset(avatar.value) ? avatar : null;
  if (avatar.type === "photo") {
    const ok = avatar.value.startsWith(`${userId}/`) && !avatar.value.includes("..") && avatar.value.length < 200;
    return ok ? avatar : null;
  }
  return null;
}
