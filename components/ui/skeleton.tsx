import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

/** Base shimmer block for loading placeholders. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#ebebeb]", className)}
      aria-hidden
    />
  );
}

type TableSkeletonRowsProps = {
  columns: number;
  rows?: number;
  /** Optional widths as Tailwind width classes per column (cycles if shorter). */
  cellClassName?: string;
};

/** Skeleton rows for admin/data tables (inside `<tbody>`). */
export function TableSkeletonRows({
  columns,
  rows = 6,
  cellClassName = "h-4 w-20",
}: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <tr key={row} className="border-b border-[#ececec] last:border-b-0">
          {Array.from({ length: columns }, (_, col) => (
            <td key={col} className="py-4 first:pr-4 last:pl-3 not-first:px-3">
              <Skeleton
                className={cn(
                  "max-w-full",
                  col === 0 ? "h-4 w-28" : cellClassName,
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#e5e5e5] bg-white p-3">
      <Skeleton className="aspect-[5/4] w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-auto flex items-center justify-between pt-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

type ProductGridSkeletonProps = {
  count?: number;
  view?: "grid" | "list";
};

export function ProductGridSkeleton({
  count = 6,
  view = "grid",
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
      )}
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul
      className="divide-y divide-[#ececec]"
      aria-busy="true"
      aria-label="Loading orders"
    >
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-4 py-4">
          <Skeleton className="size-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

export function ProfileFormSkeleton() {
  return (
    <div
      className="p-5 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <Skeleton className="h-6 w-48" />
      <div className="mt-6 flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-11 w-28 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function TrackResultSkeleton() {
  return (
    <div
      className="mt-6 space-y-4 rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6"
      aria-busy="true"
      aria-label="Looking up shipment"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="space-y-3 border-t border-[#f0f0f0] pt-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-3 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label="Loading overview"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#e5e5e5] bg-white p-5"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-8 w-24" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.85fr)]">
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
          <Skeleton className="mb-4 h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuyerDashboardSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#e5e5e5] bg-white p-5"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-6xl py-6"
      aria-busy="true"
      aria-label="Loading details"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div
      className="mx-auto grid w-full min-w-0 max-w-6xl gap-5 py-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)]"
      aria-busy="true"
      aria-label="Loading checkout"
    >
      <div className="space-y-4 rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-fit space-y-4 rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ProcurementPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-6xl"
      aria-busy="true"
      aria-label="Loading procurement"
    >
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
        <div className="space-y-4 rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
            <Skeleton className="mb-4 h-5 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-3 h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BillingFormSkeleton() {
  return (
    <div
      className="p-5 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading billing"
    >
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-6 h-4 w-32" />
      <Skeleton className="mt-1 h-3 w-64 max-w-full" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 2 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-[#ececec] px-3.5 py-3.5"
          >
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-4 w-28" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsFormSkeleton() {
  return (
    <div
      className="p-5 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading notifications"
    >
      <Skeleton className="h-6 w-56" />
      <ul className="mt-5 divide-y divide-[#ececec]">
        {Array.from({ length: 4 }, (_, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="h-7 w-12 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterGroupSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShopFiltersSkeleton() {
  return (
    <div
      className="flex h-fit flex-col gap-6 rounded-2xl border border-[#e5e5e5] bg-white p-5"
      aria-busy="true"
      aria-label="Loading filters"
    >
      <Skeleton className="h-5 w-20" />
      <FilterGroupSkeleton rows={5} />
      <div className="space-y-3">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="flex justify-end">
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <FilterGroupSkeleton rows={3} />
      <FilterGroupSkeleton rows={4} />
    </div>
  );
}
