import Link from "next/link";

export function OrderDetailActions() {
  return (
    <div className="flex flex-col gap-2.5">
      <Link
        href="/shop"
        className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
      >
        Re-order All Items
      </Link>
      <Link
        href="/settings"
        className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg border border-aurora-ink/20 bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
      >
        Contact Support
      </Link>
    </div>
  );
}
