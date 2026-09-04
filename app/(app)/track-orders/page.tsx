"use client";

import { TrackOrderPage } from "@/components/track-orders/track-order-page";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function TrackOrdersRoutePage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.TRACK_ORDER}>
      <TrackOrderPage />
    </RequirePermission>
  );
}
