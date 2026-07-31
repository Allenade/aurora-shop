"use client";

import type { ReactNode } from "react";
import { PermissionProvider } from "@/lib/permissions";
import { getSessionUser } from "@/lib/session";

export function AppProviders({ children }: { children: ReactNode }) {
  const user = getSessionUser();
  return <PermissionProvider user={user}>{children}</PermissionProvider>;
}
