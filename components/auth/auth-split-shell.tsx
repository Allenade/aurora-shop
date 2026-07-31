import type { ReactNode } from "react";

type AuthSplitShellProps = {
  panel: ReactNode;
  children: ReactNode;
};

/** Split auth shell: brand panel left + white form right. */
export function AuthSplitShell({ panel, children }: AuthSplitShellProps) {
  return (
    <div className="grid h-dvh w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      {panel}
      <main className="flex h-full w-full flex-col overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
