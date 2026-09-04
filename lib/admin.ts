import { Action, Resource } from "@/lib/permissions/permissions.types";
import type { ActionType, ResourceType } from "@/lib/permissions/permissions.types";
import type { NavIconName } from "@/components/layout/nav-icons";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: NavIconName;
  action: ActionType;
  resource: ResourceType;
  /** Lime notification dot (e.g. pending procurements). */
  dot?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin/overview",
    icon: "overview",
    action: Action.READ,
    resource: Resource.OVERVIEW,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/admin/orders",
    icon: "orders",
    action: Action.READ,
    resource: Resource.ORDER,
  },
  {
    id: "products",
    label: "Products",
    href: "/admin/products",
    icon: "products",
    action: Action.READ,
    resource: Resource.PRODUCT,
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/admin/inventory",
    icon: "inventory",
    action: Action.READ,
    resource: Resource.INVENTORY,
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    icon: "users",
    action: Action.READ,
    resource: Resource.USER,
  },
  {
    id: "procurement",
    label: "Procurement",
    href: "/admin/procurement",
    icon: "procurements",
    action: Action.READ,
    resource: Resource.PROCUREMENT,
    dot: true,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: "settings",
    action: Action.READ,
    resource: Resource.SETTINGS,
  },
];

export type AdminStat = {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: "orders" | "revenue" | "active" | "inactive";
};

export type AdminRecentOrder = {
  id: string;
  customer: string;
  amount: string;
  status: "Pending" | "Delivered" | "In Transit";
  date: string;
};

export type StockAlertLevel = "CRITICAL" | "LOW STOCK" | "OUT OF STOCK";

export type StockAlert = {
  id: string;
  name: string;
  level: StockAlertLevel;
  /** Shown above the status line. */
  qty: number;
  minStock: number;
  /** Fill width of the status line (0–100). */
  fillPercent: number;
};

export type OrderBreakdownItem = {
  id: string;
  label: string;
  count: number;
  percent: number;
  tone: "green" | "orange" | "blue" | "gray";
};

export const ADMIN_GREETING = {
  title: "Good Morning, Admin",
  date: "Monday, 13th April 2026",
} as const;

export const ADMIN_STATS: AdminStat[] = [
  {
    id: "orders",
    label: "Total Orders",
    value: "1,847",
    hint: "vs last month",
    icon: "orders",
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "₦28.3M",
    hint: "vs last month",
    icon: "revenue",
  },
  {
    id: "active",
    label: "Active Users",
    value: "634",
    hint: "vs last month",
    icon: "active",
  },
  {
    id: "inactive",
    label: "Inactive Users",
    value: "27",
    hint: "vs last month",
    icon: "inactive",
  },
];

export const ADMIN_RECENT_ORDERS: AdminRecentOrder[] = [
  {
    id: "ORD - 2026 - 321",
    customer: "Emeka Okafor",
    amount: "₦45,000",
    status: "Pending",
    date: "Apr 12, 2026",
  },
  {
    id: "ORD - 2026 - 317",
    customer: "Fatima Aliyu",
    amount: "₦245,000",
    status: "Delivered",
    date: "Apr 11, 2026",
  },
  {
    id: "ORD - 2026 - 311",
    customer: "Chukudi Nanao",
    amount: "₦1,000,000",
    status: "In Transit",
    date: "Apr 09, 2026",
  },
  {
    id: "ORD - 2026 - 300",
    customer: "Emeka Okafor",
    amount: "₦425,000",
    status: "Delivered",
    date: "Apr 07, 2026",
  },
];

export const STOCK_ALERTS: StockAlert[] = [
  {
    id: "sa1",
    name: "Arduino Uno R3",
    level: "CRITICAL",
    qty: 3,
    minStock: 20,
    fillPercent: 8,
  },
  {
    id: "sa2",
    name: "ESP32 DevKit V1",
    level: "LOW STOCK",
    qty: 10,
    minStock: 20,
    fillPercent: 28,
  },
  {
    id: "sa3",
    name: "L298N Motor Module",
    level: "OUT OF STOCK",
    qty: 0,
    minStock: 20,
    fillPercent: 0,
  },
];

export const ORDER_BREAKDOWN: OrderBreakdownItem[] = [
  { id: "delivered", label: "Delivered", count: 1250, percent: 83, tone: "green" },
  { id: "processing", label: "Processing", count: 80, percent: 5, tone: "blue" },
  { id: "shipped", label: "Shipped", count: 130, percent: 9, tone: "orange" },
  { id: "cancelled", label: "Cancelled", count: 40, percent: 3, tone: "gray" },
];

