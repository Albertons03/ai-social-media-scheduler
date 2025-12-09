"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { SidebarNav } from "./sidebar-nav";
import { SidebarFooter } from "./sidebar-footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: {
    id: string;
    email?: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function Sidebar({ user }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b px-4">
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            AI
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              AI
            </div>
            <span className="font-semibold text-lg">PostScheduler</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Footer */}
      <SidebarFooter user={user} isCollapsed={isCollapsed} />

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent",
          "hidden md:flex items-center justify-center"
        )}
        onClick={toggle}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
