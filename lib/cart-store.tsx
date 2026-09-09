"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import type { MergeItemsResult, ReorderLine } from "@/lib/reorder";
import type { ShopProduct } from "@/lib/shop";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  priceLabel: string;
  stockCount: number;
  qty: number;
};

export type CartResponse = {
  items: CartItem[];
  itemCount: number;
};

export type CartItemHint = {
  productId?: string;
  name?: string;
  image?: string;
  price?: number;
  priceLabel?: string;
  stockCount?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  loading: boolean;
  error: string | null;
  qtyFor: (slug: string) => number;
  isInCart: (slug: string) => boolean;
  stockFor: (slug: string) => number | undefined;
  refresh: () => Promise<void>;
  /** Optimistic; syncs in the background. */
  setQty: (slug: string, qty: number, hint?: CartItemHint) => void;
  /** Optimistic; syncs in the background. */
  add: (slug: string, qty?: number, hint?: CartItemHint) => void;
  /** Optimistic; syncs in the background. */
  inc: (slug: string, maxStock?: number, hint?: CartItemHint) => void;
  /** Optimistic; at qty 1 removes. Syncs in the background. */
  dec: (slug: string) => void;
  /** Optimistic; syncs in the background. */
  remove: (slug: string) => void;
  clear: () => Promise<void>;
  /**
   * Optimistic merge (does not clear). Returns stock notices immediately;
   * cart API writes run in the background.
   */
  mergeItems: (lines: ReorderLine[]) => Promise<MergeItemsResult>;
};

const CartContext = createContext<CartContextValue | null>(null);

