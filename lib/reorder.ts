import type { OrderRecord } from "@/lib/orders";

export type ReorderLine = {
  slug: string;
  qty: number;
  name?: string;
};

export type MergeLineResult = {
  slug: string;
  name: string;
  requested: number;
  added: number;
  stockCount: number;
  inCartBefore: number;
  status: "added" | "partial" | "skipped";
};

export type MergeItemsResult = {
  results: MergeLineResult[];
  addedAny: boolean;
};

export const REORDER_NOTICE_KEY = "aurora_reorder_notice";

export function reorderLinesFromOrder(order: OrderRecord): ReorderLine[] {
  return (order.items ?? [])
    .map((item) => ({
      slug: (item.slug || item.sku || "").trim(),
      qty: item.qty,
      name: item.name,
    }))
    .filter((line) => line.slug && line.qty > 0);
}

export function formatMergeNotices(result: MergeItemsResult): string[] {
  const notices: string[] = [];
  for (const row of result.results) {
    if (row.status === "skipped") {
      if (row.stockCount <= 0) {
        notices.push(`${row.name} is out of stock.`);
      } else if (row.inCartBefore >= row.stockCount) {
        notices.push(
          `${row.name}: only ${row.stockCount} left in stock (you already have ${row.inCartBefore} in cart).`,
        );
      } else {
        notices.push(`${row.name} could not be added.`);
      }
      continue;
    }
    if (row.status === "partial") {
      notices.push(
        `${row.name}: only ${row.stockCount} left in stock (requested ${row.requested}; added ${row.added}).`,
      );
    }
  }
  return notices;
}

export function saveReorderNotices(notices: string[]) {
  if (typeof window === "undefined") return;
  if (notices.length === 0) {
    sessionStorage.removeItem(REORDER_NOTICE_KEY);
    return;
  }
  sessionStorage.setItem(REORDER_NOTICE_KEY, JSON.stringify(notices));
}

export function readReorderNotices(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(REORDER_NOTICE_KEY);
    if (!raw) return [];
    sessionStorage.removeItem(REORDER_NOTICE_KEY);
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    sessionStorage.removeItem(REORDER_NOTICE_KEY);
    return [];
  }
}
