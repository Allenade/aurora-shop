import type { Metadata } from "next";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSplitShell panel={<AuthBrandPanel />}>{children}</AuthSplitShell>;
}
