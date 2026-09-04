"use client";

import { AdminOrders } from "@/components/admin/admin-orders";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminOrdersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.ORDER}>
      <AdminOrders />
    </RequirePermission>
  );
}
