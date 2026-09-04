'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';
import type { AdminProcurementRequest, AdminProcurementStatus } from '@/lib/admin';
import { cn } from '@/lib/utils';

function statusTone(status: AdminProcurementStatus) {
  if (status === 'Approved') return 'green' as const;
  if (status === 'Under Review') return 'blue' as const;
  if (status === 'Rejected') return 'red' as const;
  return 'orange' as const;
}

function InstitutionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10 12h9.5M16.5 8.5 20 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 18.5c1-3 3.2-4.5 6.5-4.5s5.5 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m4.5 7.5 7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8" y="3.5" width="8" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 17.5h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-medium text-[#8a8a8a]">{children}</h3>;
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#eef8c8] text-[#5f7a00]">
        {icon}
      </span>
      <p className="min-w-0 text-sm font-medium text-aurora-ink">{children}</p>
    </div>
  );
}

type AdminProcurementDetailDrawerProps = {
  request: AdminProcurementRequest;
  onClose: () => void;
  onStatusChange: (status: AdminProcurementStatus) => void;
};

export function AdminProcurementDetailDrawer({
  request,
  onClose,
  onStatusChange,
}: AdminProcurementDetailDrawerProps) {
  const [entered, setEntered] = useState(false);

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

  return createPortal(
    <div className="fixed inset-0 z-80">
      <button
        type="button"
        aria-label="Close procurement request"
        className={cn(
          'absolute inset-0 bg-[#111111]/25 transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-procurement-detail-title"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-105 flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out',
          entered ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex-1 overflow-y-auto px-6 pt-7 pb-8 sm:px-7">
          <div>
            <h2
              id="admin-procurement-detail-title"
              className="text-[1.35rem] font-bold tracking-tight text-aurora-ink"
            >
              {request.id}
            </h2>
            <p className="mt-1.5 text-sm text-[#8a8a8a]">{request.submitted}</p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#ececec] pt-5">
            <Badge tone={statusTone(request.status)}>{request.status}</Badge>
            <p className="shrink-0 text-lg font-bold text-aurora-ink">{request.amount}</p>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f5f5f5] px-4 py-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-aurora-lime text-aurora-ink">
              <InstitutionIcon />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-aurora-ink">{request.institution}</p>
              <p className="mt-0.5 truncate text-sm text-[#8a8a8a]">{request.department}</p>
            </div>
          </div>

          <div className="mt-8">
            <SectionLabel>Contact Person</SectionLabel>
            <div className="mt-4 space-y-3.5">
              <ContactRow icon={<PersonIcon />}>{request.contactName}</ContactRow>
              <ContactRow icon={<MailIcon />}>{request.contactEmail}</ContactRow>
              <ContactRow icon={<PhoneIcon />}>{request.contactPhone}</ContactRow>
            </div>
          </div>

          <div className="mt-8">
            <SectionLabel>Requested Items</SectionLabel>
            <div className="mt-3 rounded-xl bg-[#f5f5f5] px-4 py-4">
              <p className="text-sm leading-relaxed text-[#6b7280]">{request.requestedItems}</p>
            </div>
          </div>

          <div className="mt-8">
            <SectionLabel>Purpose</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-aurora-ink">{request.purpose}</p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#ececec] bg-white px-6 py-4 sm:px-7">
          <button
            type="button"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#FF0000] bg-white px-4 text-sm font-semibold text-[#FF0000] transition-opacity hover:bg-[#fff1f1]"
            onClick={() => onStatusChange('Rejected')}
          >
            Reject Request
          </button>
          <button
            type="button"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#16A34A] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            onClick={() => onStatusChange('Approved')}
          >
            Approve Request
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
