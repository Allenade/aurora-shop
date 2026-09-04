import type { SessionUser } from "@/lib/permissions/permissions.types";
import { Action, Resource } from "@/lib/permissions/permissions.types";

/**
 * Mock buyer (procurement) — used by BFF upstream while AUTH_MODE=mock.
 * Real backend will replace this via GET /auth/me through the BFF.
 */
export const MOCK_SESSION_USER: SessionUser = {
  id: "user_1",
  email: "bayonuga@example.com",
  firstName: "Bayonuga",
  lastName: "Bello",
  type: "procurement",
  roles: [{ id: "role_procurement", name: "Procurement Buyer" }],
  permissions: [
    { action: Action.READ, resource: Resource.DASHBOARD },
    { action: Action.READ, resource: Resource.SHOP },
    { action: Action.LIST, resource: Resource.SHOP },
    { action: Action.READ, resource: Resource.ORDER },
    { action: Action.LIST, resource: Resource.ORDER },
    { action: Action.READ, resource: Resource.TRACK_ORDER },
    { action: Action.READ, resource: Resource.PROCUREMENT },
    { action: Action.LIST, resource: Resource.PROCUREMENT },
    { action: Action.CREATE, resource: Resource.QUOTE },
    { action: Action.READ, resource: Resource.SETTINGS },
    { action: Action.UPDATE, resource: Resource.SETTINGS },
  ],
  rules: [
    { action: Action.READ, subject: Resource.DASHBOARD },
    { action: Action.READ, subject: Resource.SHOP },
    { action: Action.LIST, subject: Resource.SHOP },
    { action: Action.READ, subject: Resource.ORDER },
    { action: Action.LIST, subject: Resource.ORDER },
    { action: Action.READ, subject: Resource.TRACK_ORDER },
    { action: Action.READ, subject: Resource.PROCUREMENT },
    { action: Action.LIST, subject: Resource.PROCUREMENT },
    { action: Action.CREATE, subject: Resource.QUOTE },
    { action: Action.READ, subject: Resource.SETTINGS },
    { action: Action.UPDATE, subject: Resource.SETTINGS },
  ],
};

/**
 * Mock admin (Super Admin) — used by BFF upstream while AUTH_MODE=mock.
 */
export const MOCK_ADMIN_SESSION_USER: SessionUser = {
  id: "admin_1",
  email: "admin@regaliaelectrical.ng",
  firstName: "Admin",
  lastName: "User",
  type: "admin",
  roles: [{ id: "role_super_admin", name: "Super Admin" }],
  permissions: [
    { action: Action.READ, resource: Resource.OVERVIEW },
    { action: Action.READ, resource: Resource.ORDER },
    { action: Action.LIST, resource: Resource.ORDER },
    { action: Action.MANAGE, resource: Resource.ORDER },
    { action: Action.READ, resource: Resource.PRODUCT },
    { action: Action.LIST, resource: Resource.PRODUCT },
    { action: Action.MANAGE, resource: Resource.PRODUCT },
    { action: Action.READ, resource: Resource.INVENTORY },
    { action: Action.LIST, resource: Resource.INVENTORY },
    { action: Action.MANAGE, resource: Resource.INVENTORY },
    { action: Action.READ, resource: Resource.USER },
    { action: Action.LIST, resource: Resource.USER },
    { action: Action.MANAGE, resource: Resource.USER },
    { action: Action.READ, resource: Resource.PROCUREMENT },
    { action: Action.LIST, resource: Resource.PROCUREMENT },
    { action: Action.MANAGE, resource: Resource.PROCUREMENT },
    { action: Action.READ, resource: Resource.SETTINGS },
    { action: Action.UPDATE, resource: Resource.SETTINGS },
  ],
  rules: [
    { action: Action.READ, subject: Resource.OVERVIEW },
    { action: Action.READ, subject: Resource.ORDER },
    { action: Action.LIST, subject: Resource.ORDER },
    { action: Action.MANAGE, subject: Resource.ORDER },
    { action: Action.READ, subject: Resource.PRODUCT },
    { action: Action.LIST, subject: Resource.PRODUCT },
    { action: Action.MANAGE, subject: Resource.PRODUCT },
    { action: Action.READ, subject: Resource.INVENTORY },
    { action: Action.LIST, subject: Resource.INVENTORY },
    { action: Action.MANAGE, subject: Resource.INVENTORY },
    { action: Action.READ, subject: Resource.USER },
    { action: Action.LIST, subject: Resource.USER },
    { action: Action.MANAGE, subject: Resource.USER },
    { action: Action.READ, subject: Resource.PROCUREMENT },
    { action: Action.LIST, subject: Resource.PROCUREMENT },
    { action: Action.MANAGE, subject: Resource.PROCUREMENT },
    { action: Action.READ, subject: Resource.SETTINGS },
    { action: Action.UPDATE, subject: Resource.SETTINGS },
  ],
};

/** @deprecated Use getCurrentUser() from @/lib/bff/auth in server code. */
export function getSessionUser(): SessionUser {
  return MOCK_SESSION_USER;
}

/** @deprecated Use getCurrentUser() from @/lib/bff/auth in server code. */
export function getAdminSessionUser(): SessionUser {
  return MOCK_ADMIN_SESSION_USER;
}
