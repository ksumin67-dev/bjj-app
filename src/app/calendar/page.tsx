import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllSequences } from "@/lib/airtable/sequences";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
import { CalendarHome } from "@/components/calendar/CalendarHome";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata = { title: "캘린더" };
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [techniques, sequences, sessions] = await Promise.all([
    getAllTechniques(),
    getAllSequences(),
    getAllTrainingSessions(),
  ]);

  return (
    <PageWrapper>
      <CalendarHome
        techniques={techniques}
        sequences={sequences}
        sessions={sessions}
      />
    </PageWrapper>
  );
}
