"use client";

import { AdminInventory } from "@/components/admin/admin-inventory";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminInventoryPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.INVENTORY}>
      <AdminInventory />
    </RequirePermission>
  );
}
