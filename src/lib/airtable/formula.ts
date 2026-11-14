/**
 * Airtable formula 문자열 리터럴 이스케이프.
 *
 * `getTechniqueByTechId`는 `replace(/'/g, "\'")`를 썼는데, JS 문자열에서
 * `"\'"`는 그냥 `'`라 따옴표가 그대로 남는다. `AB'C`는 `{fld} = 'AB'C'`가 되어
 * formula가 깨진다. 조회는 이제 캐시된 카탈로그에서 하고, 직접 formula가
 * 다시 필요하면 이 함수를 쓴다.
 */
export function escapeAirtableFormulaString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function airtableFieldEquals(fieldId: string, value: string): string {
  return `{${fieldId}} = '${escapeAirtableFormulaString(value)}'`;
}

export function airtableRecordIdEquals(recordId: string): string {
  return `RECORD_ID() = '${escapeAirtableFormulaString(recordId)}'`;
}
