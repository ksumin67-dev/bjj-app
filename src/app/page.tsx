import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllAthletes } from "@/lib/airtable/athletes";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getUserProfile } from "@/lib/supabase/userProfile";
import { getMyTechniqueGoals } from "@/lib/supabase/techniqueGoals";
import { buildTrainingCountMap } from "@/types/domain";
import { HomeDashboard } from "@/components/home/HomeDashboard";
export const metadata = { title: "홈 · 그래플로그" };
export const dynamic  = "force-dynamic";

export default async function HomePage() {
  const [techniques, athletes, sessions, profile, goals] = await Promise.all([
    getAllTechniques(),
    getAllAthletes(),
    getAllTrainingSessions(),
    getUserProfile(),
    getMyTechniqueGoals(),
  ]);

  const trainingCountMap = buildTrainingCountMap(sessions);

  return (
    <HomeDashboard
      sessions={sessions}
      techniques={techniques}
      athletes={athletes}
      trainingCountMap={trainingCountMap}
      profile={profile}
      goalTechniqueIds={goals.map((g) => g.techniqueRecordId)}
      goalAthleteMap={Object.fromEntries(goals.map((g) => [g.techniqueRecordId, g.athleteRecordId]))}
    />
  );
}
