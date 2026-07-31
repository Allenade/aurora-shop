"use client";

import type { ReactNode } from "react";
import { usePermission } from "./permissions.hooks";
import type { ActionType, ResourceType, UserType } from "./permissions.types";

type CanProps = {
  children: ReactNode;
  fallback?: ReactNode;
  action?: ActionType;
  resource?: ResourceType;
  role?: string;
  userType?: UserType;
  condition?: boolean;
};

/** Declarative UI gate — wrap nav items, buttons, sections. */
export function Can({
  children,
  fallback = null,
  action,
  resource,
  role,
  userType,
  condition,
}: CanProps) {
  const { can, hasRole, isUserType } = usePermission();

  const userTypeOk = userType === undefined || isUserType(userType);
  const roleOk = role === undefined || hasRole(role);
  const conditionOk = condition === undefined || condition;

  let permissionOk = true;
  if (action !== undefined && resource !== undefined) {
    permissionOk = can(action, resource);
  }

  const allowed = userTypeOk && roleOk && permissionOk && conditionOk;
  return allowed ? <>{children}</> : <>{fallback}</>;
}
