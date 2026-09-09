"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ShopFilterState } from "@/components/shop/shop-filters";
import {
  SHOP_BRANDS,
  SHOP_CATEGORIES,
  SHOP_PRICE_MAX,
  type ShopProduct,
} from "@/lib/shop";

export type ShopListSession = {
  filterKey: string;
  seed: string;
};

type ProductCacheEntry = {
  product: ShopProduct;
  at: number;
};

type ShopSessionContextValue = {
  filters: ShopFilterState;
  setFilters: (next: ShopFilterState | ((prev: ShopFilterState) => ShopFilterState)) => void;
  priceFilterEnabled: boolean;
  setPriceFilterEnabled: (enabled: boolean) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  products: ShopProduct[];
  setProducts: (
    next: ShopProduct[] | ((prev: ShopProduct[]) => ShopProduct[]),
  ) => void;
  total: number;
  setTotal: (total: number) => void;
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  resolvedKey: string | null;
  setResolvedKey: (key: string | null) => void;
  catalogMaxPrice: number;
  setCatalogMaxPrice: (max: number) => void;
  categoryOptions: string[];
  setCategoryOptions: (options: string[]) => void;
  brandOptions: string[];
  setBrandOptions: (options: string[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  listSession: ShopListSession;
  setListSession: (session: ShopListSession) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
  getCachedProduct: (slug: string) => ShopProduct | null;
  cacheProduct: (product: ShopProduct) => void;
  cacheProducts: (products: ShopProduct[]) => void;
};

const ShopSessionContext = createContext<ShopSessionContextValue | null>(null);

const INITIAL_FILTERS: ShopFilterState = {
  categories: [],
  brands: [],
  stock: [],
  maxPrice: SHOP_PRICE_MAX,
};

function createSeed() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

/** Stable query key — omits maxPrice until the user moves the slider. */
export function shopFilterKey(
  filters: ShopFilterState,
  priceFilterEnabled: boolean,
) {
  return JSON.stringify({
    categories: filters.categories,
    brands: filters.brands,
    stock: filters.stock,
    maxPrice: priceFilterEnabled ? filters.maxPrice : null,
  });
}

export function createShopSeed() {
  return createSeed();
}

export function ShopSessionProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ShopFilterState>(INITIAL_FILTERS);
  const [priceFilterEnabled, setPriceFilterEnabled] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [resolvedKey, setResolvedKey] = useState<string | null>(null);
  const [catalogMaxPrice, setCatalogMaxPrice] = useState(SHOP_PRICE_MAX);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    ...SHOP_CATEGORIES,
  ]);
  const [brandOptions, setBrandOptions] = useState<string[]>([...SHOP_BRANDS]);
  const [error, setError] = useState<string | null>(null);
  const [listSession, setListSession] = useState<ShopListSession>(() => ({
    filterKey: shopFilterKey(INITIAL_FILTERS, false),
    seed: createSeed(),
  }));
  const [scrollY, setScrollY] = useState(0);
  const productCacheRef = useRef<Map<string, ProductCacheEntry>>(new Map());

  const getCachedProduct = useCallback((slug: string) => {
    return productCacheRef.current.get(slug)?.product ?? null;
  }, []);

  const cacheProduct = useCallback((product: ShopProduct) => {
    productCacheRef.current.set(product.slug, {
      product,
      at: Date.now(),
    });
  }, []);

  const cacheProducts = useCallback((rows: ShopProduct[]) => {
    const now = Date.now();
    for (const product of rows) {
      productCacheRef.current.set(product.slug, { product, at: now });
    }
  }, []);

  const value = useMemo<ShopSessionContextValue>(
    () => ({
      filters,
      setFilters,
      priceFilterEnabled,
      setPriceFilterEnabled,
      view,
      setView,
      products,
      setProducts,
      total,
      setTotal,
      page,
      setPage,
      pageCount,
      setPageCount,
      resolvedKey,
      setResolvedKey,
      catalogMaxPrice,
      setCatalogMaxPrice,
      categoryOptions,
      setCategoryOptions,
      brandOptions,
      setBrandOptions,
      error,
      setError,
      listSession,
      setListSession,
      scrollY,
      setScrollY,
      getCachedProduct,
      cacheProduct,
      cacheProducts,
    }),
    [
      filters,
      priceFilterEnabled,
      view,
      products,
      total,
      page,
      pageCount,
      resolvedKey,
      catalogMaxPrice,
      categoryOptions,
      brandOptions,
      error,
      listSession,
      scrollY,
      getCachedProduct,
      cacheProduct,
      cacheProducts,
    ],
  );

  return (
    <ShopSessionContext.Provider value={value}>
      {children}
    </ShopSessionContext.Provider>
  );
}

export function useShopSession() {
  const ctx = useContext(ShopSessionContext);
  if (!ctx) {
    throw new Error("useShopSession must be used within ShopSessionProvider");
  }
  return ctx;
}
