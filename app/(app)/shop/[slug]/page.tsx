import { ProductDetailLoader } from "@/components/shop/product-detail-loader";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailLoader slug={slug} />;
}