export type CatalogStatus =
  | "CRITICAL"
  | "OUT OF STOCK"
  | "IN STOCK"
  | "LOW STOCK";

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  priceLabel: string;
  stock: number;
  minStock: number;
  status: CatalogStatus;
  image: string;
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "cp1",
    name: "Arduino Uno R3",
    description: "ATmega328P, 5V, 16MHz, 14 Digital Pins",
    sku: "A00-UNO-R3",
    category: "Microcontrollers",
    priceLabel: "₦5,000",
    stock: 3,
    minStock: 20,
    status: "CRITICAL",
    image: "/images/auth-panel.png",
  },
  {
    id: "cp2",
    name: "ESP32 DevKit V1",
    description: "Wi-Fi + Bluetooth dual-core MCU",
    sku: "ESP-32-DK",
    category: "Microcontrollers",
    priceLabel: "₦4,500",
    stock: 0,
    minStock: 20,
    status: "OUT OF STOCK",
    image: "/images/auth-signin-panel.png",
  },
  {
    id: "cp3",
    name: "DHT22 Sensor",
    description: "Digital humidity & temperature sensor",
    sku: "AS-DHT-22",
    category: "Sensors",
    priceLabel: "₦4,800",
    stock: 23,
    minStock: 20,
    status: "IN STOCK",
    image: "/images/auth-panel.png",
  },
  {
    id: "cp4",
    name: "L298N Motor Module",
    description: "Dual H-bridge motor driver",
    sku: "L298N-DRV",
    category: "Motors",
    priceLabel: "₦3,200",
    stock: 10,
    minStock: 20,
    status: "LOW STOCK",
    image: "/images/auth-signin-panel.png",
  },
  {
    id: "cp5",
    name: "12V 5A Power Supply",
    description: "Switching PSU for embedded projects",
    sku: "AS-PSU-12",
    category: "Powers",
    priceLabel: "₦6,200",
    stock: 45,
    minStock: 15,
    status: "IN STOCK",
    image: "/images/auth-panel.png",
  },
  {
    id: "cp6",
    name: "Raspberry Pi 4 Model B",
    description: "4GB RAM, dual HDMI, Gigabit Ethernet",
    sku: "AS-RPI-4B",
    category: "Microcontrollers",
    priceLabel: "₦45,000",
    stock: 8,
    minStock: 12,
    status: "LOW STOCK",
    image: "/images/auth-signin-panel.png",
  },
  {
    id: "cp7",
    name: "NEMA 17 Stepper",
    description: "1.8° stepper motor, 1.5A",
    sku: "AS-MOT-17",
    category: "Motors",
    priceLabel: "₦7,500",
    stock: 0,
    minStock: 10,
    status: "OUT OF STOCK",
    image: "/images/auth-panel.png",
  },
  {
    id: "cp8",
    name: "OLED 128×64 Display",
    description: "I2C SSD1306 module",
    sku: "AS-OLED-96",
    category: "Sensors",
    priceLabel: "₦3,500",
    stock: 2,
    minStock: 25,
    status: "CRITICAL",
    image: "/images/auth-signin-panel.png",
  },
];

export const CATALOG_TOTAL_COUNT = 103;

export type AdminOrderStatus = "Delivered" | "In Transit" | "Pending";

export type AdminOrderPayment = "Bank Transfer" | "Card";

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  initials: string;
  items: number;
  amount: string;
  total: string;
  payment: AdminOrderPayment;
  status: AdminOrderStatus;
  date: string;
};

export type AdminOrderTimelineStep = {
  id: string;
  label: string;
  at: string;
  status: "done" | "current" | "upcoming";
};

export function buildAdminOrderTimeline(
  status: AdminOrderStatus,
): AdminOrderTimelineStep[] {
  const steps = [
    { id: "placed", label: "Order Placed", at: "2026-03-01 10:30 AM" },
    { id: "paid", label: "Payment Confirmed", at: "2026-03-01 10:30 AM" },
    { id: "packing", label: "Processing & Packing", at: "2026-03-01 10:30 AM" },
    { id: "transit", label: "In Transit", at: "2026-03-01 10:30 AM" },
    {
      id: "delivered",
      label: "Delivered",
      at: "Expected 2026-03-14 12:00 PM",
    },
  ] as const;

  if (status === "Delivered") {
    return steps.map((step) => ({
      ...step,
      at: step.id === "delivered" ? "2026-03-14 12:00 PM" : step.at,
      status: "done" as const,
    }));
  }

  if (status === "In Transit") {
    return steps.map((step, index) => ({
      ...step,
      status: index < 4 ? ("done" as const) : ("upcoming" as const),
    }));
  }

  return steps.map((step, index) => ({
    ...step,
    status:
      index === 0
        ? ("done" as const)
        : index === 1
          ? ("current" as const)
          : ("upcoming" as const),
  }));
}

