'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUser, AdminUserStatus } from '@/lib/admin';
import { cn } from '@/lib/utils';

function statusTone(status: AdminUserStatus) {
  return status === 'ACTIVE' ? ('green' as const) : ('red' as const);
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] px-4 py-4">
      <p className="text-xs text-[#8a8a8a]">{label}</p>
      <p className="mt-2 text-base font-bold text-aurora-ink">{value}</p>
    </div>
  );
}

type AdminUserDetailDrawerProps = {
  user: AdminUser;
  onClose: () => void;
  onStatusChange: (status: AdminUserStatus) => void;
};

export function AdminUserDetailDrawer({
  user,
  onClose,
  onStatusChange,
}: AdminUserDetailDrawerProps) {
  const [entered, setEntered] = useState(false);
  const isActive = user.status === 'ACTIVE';

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
        aria-label="Close user details"
        className={cn(
          'absolute inset-0 bg-[#111111]/25 transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-user-detail-title"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-100 flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out',
          entered ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="border-b border-[#ececec] px-6 py-6 sm:px-7">
          <h2
            id="admin-user-detail-title"
            className="text-xl font-bold tracking-tight text-aurora-ink"
          >
            User Details
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-7">
          <div className="flex flex-col items-center text-center">
            <Avatar initials={user.initials} className="size-16 text-lg" />
            <p className="mt-5 text-lg font-bold text-aurora-lime">{user.name}</p>
            <p className="mt-2 text-sm text-[#8a8a8a]">{user.email}</p>
            <div className="mt-4">
              <Badge tone={statusTone(user.status)}>{user.status}</Badge>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <StatCard label="Total Orders" value={String(user.orders)} />
            <StatCard label="Total Spent" value={user.totalSpent} />
            <StatCard label="Joined Since" value={user.joinedIso} />
            <StatCard label="Verified" value={user.verified ? 'Yes' : 'No'} />
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-bold text-aurora-ink">Account Actions</h3>
            <div className="mt-5 flex flex-col gap-3.5">
              <Button
                variant="lime"
                type="button"
                onClick={() => onStatusChange(isActive ? 'Suspended' : 'ACTIVE')}
              >
                {isActive ? 'Suspend Account' : 'Activate Account'}
              </Button>
              <Button variant="outline" type="button">
                Send Password Reset
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
