"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function ProcurementsPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.PROCUREMENT}>
      <PagePlaceholder
        title="Procurements"
        description="Procurement requests — this page will get components/procurements/ next."
      />
    </RequirePermission>
  );
}
