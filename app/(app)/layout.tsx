import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { getCurrentUser } from "@/lib/bff/auth";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Aurora Stores",
  },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  if (user.type === "admin") redirect("/admin/overview");

  return (
    <AppProviders user={user}>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
