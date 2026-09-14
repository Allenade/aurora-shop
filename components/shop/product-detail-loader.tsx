"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductDetail } from "@/components/shop/product-detail";
import { ShopProductGate } from "@/components/shop/shop-product-gate";
import { EmptyState } from "@/components/ui/empty-state";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { useShopSession } from "@/lib/shop-session-store";
import type { ShopProduct } from "@/lib/shop";
import { DetailPageSkeleton } from "@/components/ui/skeleton";

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
        const message =
          status === 404
            ? null
            : err instanceof BffRequestError
              ? err.message
              : "Unable to load this product.";
        if (message) toast.error(message);
        setResult({
          slug,
          product: null,
          missing: status === 404,
          error: message,
          fetching: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, getCachedProduct, cacheProduct]);

  if (showLoading) {
    return <DetailPageSkeleton />;
  }

  if (missing && !product) notFound();

  if ((error || !product) && !fetching) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <EmptyState description={error ?? "Product not found."} />
      </div>
    );
  }

  if (!product) {
    return <DetailPageSkeleton />;
  }

  return (
    <ShopProductGate>
      <ProductDetail product={product} />
    </ShopProductGate>
  );
}
