"use client";

import { ProcurementPage } from "@/components/procurements/procurement-page";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function ProcurementsRoutePage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.PROCUREMENT}>
      <ProcurementPage />
    </RequirePermission>
  );
}
