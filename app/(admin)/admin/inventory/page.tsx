import { AdminInventory } from "@/components/admin/admin-inventory";
import { loadAdminInventoryInitial } from "@/lib/bff/admin-data";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default async function AdminInventoryPage() {
  const initialData = await loadAdminInventoryInitial();

  return (
    <RequirePermission action={Action.READ} resource={Resource.INVENTORY}>
      <AdminInventory initialData={initialData} />
    </RequirePermission>
  );
}
