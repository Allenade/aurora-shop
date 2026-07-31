"use client";

import type { ReactNode } from "react";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export function ShopProductGate({ children }: { children: ReactNode }) {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SHOP}>
      {children}
    </RequirePermission>
  );
}
