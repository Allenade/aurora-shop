"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <ShellWithSidebar sidebar={<Sidebar />} topBar={<TopBar />}>
        {children}
      </ShellWithSidebar>
    </SidebarProvider>
  );
}
