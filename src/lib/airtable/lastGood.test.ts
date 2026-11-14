import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogLog } from "./lastGood";
// Node의 타입 스트립 실행은 .ts 확장자가 필요하고, tsc(bundler)는 기본적으로 막는다.
// @ts-expect-error TS5097
import { readWithLastGood } from "./lastGood.ts";

function spyLog() {
  const lines: string[] = [];
  const log: CatalogLog = (level, message) => {
    lines.push(`${level}:${message}`);
  };
  return { lines, log };
}

test("성공한 목록만 기억하고, 실패하면 그 목록을 반환한다", async () => {
  const memory = new Map<string, string[]>();
  const { lines, log } = spyLog();

  const first = await readWithLastGood("techniques", async () => ["armbar"], memory, log);
  assert.deepEqual(first, ["armbar"]);

  const second = await readWithLastGood(
    "techniques",
    async () => {
      throw new Error("airtable timeout");
    },
    memory,
    log,
  );
  assert.deepEqual(second, ["armbar"]);
  assert.equal(lines.filter((line) => line.startsWith("error:")).length, 1);
  assert.equal(lines.filter((line) => line.startsWith("warn:")).length, 1);
});

test("성공 이력이 없으면 빈 배열로 바꾸지 않고 에러를 던진다", async () => {
  const memory = new Map<string, string[]>();
  const { lines, log } = spyLog();

  await assert.rejects(
    () =>
      readWithLastGood(
        "athletes",
        async () => {
          throw new Error("airtable down");
        },
        memory,
        log,
      ),
    /airtable down/,
  );
  assert.equal(memory.size, 0);
  assert.equal(lines.length, 1);
  assert.match(lines[0], /^error:/);
});

test("빈 카탈로그는 실패가 아니라 성공 결과다", async () => {
  const memory = new Map<string, string[]>();
  const value = await readWithLastGood("techniques", async () => [], memory, () => {});
  assert.deepEqual(value, []);

  const again = await readWithLastGood(
    "techniques",
    async () => {
      throw new Error("down");
    },
    memory,
    () => {},
  );
  assert.deepEqual(again, []);
});
