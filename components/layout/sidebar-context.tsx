"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
  children: ReactNode;
  /** Persist collapse separately for buyer vs admin shells. */
  storageKey?: string;
};

export function SidebarProvider({
  children,
  storageKey = "aurora-sidebar-collapsed",
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "1") setCollapsedState(true);
    setReady(true);
  }, [storageKey]);

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedState(value);
      window.localStorage.setItem(storageKey, value ? "1" : "0");
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      window.localStorage.setItem(storageKey, next ? "1" : "0");
      return next;
    });
  }, [storageKey]);

  // Avoid hydration mismatch flash — render expanded until client reads storage
  const value = {
    collapsed: ready ? collapsed : false,
    toggle,
    setCollapsed,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
