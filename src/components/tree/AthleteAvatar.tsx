/**
 * 실루엣 일러스트 아바타 — 실사진 대신 사용.
 * 특정 인물을 식별할 수 없는 추상적 형태(머리 원 + 가슴 실루엣)를
 * 선수의 대표 스타일 태그 색으로 채워 표시한다.
 * 실사진 라이선스가 확보되는 선수부터 순차적으로 실제 사진으로 교체 예정.
 */
export function AthleteAvatar({
  color,
  size = 34,
}: {
  color: string;
  size?: number;
}) {
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
