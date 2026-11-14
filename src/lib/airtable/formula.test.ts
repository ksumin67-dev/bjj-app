import assert from "node:assert/strict";
import { test } from "node:test";
// Node의 타입 스트립 실행은 .ts 확장자가 필요하고, tsc(bundler)는 기본적으로 막는다.
// @ts-expect-error TS5097
import { airtableFieldEquals, airtableRecordIdEquals } from "./formula.ts";

test("예전 \"\\'\" 치환은 따옴표를 이스케이프하지 않는다", () => {
  const techId = "AB'C";
  const broken = `{fld} = '${techId.replace(/'/g, "\'")}'`;
  assert.equal(broken, "{fld} = 'AB'C'");
});

test("필드 비교 formula는 따옴표와 역슬래시를 이스케이프한다", () => {
  assert.equal(airtableFieldEquals("fld", "ABC"), "{fld} = 'ABC'");
  assert.equal(airtableFieldEquals("fld", "AB'C"), "{fld} = 'AB\\'C'");
  assert.equal(airtableFieldEquals("fld", "a\\b"), "{fld} = 'a\\\\b'");
  assert.equal(airtableFieldEquals("fld", "a\\'b"), "{fld} = 'a\\\\\\'b'");
});

test("RECORD_ID formula도 같은 이스케이프를 쓴다", () => {
  assert.equal(airtableRecordIdEquals("recABC"), "RECORD_ID() = 'recABC'");
  assert.equal(
    airtableRecordIdEquals("rec'X"),
    "RECORD_ID() = 'rec\\'X'",
  );
});
