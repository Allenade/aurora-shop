"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminSettingsPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SETTINGS}>
      <PagePlaceholder
        title="Settings"
        description="Admin settings will live here."
      />
    </RequirePermission>
  );
}
