"use client";

import { useMeetsRequirement } from "./permissions.hooks";
import type { PermissionRequirement } from "./permissions.types";
import type { ReactNode } from "react";

type RequirePermissionProps = PermissionRequirement & {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * Page / section guard. Use in layouts or page wrappers.
 * Example: <RequirePermission action="read" resource="dashboard">...</RequirePermission>
 */
export function RequirePermission({
  children,
  fallback = (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#8a8a8a]">
      You don&apos;t have permission to view this page.
    </div>
  ),
  ...req
}: RequirePermissionProps) {
  const allowed = useMeetsRequirement(req);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
