"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider storageKey="aurora-admin-sidebar-collapsed">
      <div className="flex h-dvh w-full overflow-hidden bg-[#f6f6f6]">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col transition-[width] duration-200 ease-out">
          <TopBar showCart={false} profileHref="/admin/settings" />
          <main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
