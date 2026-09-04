'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { EditProductModal } from '@/components/admin/edit-product-modal';
import { RemoveProductModal } from '@/components/admin/remove-product-modal';
import {
  CATALOG_PRODUCTS,
  CATALOG_TOTAL_COUNT,
  type CatalogProduct,
  type CatalogStatus,
} from '@/lib/admin';
import { cn } from '@/lib/utils';

function statusClasses(status: CatalogStatus) {
  if (status === 'CRITICAL') return 'border-[#f0b4b4] text-[#d64545] bg-[#fff5f5]';
  if (status === 'OUT OF STOCK') return 'border-[#d4d4d4] text-[#6b7280] bg-[#f7f7f7]';
  if (status === 'IN STOCK') return 'border-[#a8dfc0] text-[#1f9d57] bg-[#f0faf4]';
  return 'border-[#f0c49a] text-[#e67a2e] bg-[#fff7ef]';
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 16.5 5 19.5l3-.5L19.2 7.8a1.5 1.5 0 0 0 0-2.1L17.3 3.8a1.5 1.5 0 0 0-2.1 0L4.5 14.5v2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 5.5 17.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.5 7.5h13M9.5 7.5V5.8A1.3 1.3 0 0 1 10.8 4.5h2.4a1.3 1.3 0 0 1 1.3 1.3V7.5M8 7.5l.7 11a1.4 1.4 0 0 0 1.4 1.3h4.8a1.4 1.4 0 0 0 1.4-1.3l.7-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function stockFillPercent(product: CatalogProduct) {
  if (product.minStock <= 0) return 0;
  return Math.min(100, Math.round((product.stock / product.minStock) * 100));
}

function stockBarTone(status: CatalogStatus) {
  if (status === 'CRITICAL') return 'bg-[#d64545]';
  if (status === 'LOW STOCK') return 'bg-[#e67a2e]';
  if (status === 'IN STOCK') return 'bg-[#22c55e]';
  return 'bg-transparent';
}

function StockCell({ product }: { product: CatalogProduct }) {
  return (
    <div className="min-w-22">
      <p className="text-sm font-semibold whitespace-nowrap text-aurora-ink">
        {product.stock}
        <span className="font-medium text-[#9a9a9a]"> / min {product.minStock}</span>
      </p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#ececec]">
        <div
          className={cn('h-full rounded-full', stockBarTone(product.status))}
          style={{ width: `${stockFillPercent(product)}%` }}
        />
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: CatalogProduct;
  onEdit: (product: CatalogProduct) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7f7f7]">
            <Image src={product.image} alt="" fill className="object-cover" sizes="44px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-aurora-ink">{product.name}</p>
            <p className="mt-0.5 truncate text-xs text-[#9a9a9a]">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">{product.sku}</td>
      <td className="px-3 py-4 text-sm text-[#6b7280]">{product.category}</td>
      <td className="px-3 py-4 text-sm font-medium whitespace-nowrap text-aurora-ink">
        {product.priceLabel}
      </td>
      <td className="px-3 py-4">
        <StockCell product={product} />
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="py-4 pl-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`Edit ${product.name}`}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#fff1f1] hover:text-[#d64545]"
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

const FILTERS = ['All Products', 'In Stock', 'Low Stock', 'Critical', 'Out of Stock'] as const;

export function ProductCatalog() {
  const [products, setProducts] = useState(CATALOG_PRODUCTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Products');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesFilter =
        filter === 'All Products' ||
        (filter === 'In Stock' && p.status === 'IN STOCK') ||
        (filter === 'Low Stock' && p.status === 'LOW STOCK') ||
        (filter === 'Critical' && p.status === 'CRITICAL') ||
        (filter === 'Out of Stock' && p.status === 'OUT OF STOCK');

      return matchesQuery && matchesFilter;
    });
  }, [products, query, filter]);

  const editingProduct =
    editingId === null ? null : (products.find((product) => product.id === editingId) ?? null);

  const removingProduct =
    removingId === null ? null : (products.find((product) => product.id === removingId) ?? null);

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setRemovingId(null);
  }

  function handleSave(next: CatalogProduct) {
    setProducts((prev) => {
      const exists = prev.some((product) => product.id === next.id);
      if (exists) {
        return prev.map((product) => (product.id === next.id ? next : product));
      }
      return [next, ...prev];
    });
    setEditingId(null);
    setIsAdding(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">{CATALOG_TOTAL_COUNT} Products in Catalog</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setIsAdding(true);
          }}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
          Add Product
        </button>
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
            placeholder="Search Products or SKU"
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
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(
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
                  <td colSpan={7} className="py-16 text-center text-sm text-[#8a8a8a]">
                    No products match this search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={(next) => {
                      setIsAdding(false);
                      setEditingId(next.id);
                    }}
                    onDelete={(id) => setRemovingId(id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#8a8a8a]">
            Showing 1-{filtered.length} of {CATALOG_TOTAL_COUNT} products
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              Previous
            </button>
            {[1, 2].map((page) => (
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
              className="h-9 rounded-lg border border-[#e0e0e0] bg-white px-3 text-sm font-semibold text-aurora-ink hover:bg-[#f7f7f7]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingProduct ? (
        <EditProductModal
          mode="edit"
          product={editingProduct}
          onClose={() => setEditingId(null)}
          onSave={handleSave}
        />
      ) : null}

      {isAdding ? (
        <EditProductModal mode="add" onClose={() => setIsAdding(false)} onSave={handleSave} />
      ) : null}

      {removingProduct ? (
        <RemoveProductModal
          product={removingProduct}
          onClose={() => setRemovingId(null)}
          onConfirm={() => handleDelete(removingProduct.id)}
        />
      ) : null}
    </div>
  );
}
