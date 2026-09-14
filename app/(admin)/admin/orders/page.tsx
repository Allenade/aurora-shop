import { AdminOrders } from "@/components/admin/admin-orders";
import { loadAdminOrdersInitial } from "@/lib/bff/admin-data";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default async function AdminOrdersPage() {
  const initialData = await loadAdminOrdersInitial();

  return (
    <RequirePermission action={Action.READ} resource={Resource.ORDER}>
      <AdminOrders initialData={initialData} />
    </RequirePermission>
  );
}
