import { getAllAthletes } from "@/lib/airtable/athletes";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { STYLE_TAG_ORDER } from "@/types/domain";
import type { StyleTag } from "@/types/domain";

export const metadata = { title: "시작하기" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const athletes = await getAllAthletes();

  // 스타일 태그별 예시 선수 이름(최대 2명) — 온보딩에서 "이런 선수처럼"
  // 감을 잡을 수 있도록. 선수 데이터는 이미 스타일 태그로 정리되어 있음.
  const exampleAthletes = Object.fromEntries(
    STYLE_TAG_ORDER.map((tag) => [
      tag,
      athletes.filter((a) => a.styleTags.includes(tag)).slice(0, 2).map((a) => a.nameKo),
    ]),
  ) as Record<StyleTag, string[]>;

  return <OnboardingFlow exampleAthletes={exampleAthletes} />;
}
