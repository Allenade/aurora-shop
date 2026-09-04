"use client";

import type { ReactNode } from "react";
import { PermissionProvider } from "@/lib/permissions";
import type { SessionUser } from "@/lib/permissions/permissions.types";

export function AppProviders({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return <PermissionProvider user={user}>{children}</PermissionProvider>;
}
