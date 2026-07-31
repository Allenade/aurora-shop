import type { Metadata } from "next";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSplitShell panel={<AuthBrandPanel />}>{children}</AuthSplitShell>;
}
