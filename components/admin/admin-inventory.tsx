'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { RestockItemModal } from '@/components/admin/restock-item-modal';
import {
  formatInventoryRestockDate,
  INVENTORY_ITEMS,
  INVENTORY_TOTAL_COUNT,
  resolveInventoryStatus,
  type CatalogStatus,
  type InventoryItem,
} from '@/lib/admin';
import { cn } from '@/lib/utils';

const FILTERS = ['All Status', 'Critical', 'Out of Stock', 'In Stock', 'Low Stock'] as const;

function statusClasses(status: CatalogStatus) {
  if (status === 'CRITICAL') return 'border-[#f0b4b4] text-[#d64545] bg-[#fff5f5]';
  if (status === 'OUT OF STOCK') return 'border-[#d4d4d4] text-[#6b7280] bg-[#f7f7f7]';
  if (status === 'IN STOCK') return 'border-[#a8dfc0] text-[#1f9d57] bg-[#f0faf4]';
  return 'border-[#f0c49a] text-[#e67a2e] bg-[#fff7ef]';
}

function stockBarTone(status: CatalogStatus) {
  if (status === 'CRITICAL') return 'bg-[#d64545]';
  if (status === 'LOW STOCK') return 'bg-[#e67a2e]';
  if (status === 'IN STOCK') return 'bg-[#22c55e]';
  return 'bg-[#d4d4d4]';
}

function StatusBadge({ status }: { status: CatalogStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase',
        statusClasses(status),
      )}
    >
      {status}
    </span>
  );
}

function StockLevelCell({ item }: { item: InventoryItem }) {
  const percent =
    item.capacity <= 0 ? 0 : Math.min(100, Math.round((item.stock / item.capacity) * 100));

  return (
    <div className="flex min-w-40 items-center gap-3">
      <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-[#ececec] sm:w-28">
        <div
          className={cn('h-full rounded-full', stockBarTone(item.status))}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm font-medium whitespace-nowrap text-[#6b7280]">
        {item.stock}/{item.capacity}
      </p>
    </div>
  );
}

function InventoryRow({
  item,
  onRestock,
}: {
  item: InventoryItem;
  onRestock: (item: InventoryItem) => void;
}) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7f7f7]">
            <Image src={item.image} alt="" fill className="object-cover" sizes="44px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-aurora-ink">{item.name}</p>
            <p className="mt-0.5 truncate text-xs text-[#9a9a9a]">{item.description}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm text-[#6b7280]">{item.category}</td>
      <td className="px-3 py-4">
        <StockLevelCell item={item} />
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">{item.lastRestocked}</td>
      <td className="px-3 py-4">
        <StatusBadge status={item.status} />
      </td>
      <td className="py-4 pl-3">
        <button
          type="button"
          onClick={() => onRestock(item)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          Restock
        </button>
      </td>
    </tr>
  );
}

export function AdminInventory() {
  const [items, setItems] = useState(INVENTORY_ITEMS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Status');
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesFilter =
        filter === 'All Status' ||
        (filter === 'Critical' && item.status === 'CRITICAL') ||
        (filter === 'Out of Stock' && item.status === 'OUT OF STOCK') ||
        (filter === 'In Stock' && item.status === 'IN STOCK') ||
        (filter === 'Low Stock' && item.status === 'LOW STOCK');

      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  const restockingItem =
    restockingId === null ? null : (items.find((item) => item.id === restockingId) ?? null);

  function handleRestock(quantity: number) {
    if (!restockingId) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== restockingId) return item;
        const stock = Math.min(item.capacity, item.stock + quantity);
        return {
          ...item,
          stock,
          lastRestocked: formatInventoryRestockDate(),
          status: resolveInventoryStatus(stock, item.capacity),
        };
      }),
    );
    setRestockingId(null);
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Inventory Management
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">Track stock levels and manage restocking</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9a9a9a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M16.5 16.5 20 20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or SKU"
            className="h-11 w-full rounded-xl border border-[#e5e5e5] bg-white pr-4 pl-10 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof FILTERS)[number])}
          className="h-11 rounded-xl border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-aurora-ink outline-none focus:border-aurora-ink/30"
        >
          {FILTERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="overflow-x-auto px-5 sm:px-6">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ececec]">
                {['Product', 'Category', 'Stock Level', 'Last Restocked', 'Status', 'Actions'].map(
                  (label) => (
                    <th
                      key={label}
                      className="py-3.5 text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase first:pr-4 last:pl-3 not-first:px-3"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-[#8a8a8a]">
                    No inventory items match this search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    onRestock={(next) => setRestockingId(next.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#8a8a8a]">
            Showing 1-{filtered.length} of {INVENTORY_TOTAL_COUNT} products
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold',
                  page === 1
                    ? 'bg-aurora-lime text-aurora-ink'
                    : 'border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]',
                )}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-[#9a9a9a]">…</span>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e0e0e0] text-sm font-semibold text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              11
            </button>
            <button
              type="button"
              className="h-9 rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {restockingItem ? (
        <RestockItemModal
          item={restockingItem}
          onClose={() => setRestockingId(null)}
          onConfirm={handleRestock}
        />
      ) : null}
    </div>
  );
}
