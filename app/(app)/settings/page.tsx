"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function SettingsPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SETTINGS}>
      <PagePlaceholder
        title="Settings"
        description="Account settings — this page will get components/settings/ next."
      />
    </RequirePermission>
  );
}
