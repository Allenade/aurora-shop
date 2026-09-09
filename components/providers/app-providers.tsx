"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-store";
import { DashboardSessionProvider } from "@/lib/dashboard-session-store";
import { OrdersSessionProvider } from "@/lib/orders-session-store";
import { PermissionProvider } from "@/lib/permissions";
import type { SessionUser } from "@/lib/permissions/permissions.types";
import { ProcurementSessionProvider } from "@/lib/procurement-session-store";
import { ShopSessionProvider } from "@/lib/shop-session-store";

export function AppProviders({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return (
    <PermissionProvider user={user}>
      <CartProvider>
        <ShopSessionProvider>
          <OrdersSessionProvider>
            <DashboardSessionProvider>
              <ProcurementSessionProvider>
                {children}
              </ProcurementSessionProvider>
            </DashboardSessionProvider>
          </OrdersSessionProvider>
        </ShopSessionProvider>
      </CartProvider>
    </PermissionProvider>
  );
}
