import { getAvatarPreset, avatarImageSrc, avatarPhotoUrl } from "@/lib/avatars";
import { publicEnv } from "@/lib/publicEnv";

/**
 * 사용자 프로필 아바타. 캐릭터(preset) / 내 사진(photo) / 닉네임 첫 글자 순으로 표시.
 */
export function UserAvatar({
  avatarType,
  avatarValue,
  nickname,
  size = 44,
}: {
  avatarType: "preset" | "photo" | null;
  avatarValue: string | null;
  nickname: string;
  size?: number;
}) {
  const preset = avatarType === "preset" ? getAvatarPreset(avatarValue) : null;

  if (avatarType === "photo" && avatarValue) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarPhotoUrl(avatarValue, publicEnv.NEXT_PUBLIC_SUPABASE_URL)}
        alt="프로필 사진"
        className="rounded-full shrink-0 object-cover"
        style={{ width: size, height: size, backgroundColor: "#1A1A24" }}
      />
    );
  }

  if (preset) {
    return (
      <div
        className="rounded-full shrink-0 flex items-center justify-center"
        style={{ width: size, height: size, backgroundColor: "#1A1A24" }}
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
      style={{ width: size, height: size, backgroundColor: "#D9772E", color: "#0A0A0F", fontSize: size * 0.42 }}
    >
      {(nickname.charAt(0) || "A").toUpperCase()}
    </div>
  );
}
