import { getAllTechniques } from "@/lib/airtable/techniques";
import { getAllTrainingSessions } from "@/lib/airtable/trainingSessions";
import { getUserProfile } from "@/lib/airtable/userProfile";
import { buildTrainingCountMap } from "@/types/domain";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export const metadata = { title: "프로필" };
export const dynamic  = "force-dynamic";

export default async function ProfilePage() {
  const [techniques, sessions, profile] = await Promise.all([
    getAllTechniques(),
    getAllTrainingSessions(),
    getUserProfile(),
  ]);

  const trainingCountMap = buildTrainingCountMap(sessions);

  return (
    <PageWrapper>
      <ProfileEditor
        profile={profile}
        sessions={sessions}
        techniques={techniques}
        trainingCountMap={trainingCountMap}
      />
    </PageWrapper>
  );
}
