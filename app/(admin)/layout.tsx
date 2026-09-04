import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { AdminProviders } from "@/components/providers/admin-providers";
import { getCurrentUser } from "@/lib/bff/auth";

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
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  if (user.type !== "admin") redirect("/dashboard");

  return (
    <AdminProviders user={user}>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
