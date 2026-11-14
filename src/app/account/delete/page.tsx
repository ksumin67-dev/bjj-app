import { AccountDeleteView } from "@/components/account/AccountDeleteView";
import { DeleteAccountConfirm } from "@/components/account/DeleteAccountConfirm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "계정 삭제" };
export const dynamic = "force-dynamic";

/** 브라우저에서 여는 계정 삭제 페이지. 앱 밖에서도 같은 주소로 들어올 수 있다. */
export default async function AccountDeletePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedIn = Boolean(user);
  return (
    <AccountDeleteView
      signedIn={signedIn}
      confirm={signedIn ? <DeleteAccountConfirm email={user?.email ?? null} /> : null}
    />
  );
}
