import type { AdminOrder, CatalogProduct, InventoryItem } from "@/lib/admin";
import type { AdminListInitialData } from "@/lib/bff/admin-list";
import { AuthError } from "@/lib/bff/nest";
import {
  toAdminOrder,
  toCatalogProduct,
  toInventoryItem,
} from "@/lib/bff/map";
import { serverBffCall } from "@/lib/bff/server";
import type { OrderRecord } from "@/lib/orders";
import type { ShopProduct } from "@/lib/shop";

export type { AdminListInitialData } from "@/lib/bff/admin-list";

const PAGE_SIZE = 10;

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AuthError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function loadAdminOrdersInitial(): Promise<
  AdminListInitialData<AdminOrder>
> {
  try {
    const res = await serverBffCall<Paginated<OrderRecord> | OrderRecord[]>(
      "listOrders",
      {
        query: { page: "1", limit: String(PAGE_SIZE) },
      },
    );
    const paginated = res && !Array.isArray(res) && Array.isArray(res.items);
    const rows = Array.isArray(res) ? res : paginated ? res.items : [];
    return {
      items: rows.map((row) => toAdminOrder(row)),
      total: paginated ? (res.total ?? rows.length) : rows.length,
      page: paginated ? (res.page ?? 1) : 1,
      pageCount: paginated ? Math.max(1, res.pageCount ?? 1) : 1,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
      error: errorMessage(error, "Unable to load orders from the API."),
    };
  }
}

export async function loadAdminInventoryInitial(): Promise<
  AdminListInitialData<InventoryItem>
> {
  try {
    const res = await serverBffCall<
      | Paginated<Parameters<typeof toInventoryItem>[0]>
      | Array<Parameters<typeof toInventoryItem>[0]>
    >("listInventory", {
      query: { page: "1", limit: String(PAGE_SIZE) },
    });
    const paginated = res && !Array.isArray(res) && Array.isArray(res.items);
    const rows = Array.isArray(res) ? res : paginated ? res.items : [];
    return {
      items: rows.map((row) => toInventoryItem(row)),
      total: paginated ? (res.total ?? rows.length) : rows.length,
      page: paginated ? (res.page ?? 1) : 1,
      pageCount: paginated ? Math.max(1, res.pageCount ?? 1) : 1,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
      error: errorMessage(error, "Unable to load inventory from the API."),
    };
  }
}

export async function loadAdminProductsInitial(): Promise<
  AdminListInitialData<CatalogProduct>
> {
  try {
    const res = await serverBffCall<
      | Paginated<ShopProduct & { sku?: string; minStock?: number }>
      | Array<ShopProduct & { sku?: string; minStock?: number }>
    >("listProducts", {
      query: { page: "1", limit: String(PAGE_SIZE) },
    });
    const paginated = res && !Array.isArray(res) && Array.isArray(res.items);
    const rows = Array.isArray(res) ? res : paginated ? res.items : [];
    return {
      items: rows.map((row) => toCatalogProduct(row)),
      total: paginated ? (res.total ?? rows.length) : rows.length,
      page: paginated ? (res.page ?? 1) : 1,
      pageCount: paginated ? Math.max(1, res.pageCount ?? 1) : 1,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
      error: errorMessage(error, "Unable to load products from the API."),
    };
  }
}
