import { getUserProfile } from "@/lib/airtable/userProfile";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export const metadata = { title: "프로필" };
export const dynamic  = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getUserProfile();
  return (
    <PageWrapper>
      <ProfileEditor profile={profile} />
    </PageWrapper>
  );
}
