"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminInventoryPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.INVENTORY}>
      <PagePlaceholder
        title="Inventory"
        description="Admin inventory management will live here."
      />
    </RequirePermission>
  );
}
