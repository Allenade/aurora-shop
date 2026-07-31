"use client";

import { ShopCatalog } from "@/components/shop/shop-catalog";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function ShopPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SHOP}>
      <ShopCatalog />
    </RequirePermission>
  );
}
