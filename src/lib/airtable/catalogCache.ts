import "server-only";
import { cache } from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { readWithLastGood } from "./lastGood";

/**
 * 기술/선수 카탈로그(전역 Airtable 마스터) 캐시.
 *
 * - TTL 10분. 요청한 5–15분 범위.
 * - Next 15.5.29의 `unstable_cache` + `revalidateTag(tag)` (한 인자).
 *   `"use cache"`, `updateTag`, Next 16의 `revalidateTag(tag, profile)` 는 쓰지 않는다.
 *   15.5에서 `unstable_expireTag`는 `revalidateTag`와 같은 태그 표시라 호출하지 않는다.
 * - 태그가 무효화되면 fetch 캐시는 이전 값을 돌려주지 않고 다음 읽기에서 다시 가져온다.
 * - TTL이 지난 항목의 포그라운드 재검증이 실패하면 Next 15.5가 캐시된 본문을 반환한다.
 * - React `cache()`로 같은 요청 안의 중복 호출을 한 번의 읽기로 합친다.
 * - 로더가 throw 하면 Data Cache에 실패를 넣지 않는다. 무효화 직후 재조회가
 *   실패해 예외가 올라오면 이 프로세스의 마지막 성공 값을 쓴다. 그것도 없으면 전파한다.
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
  // Next 15.5.29는 revalidateTag(tag) 한 인자. 다음 읽기는 스테일을 건너뛴다.
  revalidateTag(AIRTABLE_TECHNIQUES_TAG);
  for (const path of TECHNIQUE_CATALOG_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/tree", "layout");
  revalidatePath("/gameplans", "layout");
}
