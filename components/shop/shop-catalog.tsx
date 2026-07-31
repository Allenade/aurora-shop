"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import {
  ShopFilters,
  type ShopFilterState,
} from "@/components/shop/shop-filters";
import {
  SHOP_PRICE_MAX,
  SHOP_PRODUCTS,
  type ShopProduct,
} from "@/lib/shop";
import { cn } from "@/lib/utils";

const initialFilters: ShopFilterState = {
  categories: [],
  brands: [],
  stock: [],
  maxPrice: SHOP_PRICE_MAX,
};

function filterProducts(
  products: ShopProduct[],
  filters: ShopFilterState,
): ShopProduct[] {
  return products.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand)
    ) {
      return false;
    }
    if (
      filters.stock.length > 0 &&
      !filters.stock.includes(product.stockStatus)
    ) {
      return false;
    }
    if (product.price > filters.maxPrice) return false;
    return true;
  });
}

export function ShopCatalog() {
  const [filters, setFilters] = useState<ShopFilterState>(initialFilters);
  const [view, setView] = useState<"grid" | "list">("grid");

  const products = useMemo(
    () => filterProducts(SHOP_PRODUCTS, filters),
    [filters],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 lg:w-[260px]">
        <ShopFilters value={filters} onChange={setFilters} />
      </aside>

      <section className="min-w-0 flex-1">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
              All Components
            </h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">
              Browse our complete catalog of electronics components.
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
                <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
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

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center text-sm text-[#8a8a8a]">
            No components match your filters.
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
}
