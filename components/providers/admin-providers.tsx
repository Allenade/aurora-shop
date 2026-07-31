"use client";

import type { ReactNode } from "react";
import { PermissionProvider } from "@/lib/permissions";
import { getAdminSessionUser } from "@/lib/session";

export function AdminProviders({ children }: { children: ReactNode }) {
  const user = getAdminSessionUser();
  return <PermissionProvider user={user}>{children}</PermissionProvider>;
}
