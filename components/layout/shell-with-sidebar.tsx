"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

type ShellWithSidebarProps = {
  sidebar: ReactNode;
  topBar: ReactNode;
  children: ReactNode;
};

/**
 * Shared app chrome: desktop push sidebar, mobile overlay drawer.
 * Spacer keeps main content width stable on small screens when the drawer opens.
 */
export function ShellWithSidebar({
  sidebar,
  topBar,
  children,
}: ShellWithSidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f6f6]">
      <div
        className={cn(
          "shrink-0 transition-[width] duration-200 ease-out",
          collapsed ? "w-[76px]" : "w-[260px] max-lg:w-[76px]",
        )}
        aria-hidden
      />
      {sidebar}
      {!collapsed ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setCollapsed(true)}
        />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {topBar}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function sidebarAsideClassName(collapsed: boolean) {
  return cn(
    "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-[#ececec] bg-white py-4 transition-[width] duration-200 ease-out",
    collapsed ? "w-[76px] px-2.5" : "w-[260px] px-4",
  );
}
