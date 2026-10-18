import { getAvatarPreset, avatarImageSrc } from "@/lib/avatars";

/**
 * 사용자 프로필 아바타. 캐릭터(preset)가 있으면 캐릭터 이미지를,
 * 없으면 닉네임 첫 글자를 보여준다. ringColor로 벨트 색 테두리를 줄 수 있다.
 */
export function UserAvatar({
  avatarType,
  avatarValue,
  nickname,
  size = 44,
  ringColor,
}: {
  avatarType: "preset" | "photo" | null;
  avatarValue: string | null;
  nickname: string;
  size?: number;
  ringColor?: string;
}) {
  const preset = avatarType === "preset" ? getAvatarPreset(avatarValue) : null;
  const ring = ringColor ? `0 0 0 2.5px ${ringColor}` : undefined;

  if (preset) {
    return (
      <div
        className="rounded-full shrink-0 flex items-center justify-center"
        style={{ width: size, height: size, backgroundColor: "#1A1A24", boxShadow: ring }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarImageSrc(preset.key)}
          alt={preset.name}
          style={{ width: size * 0.82, height: size * 0.82, objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center font-black"
      style={{
        width: size,
        height: size,
        backgroundColor: "#D9772E",
        color: "#0A0A0F",
        fontSize: size * 0.42,
        boxShadow: ring,
      }}
    >
      {(nickname.charAt(0) || "A").toUpperCase()}
    </div>
  );
}
