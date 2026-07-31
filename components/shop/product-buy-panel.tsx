"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavIcon } from "@/components/layout/nav-icons";
import type { ShopProduct } from "@/lib/shop";

type ProductBuyPanelProps = {
  product: ShopProduct;
};

export function ProductBuyPanel({ product }: ProductBuyPanelProps) {
  const [qty, setQty] = useState(1);
  const max = Math.max(1, product.stockCount);
  const available = product.stockStatus !== "out_of_stock";

  const bump = (delta: number) => {
    setQty((q) => Math.min(max, Math.max(1, q + delta)));
  };

  const stockLabel =
    product.stockStatus === "in_stock"
      ? "In Stock"
      : product.stockStatus === "low_stock"
        ? "Low Stock"
        : "Out of Stock";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink sm:text-[2rem]">
          {product.name}
        </h1>
        <p className="mt-1.5 text-sm text-[#8a8a8a]">{product.subtitle}</p>
      </div>

      <p className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
        {product.priceLabel}{" "}
        <span className="text-base font-medium text-[#8a8a8a]">
          {product.unitLabel}
        </span>
      </p>

      {/* Stock status — thin grey bordered box */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#e0e0e0] px-4 py-3 text-sm">
        <span
          className={`size-2.5 shrink-0 rounded-full ${
            product.stockStatus === "out_of_stock"
              ? "bg-[#d64545]"
              : product.stockStatus === "low_stock"
                ? "bg-[#e67a2e]"
                : "bg-[#1f9d57]"
          }`}
          aria-hidden
        />
        <span className="font-semibold text-aurora-ink">{stockLabel}</span>
        <span className="text-[#8a8a8a]">
          · SKU {product.id.toUpperCase()} · {product.stockCount} units
          available
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="lime"
          size="lg"
          className="h-12 flex-1 gap-2 rounded-xl text-[15px]"
          disabled={!available}
        >
          <NavIcon name="shop" className="size-5" />
          Buy Now
        </Button>

        <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-[#e0e0e0] bg-white sm:w-[140px]">
          <button
            type="button"
            onClick={() => bump(-1)}
            className="flex h-full w-10 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6]"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            max={max}
            value={qty}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isNaN(n)) return;
              setQty(Math.min(max, Math.max(1, n)));
            }}
            className="h-full min-w-0 flex-1 border-x border-[#e5e5e5] bg-white text-center text-sm font-semibold text-aurora-ink outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => bump(1)}
            className="flex h-full w-10 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
