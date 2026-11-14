/**
 * 선수 아바타. photoUrl이 있으면 그 이미지를, 없으면 실루엣
 * 일러스트(머리 원 + 가슴)를 대표 스타일 태그 색으로 같은 크기에 그린다.
 * 실사진 경로는 src/lib/athletePhotos.ts. 권리 확인 전에는 플래그가 꺼져
 * 있어 호출부가 null을 넘기고, 이 실루엣이 모든 선수 사진 자리를 채운다.
 */
export function AthleteAvatar({
  color,
  size = 34,
  photoUrl,
  alt = "",
}: {
  color: string;
  size?: number;
  photoUrl?: string | null;
  alt?: string;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={alt}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="50" cy="36" r="17" fill={color} opacity="0.28" />
      <path
        d="M18,100 Q20,66 40,56 L50,66 L60,56 Q80,66 82,100 Z"
        fill={color}
        opacity="0.28"
      />
      <path
        d="M42,58 L50,70 L58,58"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
