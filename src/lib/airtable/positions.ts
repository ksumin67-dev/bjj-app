import "server-only";
import { getAllTechniques, POSITION_TYPES } from "./techniques";
import type { Technique } from "@/types/domain";

// 포지션은 Techniques 테이블에 통합됨 (type이 가드/탑포지션/전환/방어인 레코드)
export type Position = Technique;

export async function getAllPositions(): Promise<Technique[]> {
  const all = await getAllTechniques();
  return all.filter((t) => POSITION_TYPES.includes(t.type));
}

export async function getPositionByPositionId(positionId: string): Promise<Technique | null> {
  const all = await getAllTechniques();
  return all.find((t) => t.id === positionId) ?? null;
}
