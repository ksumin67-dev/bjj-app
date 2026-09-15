import { AthleteAvatar } from "./AthleteAvatar";
import { getAthletePhoto } from "@/lib/athletePhotos";
import type { Athlete } from "@/types/domain";

/**
 * FIFA 얼티밋팀 "히어로 카드" 스타일 — 컷코너 사각형 + 네온 글로우 테두리.
 * 좌상단 큰 숫자는 임의 스탯이 아니라 Athlete.heroStat(실제 커리어 성과 수치).
 * 아바타는 실루엣 일러스트(AthleteAvatar) — 실사진 확보 전까지 기본값.
 */

const OUTER_CLIP =
  "polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)";
const INNER_CLIP =
  "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)";

export function AthleteHeroCard({
  athlete,
  accent,
  glow,
}: {
  athlete: Athlete;
  accent: string;
  glow: string;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: 104, height: 140, filter: `drop-shadow(0 0 8px ${glow})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, #0A0A0F 130%)`,
          clipPath: OUTER_CLIP,
        }}
      />
      <div
        className="absolute overflow-hidden"
        style={{
          top: 1.5,
          left: 1.5,
          width: 101,
          height: 137,
          background: "linear-gradient(160deg,#181428 0%,#0A0A0F 60%)",
          clipPath: INNER_CLIP,
        }}
      >
        <div
          className="absolute font-black leading-none text-text-primary"
          style={{ top: 6, left: 8, fontSize: 17 }}
        >
          {athlete.heroStat}
        </div>
        <div
          className="absolute font-extrabold"
          style={{ top: 24, left: 8, fontSize: 6, color: accent }}
        >
          {athlete.heroLabel}
        </div>
        <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 32 }}>
          <AthleteAvatar
            color={accent}
            size={64}
            photoUrl={getAthletePhoto(athlete.recordId)}
            alt={athlete.nameKo}
          />
        </div>
        <div
          className="absolute font-extrabold text-text-primary truncate"
          style={{ bottom: 6, left: 8, right: 8, fontSize: 9 }}
        >
          {athlete.nameKo}
        </div>
      </div>
    </div>
  );
}
