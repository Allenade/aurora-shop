import { Action, Resource } from "@/lib/permissions/permissions.types";
import type { ActionType, ResourceType } from "@/lib/permissions/permissions.types";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: "dashboard" | "shop" | "orders" | "track" | "procurements" | "settings";
  action: ActionType;
  resource: ResourceType;
};

export const APP_NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    action: Action.READ,
    resource: Resource.DASHBOARD,
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    icon: "shop",
    action: Action.READ,
    resource: Resource.SHOP,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/orders",
    icon: "orders",
    action: Action.READ,
    resource: Resource.ORDER,
  },
  {
    id: "track-orders",
    label: "Track Orders",
    href: "/track-orders",
    icon: "track",
    action: Action.READ,
    resource: Resource.TRACK_ORDER,
  },
  {
    id: "procurements",
    label: "Procurements",
    href: "/procurements",
    icon: "procurements",
    action: Action.READ,
    resource: Resource.PROCUREMENT,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "settings",
    action: Action.READ,
    resource: Resource.SETTINGS,
  },
];

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  trend?: string;
  icon: "bag" | "clock" | "spend";
};

export type RecentOrder = {
  id: string;
  date: string;
  items: number;
  total: string;
  status: "In Transit" | "Delivered" | "Pending" | "Cancelled";
};

export type BuyerDashboardResponse = {
  stats: DashboardStat[];
  recentOrders: RecentOrder[];
};
