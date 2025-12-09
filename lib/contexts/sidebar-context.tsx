"use client";

import * as React from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggle: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Load saved preference from localStorage
  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  // Save preference to localStorage
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }
  }, [isCollapsed, mounted]);

  const toggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const value = React.useMemo(
    () => ({ isCollapsed, toggle, setIsCollapsed }),
    [isCollapsed, toggle]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
