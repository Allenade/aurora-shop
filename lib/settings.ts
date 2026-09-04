export type SettingsTab = "profile" | "security" | "notifications" | "billings";

export type SettingsTabItem = { id: SettingsTab; label: string };

export const SETTINGS_TABS: SettingsTabItem[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "billings", label: "Billing" },
];

export const ADMIN_SETTINGS_TABS: SettingsTabItem[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
];

export function isSettingsTab(
  value: string | null | undefined,
  tabs: SettingsTabItem[] = SETTINGS_TABS,
): value is SettingsTab {
  return tabs.some((tab) => tab.id === value);
}

export function parseSettingsTab(
  value: string | null | undefined,
  tabs: SettingsTabItem[] = SETTINGS_TABS,
): SettingsTab {
  return isSettingsTab(value, tabs) ? value : "profile";
}

export type ProfileSettings = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  initials: string;
};

export const DEFAULT_PROFILE: ProfileSettings = {
  fullName: "Bashirat Bayonuga",
  email: "BBayonuga.b@tech-itsolutions.com",
  phone: "+234 809 876 5432",
  companyName: "Tech IT Solutions Ltd",
  address: "123 Victoria Island, Lagos, Nigeria",
  initials: "BB",
};

export type NotificationPreferenceId =
  | "orderUpdates"
  | "promotionalEmails"
  | "priceAlerts"
  | "stockAlerts"
  | "newsletter";

export type NotificationPreference = {
  id: NotificationPreferenceId;
  title: string;
  description: string;
  enabled: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  {
    id: "orderUpdates",
    title: "Order Updates",
    description: "Get notified about order status changes and delivery updates.",
    enabled: true,
  },
  {
    id: "promotionalEmails",
    title: "Promotional Emails",
    description: "Receive special offers, deals, and product promotions.",
    enabled: true,
  },
  {
    id: "priceAlerts",
    title: "Price Alerts",
    description: "Alerts when prices drop on items you are watching.",
    enabled: true,
  },
  {
    id: "stockAlerts",
    title: "Stock Alerts",
    description: "Notify you when out-of-stock items become available.",
    enabled: false,
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Weekly product picks and industry updates.",
    enabled: false,
  },
];

export type PaymentMethod = {
  id: string;
  last4: string;
  expires: string;
};

export type BillingInvoice = {
  id: string;
  date: string;
  amount: string;
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_1",
    last4: "4521",
    expires: "12/26",
  },
];

export const BILLING_HISTORY: BillingInvoice[] = [
  {
    id: "INV-2026-167",
    date: "2024-05-15",
    amount: "₦329,000",
  },
  {
    id: "INV-2026-142",
    date: "2024-04-12",
    amount: "₦185,500",
  },
  {
    id: "INV-2026-118",
    date: "2024-03-08",
    amount: "₦92,000",
  },
];
