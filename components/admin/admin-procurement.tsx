'use client';

import { useMemo, useState } from 'react';
import { AdminProcurementDetailDrawer } from '@/components/admin/admin-procurement-detail-drawer';
import { Badge } from '@/components/ui/badge';
import {
  ADMIN_PROCUREMENT_REQUESTS,
  type AdminProcurementRequest,
  type AdminProcurementStatus,
} from '@/lib/admin';

const FILTERS = ['All Requests', 'Approved', 'Under Review', 'Pending', 'Rejected'] as const;

function statusTone(status: AdminProcurementStatus) {
  if (status === 'Approved') return 'green' as const;
  if (status === 'Under Review') return 'blue' as const;
  if (status === 'Rejected') return 'red' as const;
  return 'orange' as const;
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 12.2 10.8 14.5 15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RequestRow({
  request,
  onOpen,
  onApprove,
}: {
  request: AdminProcurementRequest;
  onOpen: (request: AdminProcurementRequest) => void;
  onApprove: (id: string) => void;
}) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <button
          type="button"
          onClick={() => onOpen(request)}
          className="text-sm font-medium whitespace-nowrap text-[#2f6fed] hover:underline"
        >
          {request.id}
        </button>
      </td>
      <td className="px-3 py-4">
        <p className="text-sm font-semibold whitespace-nowrap text-aurora-ink">{request.contact}</p>
        <p className="mt-0.5 text-xs whitespace-nowrap text-[#9a9a9a]">{request.email}</p>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">{request.items}</td>
      <td className="px-3 py-4 text-sm font-medium whitespace-nowrap text-aurora-ink">
        {request.amount}
      </td>
      <td className="px-3 py-4">
        <Badge tone={statusTone(request.status)}>{request.status}</Badge>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">{request.date}</td>
      <td className="py-4 pl-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(request)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`View ${request.id}`}
          >
            <EyeIcon />
          </button>
          <button
            type="button"
            onClick={() => onApprove(request.id)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`Approve ${request.id}`}
          >
            <ApproveIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminProcurement() {
  const [requests, setRequests] = useState(ADMIN_PROCUREMENT_REQUESTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Requests');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesQuery =
        !q ||
        request.id.toLowerCase().includes(q) ||
        request.contact.toLowerCase().includes(q) ||
        request.email.toLowerCase().includes(q) ||
        request.items.toLowerCase().includes(q) ||
        request.institution.toLowerCase().includes(q);

      const matchesFilter = filter === 'All Requests' || request.status === filter;

      return matchesQuery && matchesFilter;
    });
  }, [requests, query, filter]);

  const selectedRequest =
    selectedId === null ? null : (requests.find((request) => request.id === selectedId) ?? null);

  const awaitingReview = requests.filter(
    (request) => request.status === 'Under Review' || request.status === 'Pending',
  ).length;

  function updateStatus(id: string, status: AdminProcurementStatus) {
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
            Procurement Requests
          </h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">Institutional bulk purchase requests</p>
        </div>

        <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#fff1e6] px-3.5 text-sm font-medium text-[#e67a2e]">
          <EyeIcon />
          {awaitingReview} Awaiting Review
        </span>
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
            placeholder="Search Institution or contact"
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
          <table className="w-full min-w-240 border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ececec]">
                {['Request ID', 'Contact', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(
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
                    No procurement requests match this search.
                  </td>
                </tr>
              ) : (
                filtered.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onOpen={(next) => setSelectedId(next.id)}
                    onApprove={(id) => updateStatus(id, 'Approved')}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest ? (
        <AdminProcurementDetailDrawer
          request={selectedRequest}
          onClose={() => setSelectedId(null)}
          onStatusChange={(status) => updateStatus(selectedRequest.id, status)}
        />
      ) : null}
    </div>
  );
}
