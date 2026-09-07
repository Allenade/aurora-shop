import type {
  AdminOrder,
  AdminOrderStatus,
  AdminProcurementRequest,
  AdminProcurementStatus,
  AdminUser,
  CatalogProduct,
  CatalogStatus,
  InventoryItem,
} from "@/lib/admin";
import { resolveInventoryStatus } from "@/lib/admin";
import type { OrderRecord } from "@/lib/orders";
import type { RecentQuote } from "@/lib/procurements";
import type { ShopProduct } from "@/lib/shop";

export function catalogStatusFromStock(
  stock: number,
  minStock: number,
): CatalogStatus {
  if (stock <= 0) return "OUT OF STOCK";
  if (stock <= Math.max(1, Math.floor(minStock / 2))) return "CRITICAL";
  if (stock <= minStock) return "LOW STOCK";
  return "IN STOCK";
}

export function toCatalogProduct(
  product: ShopProduct & { sku?: string; minStock?: number },
): CatalogProduct {
  const minStock = product.minStock ?? 5;
  return {
    id: product.id,
    name: product.name,
    description: product.subtitle,
    sku: product.sku ?? product.slug,
    category: product.category,
    priceLabel: product.priceLabel,
    stock: product.stockCount,
    minStock,
    status: catalogStatusFromStock(product.stockCount, minStock),
    image: product.image,
    specs: product.specs?.map((spec) => `${spec.label}: ${spec.value}`).join("; "),
  };
}

export function toInventoryItem(row: {
  id: string;
  name: string;
  subtitle?: string;
  sku?: string;
  category: string;
  image: string;
  quantity?: number;
  stockCount?: number;
  minStock?: number;
  lastRestocked?: string;
}): InventoryItem {
  const stock = row.quantity ?? row.stockCount ?? 0;
  const min = row.minStock ?? 5;
  const capacity = Math.max(min * 4, stock, 20);
  return {
    id: row.id,
    name: row.name,
    description: row.subtitle ?? "",
    sku: row.sku ?? "",
    category: row.category,
    image: row.image,
    stock,
    capacity,
    lastRestocked: row.lastRestocked ?? "—",
    status: resolveInventoryStatus(stock, capacity),
  };
}

export function toAdminOrder(
  order: OrderRecord & { shippingEmail?: string; internalId?: string },
): AdminOrder {
  const initials = order.shippingName
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const status: AdminOrderStatus =
    order.status === "In Transit"
      ? "In Transit"
      : order.status === "Delivered"
        ? "Delivered"
        : "Pending";
  return {
    id: order.id,
    internalId: order.internalId,
    customer: order.shippingName,
    email: order.shippingEmail ?? "",
    initials: initials || "CU",
    items: order.itemCount,
    amount: order.total,
    total: order.total,
    payment: order.paymentMethod === "Card" ? "Card" : "Bank Transfer",
    status,
    date: order.date,
  };
}

export function toAdminProcurement(
  quote: RecentQuote & { internalId?: string; phone?: string; specs?: string },
): AdminProcurementRequest {
  const status: AdminProcurementStatus =
    quote.status === "Approved"
      ? "Approved"
      : quote.status === "Under Review"
        ? "Under Review"
        : quote.status === "Rejected"
          ? "Rejected"
          : "Pending";
  return {
    id: quote.id,
    internalId: quote.internalId,
    contact: quote.contactPerson,
    email: quote.email,
    items: quote.components,
    amount: quote.amount,
    status,
    date: quote.date,
    submitted: `Submitted ${quote.date}`,
    institution: quote.companyName,
    department: "",
    contactName: quote.contactPerson,
    contactEmail: quote.email,
    contactPhone: quote.phone,
    requestedItems: quote.components,
    purpose: quote.specs || quote.title,
  };
}

export function toAdminUser(row: {
  id: string;
  name: string;
  email: string;
  initials?: string;
  orders?: number;
  totalSpent?: string;
  joined?: string;
  joinedIso?: string;
  verified?: boolean;
  status: AdminUser["status"];
}): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials:
      row.initials ??
      row.name
        .split(" ")
        .map((part) => part[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    orders: row.orders ?? 0,
    totalSpent: row.totalSpent ?? "—",
    joined: row.joined ?? "",
    joinedIso: row.joinedIso ?? "",
    verified: row.verified ?? false,
    status: row.status,
  };
}

export function fulfillmentStatus(status: AdminOrderStatus) {
  if (status === "In Transit") return "in_transit";
  if (status === "Delivered") return "delivered";
  return "pending";
}

export function quoteApiStatus(status: AdminProcurementStatus) {
  if (status === "Approved") return "approved";
  if (status === "Under Review") return "under_review";
  if (status === "Rejected") return "rejected";
  return "pending";
}
