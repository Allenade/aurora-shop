import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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

export function ProductCard({ product }: { product: ShopProduct }) {
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

        <div className="mt-4 flex items-stretch gap-2">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-2 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            Buy Now
          </Link>
          <button
            type="button"
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-[#cfcfcf] bg-white px-2 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Card>
  );
}
