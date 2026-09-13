"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "text-sm font-semibold",
          description: "text-sm text-[#6b7280]",
        },
      }}
    />
  );
}
