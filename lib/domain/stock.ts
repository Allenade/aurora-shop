import type { CatalogStatus } from "@/lib/admin";

/**
 * Stock status bands — must stay aligned with Nest inventory/catalog rules.
 * Frontend only maps labels; quantity + minStock are the source of truth.
 */
export type StockStatusCode =
  | "out_of_stock"
  | "critical"
  | "low_stock"
  | "in_stock";

export function stockStatusCode(
  quantity: number,
  minStock: number,
): StockStatusCode {
  const min = Math.max(0, minStock);
  const criticalMax = Math.max(1, Math.floor(min / 2));
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= criticalMax) return "critical";
  if (quantity <= min) return "low_stock";
  return "in_stock";
}

export function catalogStatusLabel(
  quantity: number,
  minStock: number,
): CatalogStatus {
  const code = stockStatusCode(quantity, minStock);
  if (code === "out_of_stock") return "OUT OF STOCK";
  if (code === "critical") return "CRITICAL";
  if (code === "low_stock") return "LOW STOCK";
  return "IN STOCK";
}

/** Pick a quantity that lands in the requested admin status band. */
export function quantityForCatalogStatus(
  status: CatalogStatus,
  minStock: number,
): number {
  const min = Math.max(0, minStock);
  const criticalMax = Math.max(1, Math.floor(min / 2));
  if (status === "OUT OF STOCK") return 0;
  if (status === "CRITICAL") return Math.min(criticalMax, Math.max(1, min || 1));
  if (status === "LOW STOCK") {
    if (min <= 0) return 1;
    return Math.max(criticalMax + 1, min);
  }
  return min + 1;
}

export function stockStatusQueryParam(
  filter: string | undefined,
): string | undefined {
  if (!filter) return undefined;
  const normalized = filter.trim().toLowerCase();
  if (normalized === "in stock" || normalized === "in_stock") return "in_stock";
  if (normalized === "low stock" || normalized === "low_stock") return "low_stock";
  if (normalized === "critical") return "critical";
  if (
    normalized === "out of stock" ||
    normalized === "out_of_stock"
  ) {
    return "out_of_stock";
  }
  return undefined;
}
