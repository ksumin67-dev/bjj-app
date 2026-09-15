import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllSequences } from "@/lib/supabase/sequences";
import { getAllTrainingSessions } from "@/lib/supabase/trainingSessions";
import { getMyTechniqueGoalIdSet } from "@/lib/supabase/techniqueGoals";
import { CalendarHome } from "@/components/calendar/CalendarHome";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "캘린더" };
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [techniques, sequences, sessions, goalIdSet] = await Promise.all([
    getAllTechniques(),
    getAllSequences(),
    getAllTrainingSessions(),
    getMyTechniqueGoalIdSet(),
  ]);

  return (
    <PageWrapper>
      <CalendarHome
        techniques={techniques}
        sequences={sequences}
        sessions={sessions}
        goalTechRecordIds={Array.from(goalIdSet)}
      />
    </PageWrapper>
  );
}
