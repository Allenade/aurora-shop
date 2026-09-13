import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { requireBuyerUser } from "@/lib/bff/guards";

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
  const user = await requireBuyerUser();

  return (
    <AppProviders user={user}>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
