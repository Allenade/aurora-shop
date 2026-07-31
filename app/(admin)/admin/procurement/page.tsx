"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminProcurementPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.PROCUREMENT}>
      <PagePlaceholder
        title="Procurement"
        description="Admin procurement queue will live here."
      />
    </RequirePermission>
  );
}
