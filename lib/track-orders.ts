export type TrackStatus = "In Transit" | "Delivered" | "Processing" | "Out for Delivery";

export type TrackTimelineStepStatus = "done" | "upcoming";

export type TrackTimelineStep = {
  id: string;
  label: string;
  description: string;
  at: string;
  status: TrackTimelineStepStatus;
};

export type TrackOrderItem = {
  id: string;
  name: string;
  quantity: number;
  priceLabel: string;
  image: string;
};

export type TrackedShipment = {
  orderId: string;
  trackingNumber: string;
  status: TrackStatus;
  estimatedDelivery: string;
  shippingMethod: string;
  destination: string;
  timeline: TrackTimelineStep[];
  items: TrackOrderItem[];
};

export const TRACKED_SHIPMENTS: TrackedShipment[] = [
  {
    orderId: "ORD-2026-1847",
    trackingNumber: "TRK-897420",
    status: "In Transit",
    estimatedDelivery: "Mar 16, 2026",
    shippingMethod: "Express Delivery",
    destination: "Lagos, Nigeria",
    timeline: [
      {
        id: "placed",
        label: "Order Placed",
        description: "Your order has been received and confirmed",
        at: "2026-03-01 10:30 AM",
        status: "done",
      },
      {
        id: "processing",
        label: "Processing",
        description: "Items are being prepared for shipment",
        at: "2026-03-01 11:00 AM",
        status: "done",
      },
      {
        id: "shipped",
        label: "Shipped",
        description: "Package handed over to courier service",
        at: "2026-03-02 09:00 AM",
        status: "done",
      },
      {
        id: "out",
        label: "Out for Delivery",
        description: "Package will be delivered today",
        at: "Expected - 2026-03-05",
        status: "upcoming",
      },
      {
        id: "delivered",
        label: "Delivered",
        description: "Package delivered to recipient",
        at: "",
        status: "upcoming",
      },
    ],
    items: [
      {
        id: "item-1",
        name: "Raspberry Pi 4 Model B",
        quantity: 2,
        priceLabel: "₦90,000.00",
        image: "/images/auth-panel.png",
      },
      {
        id: "item-2",
        name: "ESP32 DevKit",
        quantity: 5,
        priceLabel: "₦15,000.00",
        image: "/images/auth-panel.png",
      },
    ],
  },
  {
    orderId: "ORD-2026-1810",
    trackingNumber: "TRK-917323",
    status: "In Transit",
    estimatedDelivery: "Mar 12, 2026",
    shippingMethod: "Standard Delivery",
    destination: "Abuja, Nigeria",
    timeline: [
      {
        id: "placed",
        label: "Order Placed",
        description: "Your order has been received and confirmed",
        at: "2026-03-01 09:15 AM",
        status: "done",
      },
      {
        id: "processing",
        label: "Processing",
        description: "Items are being prepared for shipment",
        at: "2026-03-01 02:40 PM",
        status: "done",
      },
      {
        id: "shipped",
        label: "Shipped",
        description: "Package handed over to courier service",
        at: "2026-03-02 08:20 AM",
        status: "done",
      },
      {
        id: "out",
        label: "Out for Delivery",
        description: "Package will be delivered today",
        at: "Expected - 2026-03-10",
        status: "upcoming",
      },
      {
        id: "delivered",
        label: "Delivered",
        description: "Package delivered to recipient",
        at: "",
        status: "upcoming",
      },
    ],
    items: [
      {
        id: "item-1",
        name: "Arduino Uno R3",
        quantity: 3,
        priceLabel: "₦13,500.00",
        image: "/images/auth-panel.png",
      },
    ],
  },
];

export function findShipmentByTracking(
  query: string,
): TrackedShipment | null {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return null;

  const fromCatalog =
    TRACKED_SHIPMENTS.find(
      (s) =>
        s.trackingNumber.toUpperCase() === normalized ||
        s.orderId.toUpperCase() === normalized,
    ) ?? null;

  if (fromCatalog) return fromCatalog;

  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("aurora-shop-receipts");
    if (!raw) return null;
    const receipts = JSON.parse(raw) as Array<{
      orderId: string;
      trackingNumber: string;
      deliveryLabel: string;
      address: string;
      items: Array<{
        name: string;
        qty: number;
        priceLabel: string;
        image: string;
      }>;
    }>;

    const receipt = receipts.find(
      (r) =>
        r.trackingNumber.toUpperCase() === normalized ||
        r.orderId.toUpperCase() === normalized,
    );
    if (!receipt) return null;

    return {
      orderId: receipt.orderId,
      trackingNumber: receipt.trackingNumber,
      status: "Processing",
      estimatedDelivery: "Updating soon",
      shippingMethod: receipt.deliveryLabel.split(" — ")[0] ?? "Standard Delivery",
      destination: receipt.address,
      timeline: [
        {
          id: "placed",
          label: "Order Placed",
          description: "Your order has been received and confirmed",
          at: new Date().toLocaleString("en-US"),
          status: "done",
        },
        {
          id: "processing",
          label: "Processing",
          description: "Items are being prepared for shipment",
          at: "In progress",
          status: "upcoming",
        },
        {
          id: "shipped",
          label: "Shipped",
          description: "Package handed over to courier service",
          at: "",
          status: "upcoming",
        },
        {
          id: "out",
          label: "Out for Delivery",
          description: "Package will be delivered today",
          at: "",
          status: "upcoming",
        },
        {
          id: "delivered",
          label: "Delivered",
          description: "Package delivered to recipient",
          at: "",
          status: "upcoming",
        },
      ],
      items: receipt.items.map((item, index) => ({
        id: `receipt-item-${index}`,
        name: item.name,
        quantity: item.qty,
        priceLabel: item.priceLabel,
        image: item.image,
      })),
    };
  } catch {
    return null;
  }
}
