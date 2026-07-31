"use client";

import { ProductCatalog } from "@/components/admin/product-catalog";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminProductsPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.PRODUCT}>
      <ProductCatalog />
    </RequirePermission>
  );
}
