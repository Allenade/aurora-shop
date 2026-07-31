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
