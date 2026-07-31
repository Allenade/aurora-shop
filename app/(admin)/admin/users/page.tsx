"use client";

import { PagePlaceholder } from "@/components/page/page-placeholder";
import { Action, Resource, RequirePermission } from "@/lib/permissions";

export default function AdminUsersPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.USER}>
      <PagePlaceholder
        title="Users"
        description="Admin user management will live here."
      />
    </RequirePermission>
  );
}
