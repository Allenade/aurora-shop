import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/admin-shell";
import { AdminProviders } from "@/components/providers/admin-providers";
import { requireAdminUser } from "@/lib/bff/guards";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Aurora Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <AdminProviders user={user}>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
