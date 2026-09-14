"use client";

import type { ReactNode } from "react";
import { SessionExpiryWatcher } from "@/components/providers/session-expiry-watcher";
import { PermissionProvider } from "@/lib/permissions";
import type { SessionUser } from "@/lib/permissions/permissions.types";

export function AdminProviders({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return (
    <PermissionProvider user={user}>
      <SessionExpiryWatcher />
      {children}
    </PermissionProvider>
  );
}
