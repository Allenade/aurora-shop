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
  status: "In Transit" | "Delivered" | "Pending";
};

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "total",
    label: "Total Purchases",
    value: "123",
    trend: "+12% from last month",
    icon: "bag",
  },
  {
    id: "pending",
    label: "Pending Purchases",
    value: "13",
    icon: "clock",
  },
  {
    id: "spent",
    label: "Total Spent",
    value: "#457,985",
    icon: "spend",
  },
];

export const RECENT_ORDERS: RecentOrder[] = [
  {
    id: "ORD - 2026 - 321",
    date: "Mar 12, 2026",
    items: 4,
    total: "#128,400",
    status: "In Transit",
  },
  {
    id: "ORD - 2026 - 318",
    date: "Mar 08, 2026",
    items: 2,
    total: "#64,200",
    status: "Delivered",
  },
  {
    id: "ORD - 2026 - 310",
    date: "Mar 02, 2026",
    items: 7,
    total: "#210,150",
    status: "Pending",
  },
  {
    id: "ORD - 2026 - 301",
    date: "Feb 24, 2026",
    items: 1,
    total: "#18,900",
    status: "Delivered",
  },
];
