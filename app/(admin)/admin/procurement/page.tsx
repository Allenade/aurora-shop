"use client";

import { AdminProcurement } from "@/components/admin/admin-procurement";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminProcurementPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.PROCUREMENT}>
      <AdminProcurement />
    </RequirePermission>
  );
}
