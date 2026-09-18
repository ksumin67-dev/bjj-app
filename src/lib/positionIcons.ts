import {
  Shield,
  Lock, Moon, GitFork, RefreshCw, RefreshCcw, Asterisk, Link2, X, Slash,
  Percent, Fence, Anchor, Hand,
  MoveRight, Unlock, LockOpen, CircleDashed, Waves, RotateCcw, Crosshair,
  Grip, ChevronsUp, Target, Compass, UserRound,
  ArrowDownToLine,
  LogOut, DoorOpen, ShieldOff, ArrowUpFromLine, ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

/**
 * 포지션 코드별 아이콘 — 기술 특징(잠금/회전/방향 등)을 반영해 31개 전부
 * 다르게 배정 (2026-09-19). 원래 SkillTreeBrowser.tsx(클라이언트 컴포넌트)
 * 안에만 있던 걸 서버 컴포넌트(포지션 상세 페이지)에서도 재사용하려고
 * 별도 모듈로 분리 (2026-09-19).
 */
export const POSITION_ICON: Record<string, LucideIcon> = {
  // 가드 (13) — 잠금/회전/방향 등 기술 메커니즘을 은유
  CG: Lock, HG: Moon, BF: GitFork, DLR: RefreshCw, RDLR: RefreshCcw,
  SP: Asterisk, LS: Link2, XG: X, SLX: Slash, FF: Percent,
  KG: Fence, SG: Anchor, RG: Hand,
  // 가드 브레이크/패싱 (7)
  GP: MoveRight, GB: Unlock, GBCG: LockOpen, GBSP: CircleDashed,
  GBLS: Waves, GBDLR: RotateCcw, GBBF: Crosshair,
  // 탑 컨트롤 (6, KB는 KNB와 동일 포지션의 레거시 코드)
  SC: Grip, MT: ChevronsUp, KNB: Target, KB: Target, NS: Compass, BC: UserRound,
  // 스탠딩 (1)
  TD: ArrowDownToLine,
  // 이스케이프 (5)
  ME: LogOut, SCE: DoorOpen, BD: ShieldOff, KNBE: ArrowUpFromLine, NSE: ArrowLeftRight,
};

export const POSITION_ICON_FALLBACK: LucideIcon = Shield;
