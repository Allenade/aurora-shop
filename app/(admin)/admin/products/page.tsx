import { Suspense } from "react";
import { ProductCatalog } from "@/components/admin/product-catalog";
import { TableSkeletonRows } from "@/components/ui/skeleton";
import { loadAdminProductsInitial } from "@/lib/bff/admin-data";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

function ProductsFallback() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
      <table className="w-full">
        <tbody>
          <TableSkeletonRows columns={7} rows={8} />
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminProductsPage() {
  const initialData = await loadAdminProductsInitial();

  return (
    <RequirePermission action={Action.READ} resource={Resource.PRODUCT}>
      <Suspense fallback={<ProductsFallback />}>
        <ProductCatalog initialData={initialData} />
      </Suspense>
    </RequirePermission>
  );
}
