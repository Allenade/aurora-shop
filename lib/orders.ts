export type OrderStatus =
  | "Delivered"
  | "Pending"
  | "In Transit"
  | "Cancelled";

export type TimelineStepStatus = "done" | "current" | "upcoming";

export type OrderTimelineStep = {
  id: string;
  label: string;
  at: string;
  status: TimelineStepStatus;
};

export type OrderLineItem = {
  id: string;
  name: string;
  description?: string;
  sku: string;
  qty: number;
  unitPrice: number;
  unitPriceLabel: string;
  totalLabel: string;
  image: string;
};

export type OrderRecord = {
  id: string;
  status: OrderStatus;
  date: string;
  placedAt: string;
  itemCount: number;
  reference: string;
  products: string[];
  total: string;
  totalAmount: number;
  subtotal: number;
  subtotalLabel: string;
  shipping: number;
  shippingLabel: string;
  tax: number;
  taxLabel: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  trackingNumber: string;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  timeline: OrderTimelineStep[];
  items: OrderLineItem[];
};

function money(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const ORDERS: OrderRecord[] = [
  {
    id: "ORD-2026-1847",
    status: "In Transit",
    date: "Mar 3, 2026",
    placedAt: "Mar 3, 2026 15:57PM",
    itemCount: 6,
    reference: "TRK-897420",
    products: [
      "Arduino Uno R3",
      "DHT22 Sensor",
      "Breadboard Kit",
      "Jumper Wires",
      "USB Cable",
      "Resistor Pack",
    ],
    total: money(46000),
    totalAmount: 46000,
    subtotal: 36000,
    subtotalLabel: "₦36,000.00",
    shipping: 5000,
    shippingLabel: "₦5,000.00",
    tax: 5000,
    taxLabel: "₦5,000.00",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    trackingNumber: "TRK-897420",
    shippingName: "Benjamin Jacobs",
    shippingAddress: "50 Adekunle Banjo Street, Magodo Phase II, Lagos, Nigeria",
    shippingPhone: "+234 803 444 7553",
    timeline: [
      { id: "placed", label: "Order Placed", at: "2024-03-01 10:30 AM", status: "done" },
      { id: "paid", label: "Payment Confirmed", at: "2024-03-01 12:30 AM", status: "done" },
      { id: "packing", label: "Processing & Packing", at: "2024-03-01 02:30 AM", status: "done" },
      { id: "transit", label: "In Transit", at: "2024-03-02 10:30 AM", status: "done" },
      {
        id: "delivered",
        label: "Delivered",
        at: "Expected Mar 2024-03-05 12:00 PM",
        status: "upcoming",
      },
    ],
    items: [
      {
        id: "li1",
        name: "Arduino Uno R3",
        description: "ATmega328P, 5V, 16MHz, 14 Digital Pins",
        sku: "A00-UNO-R3",
        qty: 5,
        unitPrice: 4500,
        unitPriceLabel: "₦4500",
        totalLabel: "₦22500",
        image: "/images/auth-panel.png",
      },
      {
        id: "li2",
        name: "DHT22 Sensor",
        description: "Digital humidity & temperature sensor",
        sku: "AS-DHT-22",
        qty: 2,
        unitPrice: 4800,
        unitPriceLabel: "₦4800",
        totalLabel: "₦9600",
        image: "/images/auth-signin-panel.png",
      },
      {
        id: "li3",
        name: "Breadboard Kit",
        description: "830-point solderless breadboard",
        sku: "AS-BB-01",
        qty: 1,
        unitPrice: 3500,
        unitPriceLabel: "₦3500",
        totalLabel: "₦3500",
        image: "/images/auth-panel.png",
      },
      {
        id: "li4",
        name: "Jumper Wires",
        description: "40-piece male-to-male pack",
        sku: "AS-JW-40",
        qty: 2,
        unitPrice: 1200,
        unitPriceLabel: "₦1200",
        totalLabel: "₦2400",
        image: "/images/auth-signin-panel.png",
      },
      {
        id: "li5",
        name: "USB Cable",
        description: "USB-A to USB-B, 1m",
        sku: "AS-USB-A",
        qty: 1,
        unitPrice: 1500,
        unitPriceLabel: "₦1500",
        totalLabel: "₦1500",
        image: "/images/auth-panel.png",
      },
      {
        id: "li6",
        name: "Resistor Pack",
        description: "100-piece assorted resistors",
        sku: "AS-RES-100",
        qty: 1,
        unitPrice: 2500,
        unitPriceLabel: "₦2500",
        totalLabel: "₦2500",
        image: "/images/auth-signin-panel.png",
      },
    ],
  },
  {
    id: "ORD-2026-1832",
    status: "Pending",
    date: "Feb 8, 2026",
    placedAt: "Feb 8, 2026 10:22AM",
    itemCount: 4,
    reference: "TR-548102",
    products: [
      "Raspberry Pi 4 Model B",
      "MicroSD 64GB",
      "Pi Case",
      "Official PSU",
    ],
    total: money(62400),
    totalAmount: 62400,
    subtotal: 58000,
    subtotalLabel: money(58000),
    shipping: 2000,
    shippingLabel: money(2000),
    tax: 2400,
    taxLabel: money(2400),
    paymentMethod: "Bank Transfer",
    paymentStatus: "Unpaid",
    trackingNumber: "TR-548102",
    shippingName: "Bayonuga Bello",
    shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    shippingPhone: "+234 801 234 5678",
    timeline: [
      { id: "placed", label: "Order Placed", at: "Feb 8, 2026 · 10:22", status: "done" },
      { id: "paid", label: "Payment Confirmed", at: "Awaiting payment", status: "current" },
      { id: "packing", label: "Processing & Packing", at: "—", status: "upcoming" },
      { id: "transit", label: "In Transit", at: "—", status: "upcoming" },
      { id: "delivered", label: "Delivered", at: "—", status: "upcoming" },
    ],
    items: [
      {
        id: "li1",
        name: "Raspberry Pi 4 Model B",
        sku: "AS-RPI-4B",
        qty: 1,
        unitPrice: 45000,
        unitPriceLabel: money(45000),
        totalLabel: money(45000),
        image: "/images/auth-signin-panel.png",
      },
      {
        id: "li2",
        name: "MicroSD 64GB",
        sku: "AS-SD-64",
        qty: 1,
        unitPrice: 8500,
        unitPriceLabel: money(8500),
        totalLabel: money(8500),
        image: "/images/auth-panel.png",
      },
      {
        id: "li3",
        name: "Pi Case",
        sku: "AS-CASE-PI",
        qty: 1,
        unitPrice: 3200,
        unitPriceLabel: money(3200),
        totalLabel: money(3200),
        image: "/images/auth-panel.png",
      },
      {
        id: "li4",
        name: "Official PSU",
        sku: "AS-PSU-PI",
        qty: 1,
        unitPrice: 5700,
        unitPriceLabel: money(5700),
        totalLabel: money(5700),
        image: "/images/auth-signin-panel.png",
      },
    ],
  },
  {
    id: "ORD-2026-1810",
    status: "In Transit",
    date: "Feb 1, 2026",
    placedAt: "Feb 1, 2026 14:05PM",
    itemCount: 7,
    reference: "TR-546901",
    products: [
      "12V 5A Power Supply",
      "NEMA 17 Stepper",
      "Motor Driver",
      "Heat Sink",
      "Dupont Cables",
      "Terminal Block",
      "Fan 40mm",
    ],
    total: money(28750.5),
    totalAmount: 28750.5,
    subtotal: 26000,
    subtotalLabel: money(26000),
    shipping: 1200,
    shippingLabel: money(1200),
    tax: 1550.5,
    taxLabel: money(1550.5),
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    trackingNumber: "TR-546901",
    shippingName: "Bayonuga Bello",
    shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    shippingPhone: "+234 801 234 5678",
    timeline: [
      { id: "placed", label: "Order Placed", at: "Feb 1, 2026 · 14:05", status: "done" },
      { id: "paid", label: "Payment Confirmed", at: "Feb 1, 2026 · 14:40", status: "done" },
      { id: "packing", label: "Processing & Packing", at: "Feb 2, 2026 · 08:15", status: "done" },
      { id: "transit", label: "In Transit", at: "Feb 3, 2026 · 10:00", status: "current" },
      { id: "delivered", label: "Delivered", at: "Estimated Feb 5, 2026", status: "upcoming" },
    ],
    items: [
      {
        id: "li1",
        name: "12V 5A Power Supply",
        sku: "AS-PSU-12",
        qty: 1,
        unitPrice: 6200,
        unitPriceLabel: money(6200),
        totalLabel: money(6200),
        image: "/images/auth-panel.png",
      },
      {
        id: "li2",
        name: "NEMA 17 Stepper",
        sku: "AS-MOT-17",
        qty: 2,
        unitPrice: 7500,
        unitPriceLabel: money(7500),
        totalLabel: money(15000),
        image: "/images/auth-signin-panel.png",
      },
      {
        id: "li3",
        name: "Motor Driver",
        sku: "AS-DRV-A4988",
        qty: 2,
        unitPrice: 2800,
        unitPriceLabel: money(2800),
        totalLabel: money(5600),
        image: "/images/auth-panel.png",
      },
    ],
  },
  {
    id: "ORD-2026-1794",
    status: "Cancelled",
    date: "Jan 22, 2026",
    placedAt: "Jan 22, 2026 09:18AM",
    itemCount: 2,
    reference: "TR-545110",
    products: ["OLED 128×64 Display", "I2C Level Shifter"],
    total: money(9200),
    totalAmount: 9200,
    subtotal: 8500,
    subtotalLabel: money(8500),
    shipping: 0,
    shippingLabel: money(0),
    tax: 700,
    taxLabel: money(700),
    paymentMethod: "Bank Transfer",
    paymentStatus: "Refunded",
    trackingNumber: "TR-545110",
    shippingName: "Bayonuga Bello",
    shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    shippingPhone: "+234 801 234 5678",
    timeline: [
      { id: "placed", label: "Order Placed", at: "Jan 22, 2026 · 09:18", status: "done" },
      { id: "paid", label: "Payment Confirmed", at: "Cancelled", status: "upcoming" },
      { id: "packing", label: "Processing & Packing", at: "—", status: "upcoming" },
      { id: "transit", label: "In Transit", at: "—", status: "upcoming" },
      { id: "delivered", label: "Delivered", at: "—", status: "upcoming" },
    ],
    items: [
      {
        id: "li1",
        name: "OLED 128×64 Display",
        sku: "AS-OLED-96",
        qty: 1,
        unitPrice: 3500,
        unitPriceLabel: money(3500),
        totalLabel: money(3500),
        image: "/images/auth-panel.png",
      },
      {
        id: "li2",
        name: "I2C Level Shifter",
        sku: "AS-I2C-LS",
        qty: 1,
        unitPrice: 5700,
        unitPriceLabel: money(5700),
        totalLabel: money(5700),
        image: "/images/auth-signin-panel.png",
      },
    ],
  },
  {
    id: "ORD-2026-1788",
    status: "Delivered",
    date: "Jan 18, 2026",
    placedAt: "Jan 18, 2026 12:40PM",
    itemCount: 3,
    reference: "TR-544880",
    products: ["Arduino Nano", "DHT22 Temp & Humidity", "Prototype Board"],
    total: money(16800),
    totalAmount: 16800,
    subtotal: 15000,
    subtotalLabel: money(15000),
    shipping: 1000,
    shippingLabel: money(1000),
    tax: 800,
    taxLabel: money(800),
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    trackingNumber: "TR-544880",
    shippingName: "Bayonuga Bello",
    shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    shippingPhone: "+234 801 234 5678",
    timeline: [
      { id: "placed", label: "Order Placed", at: "Jan 18, 2026 · 12:40", status: "done" },
      { id: "paid", label: "Payment Confirmed", at: "Jan 18, 2026 · 13:05", status: "done" },
      { id: "packing", label: "Processing & Packing", at: "Jan 19, 2026 · 09:00", status: "done" },
      { id: "transit", label: "In Transit", at: "Jan 19, 2026 · 16:20", status: "done" },
      { id: "delivered", label: "Delivered", at: "Jan 21, 2026 · 11:45", status: "done" },
    ],
    items: [
      {
        id: "li1",
        name: "Arduino Nano",
        sku: "AS-NANO",
        qty: 1,
        unitPrice: 7200,
        unitPriceLabel: money(7200),
        totalLabel: money(7200),
        image: "/images/auth-signin-panel.png",
      },
      {
        id: "li2",
        name: "DHT22 Temp & Humidity",
        sku: "AS-DHT-22",
        qty: 1,
        unitPrice: 4800,
        unitPriceLabel: money(4800),
        totalLabel: money(4800),
        image: "/images/auth-panel.png",
      },
      {
        id: "li3",
        name: "Prototype Board",
        sku: "AS-PCB-01",
        qty: 1,
        unitPrice: 4800,
        unitPriceLabel: money(4800),
        totalLabel: money(4800),
        image: "/images/auth-panel.png",
      },
    ],
  },
];

export type OrderFilter = "all" | "completed" | "pending" | "cancelled";

export function getOrderById(id: string) {
  return ORDERS.find((o) => o.id === id) ?? null;
}

export function getOrderCounts(orders: OrderRecord[]) {
  return {
    all: orders.length,
    completed: orders.filter((o) => o.status === "Delivered").length,
    pending: orders.filter(
      (o) => o.status === "Pending" || o.status === "In Transit",
    ).length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };
}

export function filterOrders(orders: OrderRecord[], filter: OrderFilter) {
  if (filter === "all") return orders;
  if (filter === "completed")
    return orders.filter((o) => o.status === "Delivered");
  if (filter === "pending")
    return orders.filter(
      (o) => o.status === "Pending" || o.status === "In Transit",
    );
  return orders.filter((o) => o.status === "Cancelled");
}

export function formatProductSummary(products: string[], visible = 2) {
  if (products.length <= visible) return products.join(", ");
  const shown = products.slice(0, visible).join(", ");
  return `${shown}... +${products.length - visible} more`;
}
