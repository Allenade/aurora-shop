"use client";

import { useState } from "react";
import { FilterCheckboxGroup, FilterPriceRange } from "@/components/ui/filters";
import { Card } from "@/components/ui/card";
import {
  SHOP_PRICE_MIN,
  SHOP_STOCK_OPTIONS,
  type StockStatus,
} from "@/lib/shop";
import { cn } from "@/lib/utils";

export type ShopFilterState = {
  categories: string[];
  brands: string[];
  stock: StockStatus[];
  maxPrice: number;
};

type ShopFiltersProps = {
  value: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  categories: string[];
  brands: string[];
  priceMax: number;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "shrink-0 text-[#8a8a8a] transition-transform duration-200",
        open && "rotate-180",
      )}
    >
      <path
        d="M4 6.5 8 10.5 12 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShopFilters({
  value,
  onChange,
  categories,
  brands,
  priceMax,
}: ShopFiltersProps) {
  const sliderMax = Math.max(priceMax, SHOP_PRICE_MIN, 1);
  const activeCount =
    value.categories.length + value.brands.length + value.stock.length;
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <Card className="flex h-fit flex-col p-5">
      <button
        type="button"
        onClick={() => setPanelOpen((prev) => !prev)}
        aria-expanded={panelOpen}
        aria-controls="shop-filters-panel"
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="text-base font-bold text-aurora-ink">Filters</span>
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-aurora-lime px-1.5 text-[10px] font-bold text-aurora-ink">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronIcon open={panelOpen} />
      </button>

      {panelOpen ? (
        <div
          id="shop-filters-panel"
          className="mt-5 flex flex-col gap-5 border-t border-[#f0f0f0] pt-5"
        >
          {categories.length > 0 ? (
            <FilterCheckboxGroup
              title="Categories"
              values={value.categories}
              onChange={(next) => onChange({ ...value, categories: next })}
              options={categories.map((c) => ({ value: c, label: c }))}
              defaultOpen
            />
          ) : null}

          <FilterPriceRange
            min={SHOP_PRICE_MIN}
            max={sliderMax}
            value={Math.min(value.maxPrice, sliderMax)}
            onChange={(maxPrice) => onChange({ ...value, maxPrice })}
            defaultOpen
          />

          <FilterCheckboxGroup
            title="Stock Status"
            values={value.stock}
            onChange={(stock) => onChange({ ...value, stock })}
            options={SHOP_STOCK_OPTIONS}
            defaultOpen
          />

          {brands.length > 0 ? (
            <FilterCheckboxGroup
              title="Brand"
              values={value.brands}
              onChange={(next) => onChange({ ...value, brands: next })}
              options={brands.map((b) => ({ value: b, label: b }))}
              defaultOpen
            />
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
