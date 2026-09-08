'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { EditProductModal } from '@/components/admin/edit-product-modal';
import { RemoveProductModal } from '@/components/admin/remove-product-modal';
import {
  type CatalogProduct,
  type CatalogStatus,
} from '@/lib/admin';
import { BffRequestError } from '@/lib/bff/client';
import { bffCall } from '@/lib/bff/generated/client';
import { toCatalogProduct } from '@/lib/bff/map';
import type { ShopProduct } from '@/lib/shop';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

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

function specsFromText(text?: string) {
  if (!text?.trim()) return [] as Array<{ label: string; value: string }>;
  return text
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf(':');
      if (idx === -1) return { label: 'Notes', value: part };
      return {
        label: part.slice(0, idx).trim() || 'Notes',
        value: part.slice(idx + 1).trim(),
      };
    });
}

function buildPageItems(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current]);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | 'ellipsis'> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const page = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && page - prev > 1) items.push('ellipsis');
    items.push(page);
  }
  return items;
}

const FILTERS = ['All Products', 'In Stock', 'Low Stock', 'Critical', 'Out of Stock'] as const;

type ProductListResponse = {
  items: Array<ShopProduct & { sku?: string; minStock?: number }>;
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

function statusQueryParam(filter: (typeof FILTERS)[number]) {
  if (filter === 'In Stock') return 'in_stock';
  if (filter === 'Low Stock') return 'low_stock';
  if (filter === 'Critical') return 'critical';
  if (filter === 'Out of Stock') return 'out_of_stock';
  return undefined;
}

export function ProductCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Products');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [fetchState, setFetchState] = useState<{
    key: string | null;
    error: string | null;
  }>({ key: null, error: null });

  const fetchKey = `${debouncedQuery}\0${filter}\0${page}\0${reloadKey}`;
  const loading = fetchState.key !== fetchKey;
  const error = fetchState.key === fetchKey ? fetchState.error : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const key = fetchKey;

    void bffCall<ProductListResponse>('listProducts', {
      query: {
        q: debouncedQuery || undefined,
        status: statusQueryParam(filter),
        page: String(page),
        limit: String(PAGE_SIZE),
      },
    })
      .then((res) => {
        if (cancelled) return;
        const paginated = res && !Array.isArray(res) && Array.isArray(res.items);
        const items = Array.isArray(res) ? res : paginated ? res.items : [];
        const nextPageCount = paginated
          ? Math.max(1, res.pageCount ?? 1)
          : 1;
        setProducts(items.map((row) => toCatalogProduct(row)));
        setTotal(paginated ? (res.total ?? items.length) : items.length);
        setPageCount(nextPageCount);
        setFetchState({ key, error: null });
        setPage((current) => (current > nextPageCount ? nextPageCount : current));
      })
      .catch((err) => {
        if (cancelled) return;
        setProducts([]);
        setTotal(0);
        setPageCount(1);
        setFetchState({
          key,
          error:
            err instanceof BffRequestError
              ? err.message
              : 'Unable to load products from the API.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [fetchKey, debouncedQuery, filter, page, reloadKey]);

  const currentPage = Math.min(page, pageCount);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = total === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + products.length, total);
  const pagerButtons = useMemo(
    () => buildPageItems(currentPage, pageCount),
    [currentPage, pageCount],
  );

  const editingProduct =
    editingId === null ? null : (products.find((product) => product.id === editingId) ?? null);

  const removingProduct =
    removingId === null ? null : (products.find((product) => product.id === removingId) ?? null);

  function handleDelete(id: string) {
    void bffCall('deleteProduct', { params: { id } })
      .then(() => {
        setRemovingId(null);
        setReloadKey((key) => key + 1);
      })
      .catch((err) => {
        setFetchState((prev) => ({
          key: prev.key,
          error:
            err instanceof BffRequestError ? err.message : 'Unable to delete product.',
        }));
      });
  }

  function handleSave(next: CatalogProduct) {
    const price = Number(next.priceLabel.replace(/[^\d]/g, '')) || 0;
    const slug = next.sku
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const image = next.image || '/images/auth-panel.png';
    const payload = {
      name: next.name,
      subtitle: next.description,
      sku: next.sku,
      category: next.category,
      brand: next.category,
      price,
      quantity: next.stock,
      minStock: next.minStock,
      slug: slug || `product-${Date.now()}`,
      image,
      images: [image],
      specs: specsFromText(next.specs ?? next.description),
    };
    const exists = Boolean(editingId) && products.some((product) => product.id === next.id);
    const request = exists
      ? bffCall<ShopProduct & { sku?: string; minStock?: number }>('updateProduct', {
          params: { id: next.id },
          body: payload,
        })
      : bffCall<ShopProduct & { sku?: string; minStock?: number }>('createProduct', {
          body: payload,
        });

    setSaving(true);
    void request
      .then(() => {
        setEditingId(null);
        setIsAdding(false);
        setReloadKey((key) => key + 1);
      })
      .catch((err) => {
        setFetchState((prev) => ({
          key: prev.key,
          error:
            err instanceof BffRequestError ? err.message : 'Unable to save product.',
        }));
      })
      .finally(() => setSaving(false));
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">{total} Products in Catalog</p>
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

      {error ? (
        <p className="mb-4 rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mb-4 text-sm text-[#8a8a8a]">Loading products…</p>
      ) : null}

      {saving ? (
        <p className="mb-4 text-sm text-[#8a8a8a]">Saving product…</p>
      ) : null}

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
            placeholder="Search products, SKU, category, or description"
            className="h-11 w-full rounded-xl border border-[#e5e5e5] bg-white pr-4 pl-10 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as (typeof FILTERS)[number]);
            setPage(1);
          }}
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
              {products.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-[#8a8a8a]">
                    No products match this search.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
            Showing {rangeStart}-{rangeEnd} of {total} products
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {pagerButtons.map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-1 text-[#9a9a9a]">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={cn(
                    'inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold',
                    item === currentPage
                      ? 'bg-aurora-lime text-aurora-ink'
                      : 'border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]',
                  )}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              className="h-9 rounded-lg border border-[#e0e0e0] bg-white px-3 text-sm font-semibold text-aurora-ink hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingProduct ? (
        <EditProductModal
          key={editingProduct.id}
          mode="edit"
          product={editingProduct}
          onClose={() => setEditingId(null)}
          onSave={handleSave}
        />
      ) : null}

      {isAdding ? (
        <EditProductModal
          key="add-product"
          mode="add"
          onClose={() => setIsAdding(false)}
          onSave={handleSave}
        />
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
