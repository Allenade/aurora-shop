"use client";

import { AdminUsers } from "@/components/admin/admin-users";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminUsersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.USER}>
      <AdminUsers />
    </RequirePermission>
  );
}
