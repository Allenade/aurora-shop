export type TrackStatus =
  | "In Transit"
  | "Delivered"
  | "Processing"
  | "Cancelled"
  | "Out for Delivery";

export type TrackTimelineStepStatus = "done" | "current" | "upcoming";

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
