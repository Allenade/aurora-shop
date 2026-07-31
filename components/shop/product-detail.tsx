import { ProductBreadcrumbs } from "@/components/shop/product-breadcrumbs";
import { ProductBuyPanel } from "@/components/shop/product-buy-panel";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductHighlights } from "@/components/shop/product-highlights";
import { ProductTabs } from "@/components/shop/product-tabs";
import type { ShopProduct } from "@/lib/shop";

export function ProductDetail({ product }: { product: ShopProduct }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ProductBreadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.category, href: "/shop" },
          { label: product.name },
        ]}
      />

      {/* Gallery + buy info — no heavy outer card; borders on inner pieces */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          alt={product.name}
          inStock={product.stockStatus !== "out_of_stock"}
        />

        <div className="flex flex-col gap-6">
          <ProductBuyPanel product={product} />
          <ProductHighlights highlights={product.highlights} />
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
