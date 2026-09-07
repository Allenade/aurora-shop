'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import type { InventoryItem } from '@/lib/admin';
import { cn } from '@/lib/utils';

function ClipboardCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4.5h6M8.5 4.5A1.5 1.5 0 0 0 7 6v13.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="9.5" y="3" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.5 13.2 11.3 15l3.7-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-[#6b7280]">{label}</p>
      <p className="text-sm font-bold text-aurora-ink">{value}</p>
    </div>
  );
}

type RestockItemModalProps = {
  item: InventoryItem;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
};

export function RestockItemModal({ item, onClose, onConfirm }: RestockItemModalProps) {
  const [entered, setEntered] = useState(false);
  const [quantity, setQuantity] = useState('');

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const amount = Number(quantity);
    if (!amount || amount < 1) return;
    onConfirm(amount);
  }

  return createPortal(
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close restock dialog"
        className={cn(
          'absolute inset-0 bg-[#111111]/35 transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restock-item-title"
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 sm:px-7 sm:py-7',
          entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        )}
      >
        <form onSubmit={handleSubmit}>
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-aurora-lime text-aurora-ink">
            <ClipboardCheckIcon />
          </span>

          <h2
            id="restock-item-title"
            className="mt-4 text-xl font-bold tracking-tight text-aurora-ink"
          >
            Restock Item
          </h2>
          <p className="mt-1 text-sm text-[#8a8a8a]">{item.name}</p>

          <div className="mt-5 space-y-3 rounded-xl bg-[#f5f5f5] px-4 py-4">
            <InfoRow label="Current Stock" value={`${item.stock} Units`} />
            <InfoRow label="Minimum Threshold" value={`${item.capacity} Units`} />
          </div>

          <div className="mt-5">
            <label
              htmlFor="restock-quantity"
              className="mb-2 block text-sm font-semibold text-aurora-ink"
            >
              Quantity to Add
            </label>
            <input
              id="restock-quantity"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Enter Quantity..."
              className="h-11 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
              required
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#1f1f1f]/25 bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
