"use client";

import { useContext } from "react";
import { PermissionContext } from "./permissions.context";
import type {
  ActionType,
  PermissionRequirement,
  ResourceType,
  UserType,
} from "./permissions.types";

/** Call permissions where needed — Education Hub style. */
export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }

  const { ability, roles, userType, user, isReady } = ctx;

  function can(action: ActionType, resource: ResourceType): boolean {
    return ability.can(action, resource);
  }

  function hasRole(roleName: string): boolean {
    return roles.some((r) => r.name === roleName);
  }

  function isUserType(type: UserType): boolean {
    return userType === type;
  }

  return { can, hasRole, isUserType, ability, user, isReady };
}

/** Evaluate a permission requirement (all supplied checks must pass). */
export function useMeetsRequirement(req?: PermissionRequirement): boolean {
  const { can, hasRole, isUserType, isReady } = usePermission();

  if (!req || !isReady) return true;

  if (req.userType !== undefined && !isUserType(req.userType)) return false;
  if (req.role !== undefined && !hasRole(req.role)) return false;
  if (req.roles !== undefined && !req.roles.some((r) => hasRole(r)))
    return false;
  if (
    req.action !== undefined &&
    req.resource !== undefined &&
    !can(req.action, req.resource)
  ) {
    return false;
  }

  return true;
}
