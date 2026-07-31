"use client";

import { useState } from "react";
import type { ShopProduct } from "@/lib/shop";
import { cn } from "@/lib/utils";

type Tab = "specs" | "datasheet" | "reviews";

const TABS: { value: Tab; label: string }[] = [
  { value: "specs", label: "Technical Specs" },
  { value: "datasheet", label: "Datasheet" },
  { value: "reviews", label: "Reviews" },
];

export function ProductTabs({ product }: { product: ShopProduct }) {
  const [tab, setTab] = useState<Tab>("specs");

  return (
    <div className="flex flex-col gap-4">
      {/* Underline tabs — outside the table border */}
      <div className="flex gap-6 border-b border-[#e0e0e0]">
        {TABS.map((item) => {
          const active = tab === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                "-mb-px border-b-2 px-0.5 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-aurora-ink text-aurora-ink"
                  : "border-transparent text-[#8a8a8a] hover:text-aurora-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "specs" ? (
        <div className="overflow-hidden rounded-xl border border-[#e0e0e0] bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {product.specs.map((row, index) => {
              const lastRowIndex = Math.floor((product.specs.length - 1) / 2);
              const rowIndex = Math.floor(index / 2);
              const isLeftCol = index % 2 === 0;
              const isOddLast =
                index === product.specs.length - 1 &&
                product.specs.length % 2 === 1;

              return (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-baseline justify-between gap-4 px-4 py-3.5",
                    isLeftCol && !isOddLast && "sm:border-r sm:border-[#e0e0e0]",
                    rowIndex < lastRowIndex && "border-b border-[#e0e0e0]",
                    isOddLast && "sm:col-span-2",
                  )}
                >
                  <span className="shrink-0 text-[11px] font-semibold tracking-[0.06em] text-[#8a8a8a] uppercase">
                    {row.label}
                  </span>
                  <span className="text-right text-sm font-medium text-aurora-ink">
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "datasheet" ? (
        <div className="rounded-xl border border-[#e0e0e0] bg-white px-5 py-5">
          <p className="text-sm leading-relaxed text-[#8a8a8a]">
            {product.datasheetNote}
          </p>
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="rounded-xl border border-[#e0e0e0] bg-white px-5 py-5">
          <p className="text-sm leading-relaxed text-[#8a8a8a]">
            {product.reviewsNote}
          </p>
        </div>
      ) : null}
    </div>
  );
}
