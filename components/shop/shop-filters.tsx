"use client";

import {
  FilterCheckboxGroup,
  FilterPriceRange,
} from "@/components/ui/filters";
import { Card } from "@/components/ui/card";
import {
  SHOP_BRANDS,
  SHOP_CATEGORIES,
  SHOP_PRICE_MAX,
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
};

export function ShopFilters({ value, onChange }: ShopFiltersProps) {
  return (
    <Card className="flex h-fit flex-col gap-6 p-5">
      <h2 className="text-base font-bold text-aurora-ink">Filters</h2>

      <FilterCheckboxGroup
        title="Categories"
        values={value.categories}
        onChange={(categories) => onChange({ ...value, categories })}
        options={SHOP_CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      <FilterPriceRange
        min={SHOP_PRICE_MIN}
        max={SHOP_PRICE_MAX}
        value={value.maxPrice}
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
        onChange={(brands) => onChange({ ...value, brands })}
        options={SHOP_BRANDS.map((b) => ({ value: b, label: b }))}
      />
    </Card>
  );
}
