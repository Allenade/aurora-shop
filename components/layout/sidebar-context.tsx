"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
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

function sidebarEventName(storageKey: string) {
  return `aurora-sidebar:${storageKey}`;
}

function subscribeCollapsed(storageKey: string, onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) onStoreChange();
  };
  const onLocal = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(sidebarEventName(storageKey), onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(sidebarEventName(storageKey), onLocal);
  };
}

function getCollapsedSnapshot(storageKey: string) {
  return window.localStorage.getItem(storageKey) === "1";
}

function writeCollapsed(storageKey: string, value: boolean) {
  window.localStorage.setItem(storageKey, value ? "1" : "0");
  window.dispatchEvent(new Event(sidebarEventName(storageKey)));
}

export function SidebarProvider({
  children,
  storageKey = "aurora-sidebar-collapsed",
}: SidebarProviderProps) {
  const collapsed = useSyncExternalStore(
    (onStoreChange) => subscribeCollapsed(storageKey, onStoreChange),
    () => getCollapsedSnapshot(storageKey),
    () => false,
  );

  const setCollapsed = useCallback(
    (value: boolean) => {
      writeCollapsed(storageKey, value);
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    writeCollapsed(storageKey, !getCollapsedSnapshot(storageKey));
  }, [storageKey]);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
