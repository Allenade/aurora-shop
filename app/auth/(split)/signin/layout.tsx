import type { Metadata } from "next";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { SignInBrandPanel } from "@/components/auth/signin-brand-panel";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSplitShell panel={<SignInBrandPanel />}>{children}</AuthSplitShell>
  );
}
