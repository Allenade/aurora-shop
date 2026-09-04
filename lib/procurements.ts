export type QuoteStatus =
  | "Approved"
  | "Pending"
  | "Under Review"
  | "Draft";

export type QuoteFormFields = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  components: string;
  quantity: string;
  budget: string;
  deliveryDate: string;
  specs: string;
};

export function createQuoteReferenceId() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `QTE-${year}-${suffix}`;
}

function formatQuoteDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatQuoteAmount(budget: string) {
  const trimmed = budget.trim();
  if (!trimmed) return "—";
  return trimmed.startsWith("₦") ? trimmed : `₦${trimmed}`;
}

function quoteTitleFromForm(form: QuoteFormFields) {
  const components = form.components.trim();
  if (components) return components;
  const company = form.companyName.trim();
  if (company) return company;
  return "Untitled draft";
}

export function createDraftQuote(
  form: QuoteFormFields,
  existing?: RecentQuote | null,
): RecentQuote {
  return {
    id: existing?.status === "Draft" ? existing.id : createQuoteReferenceId(),
    title: quoteTitleFromForm(form),
    status: "Draft",
    amount: formatQuoteAmount(form.budget),
    date: formatQuoteDate(),
    companyName: form.companyName,
    contactPerson: form.contactPerson,
    email: form.email,
    phone: form.phone,
    components: form.components,
    quantity: form.quantity,
    budget: form.budget,
    deliveryDate: form.deliveryDate,
    specs: form.specs,
  };
}

export type RecentQuote = {
  id: string;
  title: string;
  status: QuoteStatus;
  amount: string;
  date: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  components: string;
  quantity: string;
  budget: string;
  deliveryDate: string;
  specs: string;
};

export const RECENT_QUOTES: RecentQuote[] = [
  {
    id: "QTE-2026-1847",
    title: "Arduino & Sensor Bulk Kit",
    status: "Approved",
    amount: "₦45,000",
    date: "Feb 2, 2024",
    companyName: "Regalia Electrical",
    contactPerson: "Bayonuga Bello",
    email: "bayonuga@example.com",
    phone: "801 234 5678",
    components: "Arduino Uno R3, DHT22 Sensor, Breadboard Kit",
    quantity: "120 units",
    budget: "45,000",
    deliveryDate: "2024-03-15",
    specs: "Prefer original Arduino boards. Include jumper wires.",
  },
  {
    id: "QTE-2026-107",
    title: "Industrial Motor Controllers",
    status: "Pending",
    amount: "₦328,000",
    date: "Feb 3, 2024",
    companyName: "Regalia Electrical",
    contactPerson: "Bayonuga Bello",
    email: "bayonuga@example.com",
    phone: "801 234 5678",
    components: "L298N Motor Module, NEMA 17 Stepper, Motor Driver",
    quantity: "80 units",
    budget: "328,000",
    deliveryDate: "2024-04-01",
    specs: "Need datasheets and bulk discount pricing.",
  },
  {
    id: "QTE-2026-129",
    title: "Power Supply Pack (12V/5A)",
    status: "Under Review",
    amount: "₦74,000",
    date: "Feb 4, 2024",
    companyName: "Regalia Electrical",
    contactPerson: "Bayonuga Bello",
    email: "bayonuga@example.com",
    phone: "801 234 5678",
    components: "12V 5A Power Supply, Terminal Block, Fan 40mm",
    quantity: "40 units",
    budget: "74,000",
    deliveryDate: "2024-03-28",
    specs: "Certified PSU only. Include mounting hardware.",
  },
];
