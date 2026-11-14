import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SUPPORT_EMAIL } from "@/lib/supportContact";
import { AccountDeleteView } from "./AccountDeleteView";
import { DeleteAccountConfirm } from "./DeleteAccountConfirm";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => createElement("a", { href, className }, children),
}));

vi.mock("@/lib/actions/account", () => ({
  deleteAccountAction: vi.fn(),
}));

function html(node: ReactNode) {
  return renderToStaticMarkup(node);
}

describe("account delete page", () => {
  it("asks a signed-out visitor to log in and shows the support email", () => {
    const markup = html(createElement(AccountDeleteView, { signedIn: false }));
    expect(markup).toContain("계정 삭제");
    expect(markup).toContain("프로필 사진");
    expect(markup).toContain("직접 입력한 기술 이름");
    expect(markup).toContain("로그인하고 계속");
    expect(markup).toContain(`/login?next=${encodeURIComponent("/account/delete")}`);
    expect(markup).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(markup).toContain(SUPPORT_EMAIL);
    expect(markup).not.toContain("계정을 영구 삭제");
    expect(markup).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(markup).not.toContain("AIRTABLE_API_KEY");
  });

  it("shows the signed-in confirm form for that account", () => {
    const markup = html(
      createElement(AccountDeleteView, {
        signedIn: true,
        confirm: createElement(DeleteAccountConfirm, { email: "member@example.com" }),
      }),
    );
    expect(markup).toContain("member@example.com");
    expect(markup).toContain("계정을 영구 삭제");
    expect(markup).toContain("복구할 수 없음");
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain("disabled");
    expect(markup).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(markup).toContain("프로필로 돌아가기");
    expect(markup).not.toContain("로그인하고 계속");
    expect(markup).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(markup).not.toContain("AIRTABLE_API_KEY");
  });
});
