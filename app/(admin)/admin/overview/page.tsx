"use client";

import { AdminOverview } from "@/components/admin/admin-overview";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminOverviewPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.OVERVIEW}>
      <AdminOverview />
    </RequirePermission>
  );
}
