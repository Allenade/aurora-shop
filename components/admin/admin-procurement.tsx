'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminProcurementDetailDrawer } from '@/components/admin/admin-procurement-detail-drawer';
import { Badge } from '@/components/ui/badge';
import {
  type AdminProcurementRequest,
  type AdminProcurementStatus,
} from '@/lib/admin';
import { BffRequestError } from '@/lib/bff/client';
import { bffCall } from '@/lib/bff/generated/client';
import { quoteApiStatus, toAdminProcurement } from '@/lib/bff/map';
import type { RecentQuote } from '@/lib/procurements';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;
const FILTERS = [
  'All Requests',
  'Approved',
  'Under Review',
  'Pending',
  'Draft',
  'Rejected',
] as const;

type QuotesListResponse = {
  items: Array<RecentQuote & { internalId?: string }>;
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  awaitingReview?: number;
};

function statusQueryParam(filter: (typeof FILTERS)[number]) {
  if (filter === 'Approved') return 'approved';
  if (filter === 'Under Review') return 'under_review';
  if (filter === 'Pending') return 'pending';
  if (filter === 'Draft') return 'draft';
  if (filter === 'Rejected') return 'rejected';
  return undefined;
}

function statusTone(status: AdminProcurementStatus) {
  if (status === 'Approved') return 'green' as const;
  if (status === 'Under Review') return 'blue' as const;
  if (status === 'Rejected') return 'red' as const;
  if (status === 'Draft') return 'gray' as const;
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
            disabled={request.status === 'Approved' || request.status === 'Draft'}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Approve ${request.id}`}
          >
            <ApproveIcon />
          </button>
        </div>
      </td>
    </tr>
  );
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

export function AdminProcurement() {
  const [requests, setRequests] = useState<AdminProcurementRequest[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Requests');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [awaitingReview, setAwaitingReview] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

    void bffCall<QuotesListResponse>('listQuotes', {
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
        const rows = Array.isArray(res) ? res : paginated ? res.items : [];
        const nextPageCount = paginated
          ? Math.max(1, res.pageCount ?? 1)
          : 1;
        setRequests(rows.map((row) => toAdminProcurement(row)));
        if (paginated) {
          setTotal(res.total ?? rows.length);
          setPageCount(nextPageCount);
          setAwaitingReview(res.awaitingReview ?? 0);
        } else {
          setTotal(rows.length);
          setPageCount(1);
          setAwaitingReview(
            rows.filter(
              (row) => row.status === 'Pending' || row.status === 'Under Review',
            ).length,
          );
        }
        setFetchState({ key, error: null });
        setPage((current) => (current > nextPageCount ? nextPageCount : current));
      })
      .catch((err) => {
        if (cancelled) return;
        setRequests([]);
        setTotal(0);
        setPageCount(1);
        setAwaitingReview(0);
        setFetchState({
          key,
          error:
            err instanceof BffRequestError
              ? err.message
              : 'Unable to load procurement requests from the API.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [fetchKey, debouncedQuery, filter, page, reloadKey]);

  const currentPage = Math.min(page, pageCount);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd =
    total === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + requests.length, total);
  const pagerButtons = useMemo(
    () => buildPageItems(currentPage, pageCount),
    [currentPage, pageCount],
  );

  const selectedRequest =
    selectedId === null
      ? null
      : (requests.find((request) => request.id === selectedId) ?? null);

  function updateStatus(id: string, status: AdminProcurementStatus) {
    const current = requests.find((request) => request.id === id);
    if (!current?.internalId) {
      setFetchState((prev) => ({
        key: prev.key,
        error: 'Unable to update quote status — missing internal id.',
      }));
      return;
    }
    void bffCall('setQuoteStatus', {
      params: { id: current.internalId },
      body: { status: quoteApiStatus(status) },
    })
      .then(() => {
        setRequests((prev) =>
          prev.map((request) => (request.id === id ? { ...request, status } : request)),
        );
        setReloadKey((key) => key + 1);
      })
      .catch((err) => {
        setFetchState((prev) => ({
          key: prev.key,
          error:
            err instanceof BffRequestError
              ? err.message
              : 'Unable to update quote status.',
        }));
      });
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

      {error ? (
        <p
          className="mb-4 rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mb-4 text-sm text-[#8a8a8a]">Loading procurement requests…</p>
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
            placeholder="Search Institution or contact"
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
              {requests.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-[#8a8a8a]">
                    No procurement requests match this search.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
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

        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#8a8a8a]">
            Showing {rangeStart}-{rangeEnd} of {total} requests
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
              className="h-9 rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
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
