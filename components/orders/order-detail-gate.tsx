"use client";

import type { ReactNode } from "react";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export function OrderDetailGate({ children }: { children: ReactNode }) {
  return (
    <RequirePermission action={Action.READ} resource={Resource.ORDER}>
      {children}
    </RequirePermission>
  );
}
