import "server-only";
/**
 * @deprecated Status 시스템 제거 (v2). 이 파일의 함수는 모두 no-op stub입니다.
 * 진척도는 TrainingSession 기록에서 자동 계산됩니다.
 */

/** @deprecated */
export async function getAllProgress(): Promise<never[]> {
  return [];
}

/** @deprecated */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexProgressByTechnique(_list: never[]): Map<string, any> {
  return new Map();
}

/** @deprecated */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function statusOf(_map: Map<string, never>, _id: string): "미수련" {
  return "미수련";
}

/** @deprecated */
export async function drillUp(_techniqueRecordId: string): Promise<void> {
  // no-op
}

/** @deprecated */
export async function sparringUp(_techniqueRecordId: string): Promise<void> {
  // no-op
}
