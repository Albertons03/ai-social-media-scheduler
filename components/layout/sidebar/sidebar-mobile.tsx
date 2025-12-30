"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { SidebarFooter } from "./sidebar-footer";

interface MobileSidebarProps {
  user: {
    id: string;
    email?: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
      tier?: string;
    };
  };
}

export function MobileSidebar({ user }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                LB
              </div>
              <span className="font-semibold text-lg">LandingBits</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav isCollapsed={false} user={user} />
          </div>

          {/* Footer */}
          <SidebarFooter user={user} isCollapsed={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
