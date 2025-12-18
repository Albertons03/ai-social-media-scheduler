"use client";

import * as React from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { UserMenu } from "./user-menu";
import { MobileSidebar } from "../sidebar/sidebar-mobile";

interface TopBarProps {
  user: {
    id: string;
    email?: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-4 px-4">
        <MobileSidebar user={user} />
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
