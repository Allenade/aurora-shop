export type DeliveryMethodId = "standard" | "express";

export type DeliveryMethod = {
  id: DeliveryMethodId;
  label: string;
  description: string;
  price: number;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "3-5 Business days",
    price: 2500,
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "2 Business Days max",
    price: 5500,
  },
];

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const VAT_RATE = 0.075;

export function formatCartMoney(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createOrderId() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100 + Math.random() * 900);
  return `ORD-${year}-${suffix}`;
}

export type DeliveryFormState = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  streetAddress: string;
  state: string;
  note: string;
};

export const INITIAL_DELIVERY_FORM: DeliveryFormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  streetAddress: "",
  state: "",
  note: "",
};

export type PaymentMethodId = "bank" | "card";

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
}[] = [
  { id: "bank", label: "Bank Transfer" },
  { id: "card", label: "Debit/Credit Card" },
];

export const BANK_TRANSFER_DETAILS = {
  bank: "Guaranty Trust Bank (GTB)",
  accountName: "Aurora Stores Ltd",
  accountNumber: "0123456789",
} as const;

export function createTransferReference() {
  const digits = Math.floor(100000000 + Math.random() * 900000000);
  return `RE - ${digits}`;
}

export function formatCartMoneyCompact(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

export function getCartTotals(
  lines: { price: number; qty: number }[],
  deliveryPrice: number,
) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + deliveryPrice + vat;
  return { subtotal, vat, total };
}
