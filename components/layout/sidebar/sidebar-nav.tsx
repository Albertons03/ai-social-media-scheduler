"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarNavProps {
  isCollapsed: boolean;
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

// Hardcoded admin emails (matching admin layout)
const ADMIN_EMAILS = [
  "matrixiscoming03@gmail.com", // Replace with actual admin email
  "admin@example.com",
];

export function SidebarNav({ isCollapsed, user }: SidebarNavProps) {
  const pathname = usePathname();

  // Check if user is admin
  const isAdmin =
    user.profile?.tier === "admin" || ADMIN_EMAILS.includes(user.email || "");

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-[#0077B5]/10 hover:text-[#0077B5]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B5]/20",
              isActive
                ? "bg-[#0077B5] text-white hover:bg-[#005885]"
                : "text-[#0077B5]",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? item.title : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
            {!isCollapsed && item.badge && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      {/* Admin Link - Only show for admins */}
      {isAdmin && (
        <>
          <div className="my-2 border-t border-border/50" />
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname.startsWith("/admin")
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "text-muted-foreground",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Admin" : undefined}
          >
            <ShieldCheck className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Admin</span>}
          </Link>
        </>
      )}
    </nav>
  );
}
