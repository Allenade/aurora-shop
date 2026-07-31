"use client";

import {
  createContext,
  useMemo,
  type ReactNode,
} from "react";
import { buildAbility } from "./permissions.ability";
import type {
  AppAbility,
  AppRole,
  SessionUser,
  UserType,
} from "./permissions.types";

type PermissionContextValue = {
  ability: AppAbility;
  roles: AppRole[];
  userType: UserType | null;
  user: SessionUser | null;
  isReady: boolean;
};

export const PermissionContext = createContext<PermissionContextValue | null>(
  null,
);

type PermissionProviderProps = {
  children: ReactNode;
  /** Mock or real /auth/me user. Swap for API later. */
  user: SessionUser | null;
  isReady?: boolean;
};

export function PermissionProvider({
  children,
  user,
  isReady = true,
}: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(
    () => ({
      ability: buildAbility(user),
      roles: user?.roles ?? [],
      userType: user?.type ?? null,
      user,
      isReady,
    }),
    [user, isReady],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
