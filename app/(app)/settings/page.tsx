"use client";

import { SettingsPage } from "@/components/settings/settings-page";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function SettingsRoutePage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SETTINGS}>
      <SettingsPage />
    </RequirePermission>
  );
}
