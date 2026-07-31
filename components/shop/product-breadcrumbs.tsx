import Link from "next/link";

type Crumb = { label: string; href?: string };

export function ProductBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span className="text-[#b0b0b0]" aria-hidden>
                &gt;
              </span>
            ) : null}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="font-medium text-[#6b7280] hover:text-aurora-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  last ? "font-medium text-aurora-ink" : "font-medium text-[#6b7280]"
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
