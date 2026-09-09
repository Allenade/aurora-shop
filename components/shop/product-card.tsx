"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/cart-store";
import type { ShopProduct } from "@/lib/shop";
import { cn } from "@/lib/utils";

function badgeClass(badge?: ShopProduct["badge"]) {
  if (badge === "Out of Stock" || badge === "Low Stock") {
    return "border-[#f0b4b4] bg-[#fff5f5] text-[#d64545]";
  }
  if (badge === "New") {
    return "border-[#b7d0ff] bg-[#eef6ff] text-[#2f6fed]";
  }
  return "border-[#9fd9b5] bg-[#eefbf3] text-[#1f9d57]";
}

function productHint(product: ShopProduct) {
  return {
    productId: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    priceLabel: product.priceLabel,
    stockCount: product.stockCount,
  };
}

export function ProductCard({ product }: { product: ShopProduct }) {
  const cart = useCart();
  const inCart = cart.isInCart(product.slug);
  const qty = cart.qtyFor(product.slug);
  const max = Math.max(0, product.stockCount);
  const available = product.stockStatus !== "out_of_stock" && max > 0;
  const hint = productHint(product);

  return (
    <Card className="flex h-full flex-col p-3">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[5/4] overflow-hidden rounded-xl bg-[#f3f3f3]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge ? (
          <span
            className={cn(
              "absolute top-2.5 right-2.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
              badgeClass(product.badge),
            )}
          >
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          href={`/shop/${product.slug}`}
          className="text-[15px] font-bold text-aurora-ink hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#8a8a8a]">
          {product.subtitle}
        </p>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-base font-bold text-aurora-ink">
            {product.priceLabel}
          </p>
          <p className="text-xs text-[#9a9a9a]">
            {product.stockCount} Units Available
          </p>
        </div>

        <div className="mt-4">
          {!available ? (
            <button
              type="button"
              disabled
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#e5e5e5] bg-[#f7f7f7] px-3 text-sm font-semibold text-[#9a9a9a]"
            >
              Out of Stock
            </button>
          ) : inCart ? (
            <div className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-[#d4d4d4] bg-white">
              <button
                type="button"
                onClick={() => cart.dec(product.slug)}
                className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="flex h-full min-w-0 flex-1 items-center justify-center border-x border-[#e5e5e5] text-sm font-semibold text-aurora-ink">
                {qty}
              </span>
              <button
                type="button"
                disabled={qty >= max}
                onClick={() => cart.inc(product.slug, max, hint)}
                className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6] disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => cart.add(product.slug, 1, hint)}
              className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
