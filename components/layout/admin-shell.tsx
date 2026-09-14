"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider storageKey="aurora-admin-sidebar-collapsed">
      <ShellWithSidebar
        sidebar={<AdminSidebar />}
        topBar={<TopBar showCart={false} profileHref="/admin/settings" />}
      >
        {children}
      </ShellWithSidebar>
    </SidebarProvider>
  );
}
