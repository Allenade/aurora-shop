"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminOrdersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.ORDER}>
      <PagePlaceholder
        title="Orders"
        description="Admin order management will live here."
      />
    </RequirePermission>
  );
}
