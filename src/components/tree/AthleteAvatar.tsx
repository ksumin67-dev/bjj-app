/**
 * 선수 아바타 — 실사진이 등록된 선수는 실사진을, 없는 선수는 실루엣
 * 일러스트(머리 원 + 가슴 실루엣)를 대표 스타일 태그 색으로 채워 표시한다.
 * 실사진 매핑은 src/lib/athletePhotos.ts 참고. 라이선스가 확보되는
 * 선수부터 순차적으로 실제 사진으로 교체 예정.
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
