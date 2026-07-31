"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  inStock?: boolean;
};

export function ProductGallery({
  images,
  alt,
  inStock = true,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0]!;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#f7f7f7]">
        <Image
          src={current}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {inStock ? (
          <span className="absolute top-3 right-3 rounded-full bg-[#1f9d57] px-3 py-1 text-xs font-semibold text-white">
            In Stock
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-1.5" aria-hidden>
        {images.map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full",
              active === index ? "bg-aurora-ink" : "bg-[#d4d4d4]",
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative size-[72px] overflow-hidden rounded-lg border bg-[#f7f7f7] transition-colors sm:size-20",
              active === index
                ? "border-aurora-ink"
                : "border-[#e0e0e0] hover:border-[#cfcfcf]",
            )}
            aria-label={`View image ${index + 1}`}
            aria-pressed={active === index}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
