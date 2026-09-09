"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetail } from "@/components/shop/product-detail";
import { ShopProductGate } from "@/components/shop/shop-product-gate";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { useShopSession } from "@/lib/shop-session-store";
import type { ShopProduct } from "@/lib/shop";

type LoadState = {
  slug: string;
  product: ShopProduct | null;
  error: string | null;
  missing: boolean;
  fetching: boolean;
};

export function ProductDetailLoader({ slug }: { slug: string }) {
  const { getCachedProduct, cacheProduct } = useShopSession();
  const cached = getCachedProduct(slug);

  const [result, setResult] = useState<LoadState>(() => ({
    slug,
    product: cached,
    error: null,
    missing: false,
    fetching: !cached,
  }));

  const forSlug = result.slug === slug;
  const product = forSlug
    ? (result.product ?? cached)
    : (cached ?? null);
  const fetching = forSlug ? result.fetching : !cached;
  const error = forSlug ? result.error : null;
  const missing = forSlug ? result.missing : false;
  const showLoading = !product && fetching;

  useEffect(() => {
    let cancelled = false;
    const fromCache = getCachedProduct(slug);

    void bffCall<ShopProduct>("getProductBySlug", { params: { slug } })
      .then((row) => {
        if (cancelled) return;
        cacheProduct(row);
        setResult({
          slug,
          product: row,
          error: null,
          missing: false,
          fetching: false,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err instanceof BffRequestError ? err.status : undefined;
        const fallback = fromCache ?? getCachedProduct(slug);
        if (fallback) {
          setResult({
            slug,
            product: fallback,
            error: null,
            missing: false,
            fetching: false,
          });
          return;
        }
        setResult({
          slug,
          product: null,
          missing: status === 404,
          error:
            status === 404
              ? null
              : err instanceof BffRequestError
                ? err.message
                : "Unable to load this product.",
          fetching: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, getCachedProduct, cacheProduct]);

  if (showLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading product…
      </div>
    );
  }

  if (missing && !product) notFound();

  if ((error || !product) && !fetching) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <p
          className="rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error ?? "Product not found."}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading product…
      </div>
    );
  }

  return (
    <ShopProductGate>
      <ProductDetail product={product} />
    </ShopProductGate>
  );
}
