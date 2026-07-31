import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { ShopProductGate } from "@/components/shop/shop-product-gate";
import { getProductBySlug } from "@/lib/shop";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <ShopProductGate>
      <ProductDetail product={product} />
    </ShopProductGate>
  );
}
