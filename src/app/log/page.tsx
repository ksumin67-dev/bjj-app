import { redirect } from "next/navigation";

/** /log → 홈(캘린더)으로 리다이렉트 */
export default function LogRedirect() {
  redirect("/");
}
