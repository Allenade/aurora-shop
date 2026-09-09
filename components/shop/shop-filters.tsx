"use client";

import {
  FilterCheckboxGroup,
  FilterPriceRange,
} from "@/components/ui/filters";
import { Card } from "@/components/ui/card";
import {
  SHOP_PRICE_MIN,
  SHOP_STOCK_OPTIONS,
  type StockStatus,
} from "@/lib/shop";

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

export function ShopFilters({
  value,
  onChange,
  categories,
  brands,
  priceMax,
}: ShopFiltersProps) {
  const sliderMax = Math.max(priceMax, SHOP_PRICE_MIN, 1);

  return (
    <Card className="flex h-fit flex-col gap-6 p-5">
      <h2 className="text-base font-bold text-aurora-ink">Filters</h2>

      <FilterCheckboxGroup
        title="Categories"
        values={value.categories}
        onChange={(next) => onChange({ ...value, categories: next })}
        options={categories.map((c) => ({ value: c, label: c }))}
      />

      <FilterPriceRange
        min={SHOP_PRICE_MIN}
        max={sliderMax}
        value={Math.min(value.maxPrice, sliderMax)}
        onChange={(maxPrice) => onChange({ ...value, maxPrice })}
      />

      <FilterCheckboxGroup
        title="Stock Status"
        values={value.stock}
        onChange={(stock) => onChange({ ...value, stock })}
        options={SHOP_STOCK_OPTIONS}
      />

      <FilterCheckboxGroup
        title="Brand"
        values={value.brands}
        onChange={(next) => onChange({ ...value, brands: next })}
        options={brands.map((b) => ({ value: b, label: b }))}
      />
    </Card>
  );
}
