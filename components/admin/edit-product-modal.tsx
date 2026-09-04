'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  CATALOG_CATEGORIES,
  CATALOG_STATUS_OPTIONS,
  formatCatalogPrice,
  parseCatalogPrice,
  type CatalogProduct,
  type CatalogStatus,
} from '@/lib/admin';
import { cn } from '@/lib/utils';

const fieldClassName =
  'h-11 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30';

const EMPTY_FORM = {
  name: '',
  sku: '',
  category: CATALOG_CATEGORIES[0],
  price: '',
  stock: '',
  minStock: '20',
  status: 'IN STOCK' as CatalogStatus,
  specs: '',
};

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-[#6b7280]">
      {children}
      {required ? <span className="text-[#FF0000]"> *</span> : null}
    </label>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 16V7.5M12 7.5 8.5 11M12 7.5 15.5 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 16.5v1A2.5 2.5 0 0 0 8 20h8a2.5 2.5 0 0 0 2.5-2.5v-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type EditFormState = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  minStock: string;
  status: CatalogStatus;
  specs: string;
};

function toFormState(product: CatalogProduct): EditFormState {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: parseCatalogPrice(product.priceLabel),
    stock: String(product.stock),
    minStock: String(product.minStock),
    status: product.status,
    specs: product.specs ?? product.description,
  };
}

type EditProductModalProps = {
  mode: 'edit' | 'add';
  product?: CatalogProduct;
  onClose: () => void;
  onSave: (product: CatalogProduct) => void;
};

export function EditProductModal({ mode, product, onClose, onSave }: EditProductModalProps) {
  const isAdd = mode === 'add';
  const [entered, setEntered] = useState(false);
  const [form, setForm] = useState<EditFormState>(() =>
    product ? toFormState(product) : EMPTY_FORM,
  );

  useEffect(() => {
    setForm(product ? toFormState(product) : EMPTY_FORM);
  }, [product, mode]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => setEntered(true));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  function updateField<K extends keyof EditFormState>(key: K, value: EditFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const name = form.name.trim();
    const sku = form.sku.trim();
    const specs = form.specs.trim();

    if (!name || !sku || !form.price) return;

    onSave({
      id: product?.id ?? `cp-${Date.now()}`,
      name,
      sku,
      category: form.category,
      priceLabel: formatCatalogPrice(form.price),
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      status: form.status,
      description: specs || name,
      specs,
      image: product?.image ?? '/images/auth-panel.png',
    });
  }

  return createPortal(
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label={isAdd ? 'Close add product' : 'Close edit product'}
        className={cn(
          'absolute inset-0 bg-[#111111]/35 transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className={cn(
          'relative z-10 flex max-h-[min(92dvh,820px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300',
          entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-[#ececec] px-5 py-4 sm:px-6">
          <h2
            id="product-modal-title"
            className="text-lg font-bold tracking-tight text-aurora-ink sm:text-xl"
          >
            {isAdd ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4 4 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <FieldLabel htmlFor="product-name" required>
                Product Name
              </FieldLabel>
              <input
                id="product-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={fieldClassName}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="product-sku" required>
                  SKU
                </FieldLabel>
                <input
                  id="product-sku"
                  value={form.sku}
                  onChange={(e) => updateField('sku', e.target.value)}
                  className={fieldClassName}
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <select
                  id="product-category"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={fieldClassName}
                >
                  {!CATALOG_CATEGORIES.includes(
                    form.category as (typeof CATALOG_CATEGORIES)[number],
                  ) ? (
                    <option value={form.category}>{form.category}</option>
                  ) : null}
                  {CATALOG_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="product-price" required>
                  Price (NGN)
                </FieldLabel>
                <input
                  id="product-price"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value.replace(/[^\d]/g, ''))}
                  className={fieldClassName}
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="product-stock">Current Stock</FieldLabel>
                <input
                  id="product-stock"
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => updateField('stock', e.target.value.replace(/[^\d]/g, ''))}
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="product-min-stock">Low stock threshold</FieldLabel>
                <input
                  id="product-min-stock"
                  inputMode="numeric"
                  value={form.minStock}
                  onChange={(e) => updateField('minStock', e.target.value.replace(/[^\d]/g, ''))}
                  className={fieldClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="product-status">Status</FieldLabel>
                <select
                  id="product-status"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value as CatalogStatus)}
                  className={fieldClassName}
                >
                  {CATALOG_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="product-specs">Technical Specifications</FieldLabel>
              <textarea
                id="product-specs"
                value={form.specs}
                onChange={(e) => updateField('specs', e.target.value)}
                rows={4}
                placeholder="Enter product specifications, features and technical details..."
                className="w-full resize-y rounded-lg border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
              />
            </div>

            <div>
              <FieldLabel htmlFor="product-image">Product Image</FieldLabel>
              <label
                htmlFor="product-image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafafa] px-4 py-8 text-center transition-colors hover:border-[#bdbdbd] hover:bg-[#f5f5f5]"
              >
                <span className="text-[#9a9a9a]">
                  <UploadIcon />
                </span>
                <p className="mt-3 text-sm font-medium text-aurora-ink">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-[#9a9a9a]">PNG, JPG up to 5MB</p>
                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 border-t border-[#ececec] bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#d4d4d4] bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              {isAdd ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
