"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetail } from "@/components/shop/product-detail";
import { ShopProductGate } from "@/components/shop/shop-product-gate";
import { bffCall } from "@/lib/bff/generated/client";
import { getProductBySlug, type ShopProduct } from "@/lib/shop";

export function ProductDetailLoader({ slug }: { slug: string }) {
  const fallback = getProductBySlug(slug);
  const [product, setProduct] = useState<ShopProduct | null>(fallback);
  const [ready, setReady] = useState(!fallback);

  useEffect(() => {
    void bffCall<ShopProduct>("getProductBySlug", { params: { slug } })
      .then(setProduct)
      .catch(() => {
        if (!fallback) setProduct(null);
      })
      .finally(() => setReady(true));
  }, [slug, fallback]);

  if (!ready && !product) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading product…
      </div>
    );
  }

  if (!product) notFound();

  return (
    <ShopProductGate>
      <ProductDetail product={product} />
    </ShopProductGate>
  );
}