export const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ORD - 2026 - 321",
    customer: "Emeka Okafor",
    email: "emeka.o@email.com",
    initials: "EO",
    items: 8,
    amount: "₦235,000",
    total: "₦235,000.00",
    payment: "Bank Transfer",
    status: "Delivered",
    date: "Apr 11, 2026",
  },
  {
    id: "ORD - 2026 - 320",
    customer: "Chinedu Okoro",
    email: "chinedu.o@email.com",
    initials: "CO",
    items: 24,
    amount: "₦890,000",
    total: "₦890,000.00",
    payment: "Card",
    status: "In Transit",
    date: "Apr 11, 2026",
  },
  {
    id: "ORD - 2026 - 319",
    customer: "Amaka Nwosu",
    email: "amaka.n@email.com",
    initials: "AN",
    items: 5,
    amount: "₦156,000",
    total: "₦156,000.00",
    payment: "Bank Transfer",
    status: "Pending",
    date: "Apr 10, 2026",
  },
  {
    id: "ORD - 2026 - 318",
    customer: "Ibrahim Musa",
    email: "ibrahim.m@email.com",
    initials: "IM",
    items: 12,
    amount: "₦445,000",
    total: "₦445,000.00",
    payment: "Card",
    status: "Delivered",
    date: "Apr 10, 2026",
  },
  {
    id: "ORD - 2026 - 317",
    customer: "Fatima Aliyu",
    email: "fatima.a@email.com",
    initials: "FA",
    items: 3,
    amount: "₦78,000",
    total: "₦78,000.00",
    payment: "Bank Transfer",
    status: "Pending",
    date: "Apr 09, 2026",
  },
  {
    id: "ORD - 2026 - 316",
    customer: "Tunde Bakare",
    email: "tunde.b@email.com",
    initials: "TB",
    items: 18,
    amount: "₦672,000",
    total: "₦672,000.00",
    payment: "Card",
    status: "In Transit",
    date: "Apr 09, 2026",
  },
  {
    id: "ORD - 2026 - 315",
    customer: "Ngozi Eze",
    email: "ngozi.e@email.com",
    initials: "NE",
    items: 7,
    amount: "₦298,000",
    total: "₦298,000.00",
    payment: "Bank Transfer",
    status: "Delivered",
    date: "Apr 08, 2026",
  },
  {
    id: "ORD - 2026 - 314",
    customer: "Yusuf Bello",
    email: "yusuf.b@email.com",
    initials: "YB",
    items: 15,
    amount: "₦521,000",
    total: "₦521,000.00",
    payment: "Card",
    status: "Pending",
    date: "Apr 08, 2026",
  },
  {
    id: "ORD - 2026 - 313",
    customer: "Adaeze Okonkwo",
    email: "adaeze.o@email.com",
    initials: "AO",
    items: 9,
    amount: "₦367,000",
    total: "₦367,000.00",
    payment: "Bank Transfer",
    status: "In Transit",
    date: "Apr 07, 2026",
  },
];

export const ADMIN_ORDERS_TOTAL_COUNT = 17;

export type AdminUserStatus = "ACTIVE" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  orders: number;
  totalSpent: string;
  joined: string;
  joinedIso: string;
  verified: boolean;
  status: AdminUserStatus;
};

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "Emeka Okafor",
    email: "emeka.o@email.com",
    initials: "EO",
    orders: 24,
    totalSpent: "₦620,000",
    joined: "Apr 16, 2026",
    joinedIso: "2026-01-02",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u2",
    name: "Chinedu Okoro",
    email: "chinedu.o@email.com",
    initials: "CO",
    orders: 4,
    totalSpent: "₦15,000",
    joined: "Apr 14, 2026",
    joinedIso: "2026-02-18",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u3",
    name: "Amaka Nwosu",
    email: "amaka.n@email.com",
    initials: "AN",
    orders: 3,
    totalSpent: "₦42,500",
    joined: "Apr 12, 2026",
    joinedIso: "2026-03-01",
    verified: false,
    status: "Suspended",
  },
  {
    id: "u4",
    name: "Ibrahim Musa",
    email: "ibrahim.m@email.com",
    initials: "IM",
    orders: 81,
    totalSpent: "₦1,240,000",
    joined: "Apr 10, 2026",
    joinedIso: "2025-11-12",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u5",
    name: "Fatima Aliyu",
    email: "fatima.a@email.com",
    initials: "FA",
    orders: 12,
    totalSpent: "₦186,000",
    joined: "Apr 08, 2026",
    joinedIso: "2026-01-20",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u6",
    name: "Tunde Bakare",
    email: "tunde.b@email.com",
    initials: "TB",
    orders: 7,
    totalSpent: "₦98,000",
    joined: "Apr 06, 2026",
    joinedIso: "2026-02-05",
    verified: false,
    status: "Suspended",
  },
  {
    id: "u7",
    name: "Ngozi Eze",
    email: "ngozi.e@email.com",
    initials: "NE",
    orders: 19,
    totalSpent: "₦345,000",
    joined: "Apr 04, 2026",
    joinedIso: "2025-12-08",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u8",
    name: "Yusuf Bello",
    email: "yusuf.b@email.com",
    initials: "YB",
    orders: 2,
    totalSpent: "₦28,000",
    joined: "Apr 02, 2026",
    joinedIso: "2026-03-15",
    verified: true,
    status: "ACTIVE",
  },
  {
    id: "u9",
    name: "Adaeze Okonkwo",
    email: "adaeze.o@email.com",
    initials: "AO",
    orders: 15,
    totalSpent: "₦412,000",
    joined: "Mar 30, 2026",
    joinedIso: "2025-10-22",
    verified: false,
    status: "Suspended",
  },
];

export const ADMIN_USERS_TOTAL_COUNT = 74;
