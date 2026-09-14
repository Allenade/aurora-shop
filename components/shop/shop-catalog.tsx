"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ProductCard } from "@/components/shop/product-card";
import {
  ShopFilters,
  type ShopFilterState,
} from "@/components/shop/shop-filters";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import {
  createShopSeed,
  shopFilterKey,
  useShopSession,
} from "@/lib/shop-session-store";
import { SHOP_PRICE_MIN, type ShopProduct } from "@/lib/shop";
import {
  ProductGridSkeleton,
  ShopFiltersSkeleton,
} from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type ProductsListResponse = {
  items: ShopProduct[];
  total: number;
  page: number;
  limit: number;
  offset?: number;
  pageCount: number;
  catalogMaxPrice?: number;
  categories?: string[];
  brands?: string[];
};

function buildPageItems(current: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const pageNum = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && pageNum - prev > 1) items.push("ellipsis");
    items.push(pageNum);
  }
  return items;
}

function buildQuery(
  filters: ShopFilterState,
  priceFilterEnabled: boolean,
  opts: { page: number; limit: number; seed: string; q?: string },
) {
  return {
    q: opts.q || undefined,
    category:
      filters.categories.length > 0 ? filters.categories.join(",") : undefined,
    brand: filters.brands.length > 0 ? filters.brands.join(",") : undefined,
    status: filters.stock.length > 0 ? filters.stock.join(",") : undefined,
    maxPrice: priceFilterEnabled ? String(filters.maxPrice) : undefined,
    page: String(opts.page),
    limit: String(opts.limit),
    sort: "random",
    seed: opts.seed,
  };
}

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";

  const session = useShopSession();
  const {
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
    facetsReady,
    setFacetsReady,
    setError,
    listSession,
    setListSession,
    scrollY,
    setScrollY,
    cacheProducts,
  } = session;

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [debouncedPriceFilter, setDebouncedPriceFilter] =
    useState(priceFilterEnabled);

  const filterKey = shopFilterKey(
    debouncedFilters,
    debouncedPriceFilter,
    searchQuery,
  );
  const listKey = `${listSession.filterKey}|${listSession.seed}|p${page}`;
  const filtersSynced = listSession.filterKey === filterKey;
  const loading = !filtersSynced || resolvedKey !== listKey;

  const productsRef = useRef(products);
  const scrollRestoredRef = useRef(false);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters(filters);
      setDebouncedPriceFilter(priceFilterEnabled);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters, priceFilterEnabled]);

  // Keep list session in sync with debounced filters + search (never during render).
  useEffect(() => {
    if (listSession.filterKey === filterKey) return;
    setListSession({ filterKey, seed: createShopSeed() });
    setPage(1);
  }, [filterKey, listSession.filterKey, setListSession, setPage]);

  // Restore scroll when returning with cached results
  useEffect(() => {
    if (scrollRestoredRef.current) return;
    if (loading || products.length === 0) return;
    if (scrollY <= 0) {
      scrollRestoredRef.current = true;
      return;
    }
    scrollRestoredRef.current = true;
    const y = scrollY;
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "auto" });
    });
  }, [loading, products.length, scrollY]);

  // Persist scroll while browsing the list
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setScrollY(window.scrollY);
    };
  }, [setScrollY]);

  useEffect(() => {
    // Wait until listSession matches the debounced filter key.
    if (listSession.filterKey !== filterKey) return;

    // Already have this page in memory — don't blank or refetch
    if (resolvedKey === listKey && productsRef.current.length > 0) {
      return;
    }

    let cancelled = false;
    const activeSession = listSession;
    const activeFilters = debouncedFilters;
    const activePriceFilter = debouncedPriceFilter;
    const activePage = page;
    const activeQuery = searchQuery;
    const key = `${activeSession.filterKey}|${activeSession.seed}|p${activePage}`;

    void bffCall<ProductsListResponse>("listProducts", {
      query: buildQuery(activeFilters, activePriceFilter, {
        page: activePage,
        limit: PAGE_SIZE,
        seed: activeSession.seed,
        q: activeQuery,
      }),
    })
      .then((res) => {
        if (cancelled) return;
        const paginated =
          res && !Array.isArray(res) && Array.isArray(res.items);
        const rows = Array.isArray(res)
          ? res
          : paginated
            ? res.items
            : [];

        if (paginated) {
          setTotal(res.total ?? rows.length);
          setPageCount(Math.max(1, res.pageCount ?? 1));
          if (
            typeof res.catalogMaxPrice === "number" &&
            res.catalogMaxPrice > 0
          ) {
            const nextCatalogMax = res.catalogMaxPrice;
            setCatalogMaxPrice(nextCatalogMax);
            // Only seed the slider ceiling before the user moves it.
            // Never overwrite an active price filter — that snapped the thumb
            // back to catalog max on every refetch.
            if (!activePriceFilter) {
              setFilters((prev) => {
                if (prev.maxPrice === nextCatalogMax) return prev;
                return { ...prev, maxPrice: nextCatalogMax };
              });
            } else {
              setFilters((prev) => {
                if (prev.maxPrice <= nextCatalogMax) return prev;
                return { ...prev, maxPrice: nextCatalogMax };
              });
            }
          }
          if (Array.isArray(res.categories) && res.categories.length > 0) {
            setCategoryOptions(res.categories);
          }
          if (Array.isArray(res.brands) && res.brands.length > 0) {
            setBrandOptions(res.brands);
          }
        } else {
          setTotal(rows.length);
          setPageCount(1);
        }

        setProducts(rows);
        cacheProducts(rows);
        setResolvedKey(key);
        setFacetsReady(true);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof BffRequestError
            ? err.message
            : "Unable to load products from the API.";
        setProducts([]);
        setTotal(0);
        setPageCount(1);
        setResolvedKey(key);
        setFacetsReady(true);
        setError(message);
        toast.error(message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listKey,
    filterKey,
    debouncedFilters,
    debouncedPriceFilter,
    listSession,
    page,
    searchQuery,
  ]);

  function handleFiltersChange(next: ShopFilterState) {
    if (next.maxPrice !== filters.maxPrice) {
      setPriceFilterEnabled(true);
    }
    setFilters(next);
    setPage(1);
  }

  function goToPage(nextPage: number) {
    const clamped = Math.min(pageCount, Math.max(1, nextPage));
    if (clamped === page) return;
    setPage(clamped);
    setScrollY(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentPage = Math.min(page, pageCount);
  const pagerButtons = useMemo(
    () => buildPageItems(currentPage, pageCount),
    [currentPage, pageCount],
  );
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total);

  const showProducts = products.length > 0;
  const showLoadingBanner = loading && products.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:max-h-[calc(100dvh-72px-3rem)] lg:w-[260px] lg:self-start lg:overflow-y-auto">
        {!facetsReady ? (
          <ShopFiltersSkeleton />
        ) : (
          <ShopFilters
            value={filters}
            onChange={handleFiltersChange}
            categories={categoryOptions}
            brands={brandOptions}
            priceMax={Math.max(catalogMaxPrice, SHOP_PRICE_MIN, 1)}
          />
        )}
      </aside>

      <section className="min-w-0 flex-1">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
              All Components
            </h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">
              {searchQuery
                ? `Results for “${searchQuery}”`
                : "Browse our complete catalog of electronics components."}
              {!loading && total > 0 ? ` · ${total} products` : null}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[#e8e8e8] bg-white p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-md",
                view === "grid"
                  ? "bg-aurora-lime text-aurora-ink"
                  : "text-[#8a8a8a] hover:bg-[#f6f6f6]",
              )}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1.5"
                  y="1.5"
                  width="5"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="9.5"
                  y="1.5"
                  width="5"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="1.5"
                  y="9.5"
                  width="5"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="9.5"
                  y="9.5"
                  width="5"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-md",
                view === "list"
                  ? "bg-aurora-lime text-aurora-ink"
                  : "text-[#8a8a8a] hover:bg-[#f6f6f6]",
              )}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 3.5h12M2 8h12M2 12.5h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {showLoadingBanner ? (
          <ProductGridSkeleton count={6} view={view} />
        ) : null}

        {loading && showProducts ? (
          <div className="relative mb-4 opacity-60">
            <div
              className={cn(
                "grid gap-4",
                view === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}

        {!loading && !showProducts ? (
          <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center text-sm text-[#8a8a8a]">
            {searchQuery
              ? `No components match “${searchQuery}”.`
              : "No components match your filters."}
          </div>
        ) : !loading && showProducts ? (
          <>
            <div
              className={cn(
                "grid gap-4",
                view === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pageCount > 1 || total > 0 ? (
              <div className="mt-6 flex flex-col gap-3 border-t border-[#ececec] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#8a8a8a]">
                  Showing {rangeStart}-{rangeEnd} of {total} products
                </p>
                {pageCount > 1 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || loading}
                      onClick={() => goToPage(currentPage - 1)}
                      className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {pagerButtons.map((item, index) =>
                      item === "ellipsis" ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-1 text-[#9a9a9a]"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          disabled={loading}
                          onClick={() => goToPage(item)}
                          aria-current={
                            item === currentPage ? "page" : undefined
                          }
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium",
                            item === currentPage
                              ? "bg-aurora-lime text-aurora-ink"
                              : "border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]",
                          )}
                        >
                          {item}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      disabled={currentPage >= pageCount || loading}
                      onClick={() => goToPage(currentPage + 1)}
                      className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}

export function ShopCatalog() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-[260px]">
            <ShopFiltersSkeleton />
          </aside>
          <section className="min-w-0 flex-1">
            <ProductGridSkeleton count={6} />
          </section>
        </div>
      }
    >
      <ShopCatalogContent />
    </Suspense>
  );
}
