import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { getMyTechniqueGoalIdSet } from "@/lib/supabase/techniqueGoals";
import { buildTrainingCountMap } from "@/types/domain";
import { HomeDashboard } from "@/components/home/HomeDashboard";
export const metadata = { title: "홈 · 그래플로그" };
export const dynamic  = "force-dynamic";

export default async function HomePage() {
  const [techniques, athletes, sessions, profile, goalIdSet] = await Promise.all([
    getAllTechniques(),
    getAllAthletes(),
    getAllTrainingSessions(),
    getUserProfile(),
    getMyTechniqueGoalIdSet(),
  ]);

  const trainingCountMap = buildTrainingCountMap(sessions);

  return (
    <HomeDashboard
      sessions={sessions}
      techniques={techniques}
      athletes={athletes}
      trainingCountMap={trainingCountMap}
      profile={profile}
      goalTechniqueIds={Array.from(goalIdSet)}
    />
  );
}
