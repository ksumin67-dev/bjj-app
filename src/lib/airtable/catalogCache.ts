import "server-only";
import { cache } from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { readWithLastGood } from "./lastGood";

/**
 * 기술/선수 카탈로그(전역 Airtable 마스터) 캐시.
 *
 * - TTL 10분. 요청한 5–15분 범위.
 * - `unstable_cache` + `revalidateTag(tag)`는 Next 14.2와 15.5 모두에 있다.
 *   `"use cache"`, `updateTag`, `revalidateTag`의 cacheLife 인자는 쓰지 않는다.
 *   (Next 16에서 시그니처가 바뀐다.)
 * - React `cache()`로 같은 요청 안의 중복 호출을 한 번의 읽기로 합친다.
 * - 로더가 throw 하면 Data Cache에 실패를 넣지 않는다. 백그라운드 재검증
 *   실패 시 Next가 마지막 성공 값을 그대로 돌려주고, 그게 throw로 올라오면
 *   이 프로세스의 마지막 성공 값을 쓴다. 둘 다 없으면 에러를 전파한다.
 * - 유저별 Supabase 데이터는 이 캐시에 넣지 않는다.
 */

/** 10분 */
export const CATALOG_REVALIDATE_SECONDS = 60 * 10;

export const AIRTABLE_TECHNIQUES_TAG = "airtable-techniques";
export const AIRTABLE_ATHLETES_TAG = "airtable-athletes";

const TECHNIQUE_CATALOG_PATHS = [
  "/",
  "/tree",
  "/calendar",
  "/stats",
  "/gameplans",
  "/profile",
  "/onboarding",
  "/admin/techniques",
] as const;

export function cachedCatalogRead<T extends unknown[]>(options: {
  key: string;
  tag: string;
  load: () => Promise<T>;
}): () => Promise<T> {
  const { key, tag, load } = options;
  // 콜백 안에서는 catch 하지 않는다. 빈 배열을 반환하면 그 실패가 TTL 동안 캐시된다.
  const readCached = unstable_cache(load, [key], {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [tag],
  });

  return cache(async () => {
    const data = await readWithLastGood(key, () => readCached());
    // 호출부가 sort해도 프로세스 메모리의 마지막 성공 값을 재배치하지 않게 복사한다.
    return data.slice() as T;
  });
}

/**
 * 관리자 기술 생성/수정/삭제 직후 호출. 다음 읽기에서 Airtable을 다시 친다.
 * 페이지는 유저 데이터 때문에 대부분 force-dynamic이라, 라우트 캐시보다
 * 태그 무효화가 카탈로그 신선도를 결정한다.
 */
export function invalidateTechniqueCatalog(): void {
  // Next 14.2 / 15.5 한 인자 형태. Next 16의 profile 인자는 여기 넣지 않는다.
  revalidateTag(AIRTABLE_TECHNIQUES_TAG);
  for (const path of TECHNIQUE_CATALOG_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/tree", "layout");
  revalidatePath("/gameplans", "layout");
}
