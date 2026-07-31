"use client";

import { SavedDrafts } from "@/components/track-orders/saved-drafts";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function TrackOrdersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.TRACK_ORDER}>
      <SavedDrafts />
    </RequirePermission>
  );
}
