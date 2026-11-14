// @ts-nocheck
/**
 * Next.js 15.5 IncrementalCache + unstable_cache로 카탈로그 캐시 동작을 확인한다.
 * Airtable은 호출하지 않는다. 로더는 메모리 카운터다.
 *
 *   node --experimental-strip-types scripts/verify-next15-catalog-cache.ts
 */
import "next/dist/server/node-environment-baseline.js";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache.js";
import { IncrementalCache } from "next/dist/server/lib/incremental-cache/index.js";
import { workAsyncStorage } from "next/dist/server/app-render/work-async-storage.external.js";
import { executeRevalidates } from "next/dist/server/revalidation-utils.js";
import { readWithLastGood } from "../src/lib/airtable/lastGood.ts";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "next15-catalog-"));
const incrementalCache = new IncrementalCache({
  dev: false,
  flushToDisk: false,
  minimalMode: false,
  serverDistDir: dir,
  requestHeaders: {},
  maxMemoryCacheSize: 50 * 1024 * 1024,
  fs,
  fetchCacheKeyPrefix: "catalog-verify",
  getPrerenderManifest: () => ({
    version: 4,
    routes: {},
    dynamicRoutes: {},
    notFoundRoutes: [],
    preview: {
      previewModeId: "test",
      previewModeSigningKey: "test",
      previewModeEncryptionKey: "test",
    },
  }),
});

function requestStore() {
  return {
    incrementalCache,
    route: "/tree",
    pendingRevalidatedTags: [],
    pendingRevalidates: {},
    pendingRevalidateWrites: [],
    isOnDemandRevalidate: false,
    isDraftMode: false,
    nextFetchId: 1,
  };
}

async function withRequest(store, fn) {
  return workAsyncStorage.run(store, fn);
}

async function settle(store) {
  const pending = Object.values(store.pendingRevalidates ?? {});
  if (pending.length) await Promise.all(pending);
}

async function main() {
  let loads = 0;
  const load = async () => {
    loads += 1;
    return ["armbar"];
  };
  const readCached = unstable_cache(load, ["verify-techniques"], {
    revalidate: 600,
    tags: ["airtable-techniques"],
  });

  const firstStore = requestStore();
  const first = await withRequest(firstStore, async () => {
    const value = await readCached();
    await settle(firstStore);
    return value;
  });
  const second = await withRequest(firstStore, () => readCached());
  assert.deepEqual(first, ["armbar"]);
  assert.deepEqual(second, ["armbar"]);
  assert.equal(loads, 1, "fresh cache hit must not call the loader again");

  const editStore = requestStore();
  await withRequest(editStore, async () => {
    revalidateTag("airtable-techniques");
    await executeRevalidates(editStore);
  });

  const afterEdit = await withRequest(requestStore(), () => readCached());
  assert.deepEqual(afterEdit, ["armbar"]);
  assert.equal(loads, 2, "revalidateTag must miss and load again");

  let failed = false;
  const flaky = unstable_cache(
    async () => {
      if (failed) throw new Error("airtable down");
      return ["guard-pass"];
    },
    ["verify-fallback"],
    { revalidate: 600, tags: ["airtable-athletes"] },
  );
  const memory = new Map();
  const logs = [];
  const log = (level, message) => logs.push(`${level}:${message}`);

  const warmStore = requestStore();
  const warm = await withRequest(warmStore, () =>
    readWithLastGood("verify-fallback", () => flaky(), memory, log),
  );
  assert.deepEqual(warm, ["guard-pass"]);

  const bustStore = requestStore();
  await withRequest(bustStore, async () => {
    revalidateTag("airtable-athletes");
    await executeRevalidates(bustStore);
  });
  failed = true;
  const stale = await withRequest(requestStore(), () =>
    readWithLastGood("verify-fallback", () => flaky(), memory, log),
  );
  assert.deepEqual(stale, ["guard-pass"]);
  assert.ok(logs.some((line) => line.startsWith("error:")));
  assert.ok(logs.some((line) => line.startsWith("warn:")));

  console.log("next15 catalog cache: hit, invalidation, last-good fallback ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
