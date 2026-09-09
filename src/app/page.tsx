import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { buildTrainingCountMap } from "@/types/domain";
import { HomeDashboard } from "@/components/home/HomeDashboard";
export const metadata = { title: "홈 · bjj.app" };
export const dynamic  = "force-dynamic";

export default async function HomePage() {
  const [techniques, sessions, profile] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
    getUserProfile(),
  ]);

  const trainingCountMap = buildTrainingCountMap(sessions);

  return (
    <HomeDashboard
      sessions={sessions}
      techniques={techniques}
      trainingCountMap={trainingCountMap}
      profile={profile}
    />
  );
}
