"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavIcon } from "@/components/layout/nav-icons";
import { useCart } from "@/lib/cart-store";
import type { ShopProduct } from "@/lib/shop";

type ProductBuyPanelProps = {
  product: ShopProduct;
};

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

export function ProductBuyPanel({ product }: ProductBuyPanelProps) {
  const router = useRouter();
  const cart = useCart();
  const inCart = cart.isInCart(product.slug);
  const cartQty = cart.qtyFor(product.slug);
  const max = Math.max(1, product.stockCount);
  const available = product.stockStatus !== "out_of_stock";
  const sku = product.sku?.trim() || product.slug;
  const hint = productHint(product);

  const [draftQty, setDraftQty] = useState(1);
  const qty = inCart ? Math.max(1, cartQty) : draftQty;

  const bump = (delta: number) => {
    setDraftQty((q) => Math.min(max, Math.max(1, q + delta)));
  };

  function handleBuyNow() {
    cart.setQty(product.slug, qty, hint);
    router.push(`/cart?buy=${encodeURIComponent(product.slug)}`);
  }

  function handleAddToCart() {
    cart.setQty(product.slug, qty, hint);
  }

  function handleRemoveFromCart() {
    cart.remove(product.slug);
  }

  function handleDec() {
    if (!inCart) {
      bump(-1);
      return;
    }
    if (qty <= 1) {
      cart.remove(product.slug);
      return;
    }
    const next = qty - 1;
    cart.setQty(product.slug, next, hint);
  }

  function handleInc() {
    if (!inCart) {
      bump(1);
      return;
    }
    const next = Math.min(max, qty + 1);
    cart.setQty(product.slug, next, hint);
  }

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
          · SKU {sku} · {product.stockCount} units available
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="lime"
          size="lg"
          className="h-12 flex-1 gap-2 rounded-xl text-[15px]"
          disabled={!available}
          onClick={handleBuyNow}
        >
          <NavIcon name="shop" className="size-5" />
          Buy Now
        </Button>

        <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-[#e0e0e0] bg-white sm:w-[140px]">
          <button
            type="button"
            onClick={handleDec}
            disabled={!inCart && qty <= 1}
            className="flex h-full w-10 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6] disabled:opacity-40"
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
              const next = Math.min(max, Math.max(1, n));
              if (inCart) cart.setQty(product.slug, next, hint);
              else setDraftQty(next);
            }}
            className="h-full min-w-0 flex-1 border-x border-[#e5e5e5] bg-white text-center text-sm font-semibold text-aurora-ink outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={handleInc}
            disabled={qty >= max}
            className="flex h-full w-10 shrink-0 items-center justify-center text-lg text-[#5f5f5f] hover:bg-[#f6f6f6] disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {inCart ? (
        <button
          type="button"
          onClick={handleRemoveFromCart}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-[#d4d4d4] bg-white text-[15px] font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Remove from cart
        </button>
      ) : (
        <button
          type="button"
          disabled={!available}
          onClick={handleAddToCart}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-[#d4d4d4] bg-white text-[15px] font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7] disabled:opacity-50"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