function countItems(rows: CartItem[]) {
  return rows.reduce((sum, item) => sum + item.qty, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef<CartItem[]>([]);

  const apply = useCallback((cart: CartResponse) => {
    const next = cart.items ?? [];
    itemsRef.current = next;
    setItems(next);
    setItemCount(cart.itemCount ?? countItems(next));
  }, []);

  const applyLocal = useCallback((next: CartItem[]) => {
    itemsRef.current = next;
    setItems(next);
    setItemCount(countItems(next));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const cart = await bffCall<CartResponse>("getCart");
      apply(cart);
      setError(null);
    } catch (err) {
      setError(
        err instanceof BffRequestError ? err.message : "Unable to load cart.",
      );
    } finally {
      setLoading(false);
    }
  }, [apply]);

  useEffect(() => {
    let cancelled = false;
    void bffCall<CartResponse>("getCart")
      .then((cart) => {
        if (cancelled) return;
        apply(cart);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load cart.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apply]);

  const syncRemove = useCallback(
    (slug: string) => {
      void bffCall<CartResponse>("removeCartItem", { params: { slug } })
        .then(apply)
        .catch(() => {
          void refresh();
        });
    },
    [apply, refresh],
  );

  const syncSetQty = useCallback(
    (slug: string, qty: number) => {
      void bffCall<CartResponse>("setCartItem", { body: { slug, qty } })
        .then(apply)
        .catch(() => {
          void refresh();
        });
    },
    [apply, refresh],
  );

  const remove = useCallback(
    (slug: string) => {
      applyLocal(itemsRef.current.filter((item) => item.slug !== slug));
      syncRemove(slug);
    },
    [applyLocal, syncRemove],
  );

  const setQty = useCallback(
    (slug: string, qty: number, hint?: CartItemHint) => {
      const nextQty = Math.floor(qty);
      if (!Number.isFinite(nextQty) || nextQty < 1) {
        remove(slug);
        return;
      }

      const prev = itemsRef.current;
      const existing = prev.find((item) => item.slug === slug);
      const stock = Math.max(
        1,
        hint?.stockCount ?? existing?.stockCount ?? nextQty,
      );
      const clamped = Math.min(nextQty, stock);

      if (existing) {
        applyLocal(
          prev.map((item) =>
            item.slug === slug
              ? {
                  ...item,
                  qty: clamped,
                  stockCount: hint?.stockCount ?? item.stockCount,
                }
              : item,
          ),
        );
      } else {
        applyLocal([
          ...prev,
          {
            id: `local-${slug}`,
            productId: hint?.productId ?? "",
            slug,
            name: hint?.name ?? slug,
            image: hint?.image ?? "/images/auth-panel.png",
            price: hint?.price ?? 0,
            priceLabel: hint?.priceLabel ?? "",
            stockCount: hint?.stockCount ?? stock,
            qty: clamped,
          },
        ]);
      }

      syncSetQty(slug, clamped);
    },
    [applyLocal, remove, syncSetQty],
  );

  const add = useCallback(
    (slug: string, qty = 1, hint?: CartItemHint) => {
      const current = itemsRef.current.find((item) => item.slug === slug)?.qty ?? 0;
      setQty(slug, current + Math.max(1, Math.floor(qty)), hint);
    },
    [setQty],
  );

  const inc = useCallback(
    (slug: string, maxStock?: number, hint?: CartItemHint) => {
      const current = itemsRef.current.find((item) => item.slug === slug);
      const stock = maxStock ?? hint?.stockCount ?? current?.stockCount ?? 1;
      const next = Math.min(stock, (current?.qty ?? 0) + 1);
      if (next < 1) return;
      setQty(slug, next, { ...hint, stockCount: stock });
    },
    [setQty],
  );

  const dec = useCallback(
    (slug: string) => {
      const current = itemsRef.current.find((item) => item.slug === slug);
      if (!current) return;
      if (current.qty <= 1) {
        remove(slug);
        return;
      }
      setQty(slug, current.qty - 1);
    },
    [remove, setQty],
  );

  const clear = useCallback(async () => {
    applyLocal([]);
    try {
      const cart = await bffCall<CartResponse>("clearCart");
      apply(cart);
    } catch {
      void refresh();
    }
  }, [apply, applyLocal, refresh]);

  const mergeItems = useCallback(
    async (lines: ReorderLine[]): Promise<MergeItemsResult> => {
      const working = [...itemsRef.current];
      const results: MergeItemsResult["results"] = [];
      const writes: Array<{ slug: string; qty: number }> = [];

      const resolved = await Promise.all(
        lines.map(async (line) => {
          const slug = line.slug?.trim();
          const requested = Math.floor(line.qty);
          if (!slug || !Number.isFinite(requested) || requested < 1) {
            return null;
          }
          try {
            const product = await bffCall<ShopProduct>("getProductBySlug", {
              params: { slug },
            });
            return {
              slug,
              requested,
              name: line.name?.trim() || product.name || slug,
              stockCount: Math.max(0, product.stockCount ?? 0),
              product,
            };
          } catch {
            return {
              slug,
              requested,
              name: line.name?.trim() || slug,
              stockCount: 0,
              product: null,
            };
          }
        }),
      );

      for (const row of resolved) {
        if (!row) continue;
        const inCartBefore =
          working.find((item) => item.slug === row.slug)?.qty ?? 0;

        if (row.stockCount <= 0) {
          results.push({
            slug: row.slug,
            name: row.name,
            requested: row.requested,
            added: 0,
            stockCount: 0,
            inCartBefore,
            status: "skipped",
          });
          continue;
        }

        const room = Math.max(0, row.stockCount - inCartBefore);
        if (room <= 0) {
          results.push({
            slug: row.slug,
            name: row.name,
            requested: row.requested,
            added: 0,
            stockCount: row.stockCount,
            inCartBefore,
            status: "skipped",
          });
          continue;
        }

        const added = Math.min(row.requested, room);
        const nextQty = inCartBefore + added;
        const existingIndex = working.findIndex((item) => item.slug === row.slug);
        if (existingIndex >= 0) {
          working[existingIndex] = {
            ...working[existingIndex]!,
            qty: nextQty,
            stockCount: row.stockCount,
          };
        } else if (row.product) {
          working.push({
            id: `local-${row.slug}`,
            productId: row.product.id,
            slug: row.slug,
            name: row.name,
            image: row.product.image,
            price: row.product.price,
            priceLabel: row.product.priceLabel,
            stockCount: row.stockCount,
            qty: nextQty,
          });
        }

        writes.push({ slug: row.slug, qty: nextQty });
        results.push({
          slug: row.slug,
          name: row.name,
          requested: row.requested,
          added,
          stockCount: row.stockCount,
          inCartBefore,
          status: added < row.requested ? "partial" : "added",
        });
      }

      applyLocal(working);

      // Persist in the background — callers can navigate immediately.
      void (async () => {
        try {
          let last: CartResponse | null = null;
          for (const write of writes) {
            last = await bffCall<CartResponse>("setCartItem", {
              body: write,
            });
          }
          if (last) apply(last);
          else if (writes.length === 0) {
            /* nothing to write */
          } else {
            await refresh();
          }
        } catch {
          void refresh();
        }
      })();

      return {
        results,
        addedAny: results.some((row) => row.added > 0),
      };
    },
    [apply, applyLocal, refresh],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      loading,
      error,
      qtyFor: (slug) => items.find((item) => item.slug === slug)?.qty ?? 0,
      isInCart: (slug) => items.some((item) => item.slug === slug),
      stockFor: (slug) => items.find((item) => item.slug === slug)?.stockCount,
      refresh,
      setQty,
      add,
      inc,
      dec,
      remove,
      clear,
      mergeItems,
    }),
    [
      items,
      itemCount,
      loading,
      error,
      refresh,
      setQty,
      add,
      inc,
      dec,
      remove,
      clear,
      mergeItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function useCartOptional() {
  return useContext(CartContext);
}
