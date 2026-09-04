"use client";

import { SettingsPage } from "@/components/settings/settings-page";
import { Action, Resource, RequirePermission } from "@/lib/permissions";
import { ADMIN_SETTINGS_TABS } from "@/lib/settings";

export default function AdminSettingsPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SETTINGS}>
      <SettingsPage basePath="/admin/settings" tabs={ADMIN_SETTINGS_TABS} />
    </RequirePermission>
  );
}
