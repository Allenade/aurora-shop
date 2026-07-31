"use client";

import { OrdersList } from "@/components/orders/orders-list";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function OrdersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.ORDER}>
      <OrdersList />
    </RequirePermission>
  );
}
