"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function DashboardPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.DASHBOARD}>
      <DashboardOverview />
    </RequirePermission>
  );
}
