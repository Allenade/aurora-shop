import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/admin-shell";
import { AdminProviders } from "@/components/providers/admin-providers";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Aurora Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
