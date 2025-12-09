"use client";

import { useSidebarContext } from "@/lib/contexts/sidebar-context";

export function useSidebar() {
  return useSidebarContext();
}
