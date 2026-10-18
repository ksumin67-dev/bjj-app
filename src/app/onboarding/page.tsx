import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAthletePhoto } from "@/lib/athletePhotos";
import { OnboardingFlow, type OnboardingAthlete } from "@/components/onboarding/OnboardingFlow";
import type { StyleTag } from "@/types/domain";

export const metadata = { title: "시작하기" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const athletes = await getAllAthletes();

  const list: OnboardingAthlete[] = athletes.map((a) => ({
    id: a.recordId,
    name: a.nameKo,
    styleTags: a.styleTags as StyleTag[],
    photo: getAthletePhoto(a.recordId),
  }));

  return <OnboardingFlow athletes={list} />;
}
