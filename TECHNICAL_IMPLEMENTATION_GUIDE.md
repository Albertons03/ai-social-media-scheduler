# Technical Implementation Guide
## UI/UX Overhaul - Developer Reference

**Version:** 1.0
**Date:** December 9, 2025
**For Developers:** This document provides code examples, architectural patterns, and implementation details.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Component Implementation Details](#component-implementation-details)
4. [State Management Patterns](#state-management-patterns)
5. [API Integration](#api-integration)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Checklist](#deployment-checklist)

---

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to project root
cd D:/ai-personal-tiktok-scheduler

# Install new dependencies
npm install @dnd-kit/core @dnd-kit/sortable canvas-confetti framer-motion recharts cmdk react-use-gesture next-themes

# Install dev dependencies
npm install --save-dev @axe-core/react

# Verify installation
npm list | grep -E '@dnd-kit|canvas-confetti|framer-motion|recharts|cmdk|react-use-gesture|next-themes'
```

### 2. Configure Tailwind for Dark Mode

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable class-based dark mode
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main brand color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        tiktok: {
          DEFAULT: '#FE2C55',
          50: '#FFF1F3',
          500: '#FE2C55',
          600: '#E0254A',
          700: '#C21E3F',
        },
        linkedin: {
          DEFAULT: '#0077B5',
          50: '#E6F4F9',
          500: '#0077B5',
          600: '#006399',
          700: '#004F7D',
        },
        twitter: {
          DEFAULT: '#000000',
          50: '#F5F5F5',
          500: '#000000',
          600: '#1a1a1a',
          700: '#333333',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3. Update Root Layout

**File:** `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Media Scheduler - AI-Powered Content Management',
  description: 'Schedule and manage your TikTok, LinkedIn, and Twitter posts with AI-powered content generation',
  keywords: ['social media', 'scheduler', 'tiktok', 'linkedin', 'twitter', 'ai', 'content management'],
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 4. Create Platform Constants

**File:** `lib/constants/platform-colors.ts`

```typescript
export const PLATFORM_COLORS = {
  tiktok: {
    primary: '#FE2C55',
    bg: '#FFF1F3',
    text: '#C21E3F',
    border: '#FE2C55',
  },
  linkedin: {
    primary: '#0077B5',
    bg: '#E6F4F9',
    text: '#004F7D',
    border: '#0077B5',
  },
  twitter: {
    primary: '#000000',
    bg: '#F5F5F5',
    text: '#333333',
    border: '#1a1a1a',
  },
} as const;

export type PlatformKey = keyof typeof PLATFORM_COLORS;

export function getPlatformColor(platform: string): typeof PLATFORM_COLORS[PlatformKey] {
  const key = platform.toLowerCase() as PlatformKey;
  return PLATFORM_COLORS[key] || PLATFORM_COLORS.twitter;
}

export function getPlatformClasses(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'tiktok':
      return 'bg-tiktok-50 text-tiktok-700 border-tiktok-500';
    case 'linkedin':
      return 'bg-linkedin-50 text-linkedin-700 border-linkedin-500';
    case 'twitter':
      return 'bg-twitter-50 text-twitter-700 border-twitter-500';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-500';
  }
}
```

---

## Architecture Overview

### Component Hierarchy

```
App
├── ThemeProvider
│   ├── (auth)
│   │   ├── /login
│   │   └── /signup
│   │
│   └── (dashboard) - Uses AppLayout
│       ├── AppLayout
│       │   ├── Sidebar
│       │   │   ├── Logo
│       │   │   ├── Navigation Items
│       │   │   └── Platform Accounts List
│       │   │
│       │   ├── TopBar
│       │   │   ├── SearchCommand
│       │   │   ├── NotificationBell
│       │   │   ├── ThemeToggle
│       │   │   └── UserDropdown
│       │   │
│       │   └── Main Content Area
│       │       ├── /dashboard
│       │       │   ├── DashboardStats
│       │       │   └── AiGeneratorCard
│       │       │
│       │       ├── /schedule
│       │       │   ├── CalendarViewToggle
│       │       │   ├── CalendarMonthView (DnD)
│       │       │   └── PostForm (with Confetti)
│       │       │
│       │       └── /analytics
│       │           ├── DateRangeFilter
│       │           ├── PlatformFilter
│       │           ├── MetricCardWithTrend
│       │           ├── EngagementLineChart
│       │           └── PlatformBarChart
│       │
│       └── Toaster (Global)
```

### State Management Strategy

**Local State (useState):**
- Component UI state (modals open/closed, form inputs)
- Temporary data (search queries, filter selections)

**Server State (React Server Components + Client hydration):**
- User data, posts, analytics (fetched server-side)
- Client components refetch via API routes

**URL State (searchParams):**
- Analytics filters (date range, platform)
- Calendar view mode (day/week/month)

**Local Storage:**
- Theme preference
- Calendar view preference
- User preferences (animations enabled)

**No global state library needed** (keeping it simple per Next.js App Router patterns)

---

## Component Implementation Details

### 1. Theme System

#### ThemeProvider Component

**File:** `components/theme/theme-provider.tsx`

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### ThemeToggle Component

**File:** `components/theme/theme-toggle.tsx`

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="transition-transform hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}
```

---

### 2. Layout Components

#### Sidebar Component

**File:** `components/layout/sidebar.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlatformClasses } from "@/lib/constants/platform-colors";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and stats",
  },
  {
    label: "AI Generator",
    href: "/dashboard#ai-generator",
    icon: Sparkles,
    description: "Generate content with AI",
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: Calendar,
    description: "Manage your posts",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Track performance",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col gap-2">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold">SocialScheduler</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                title={item.description}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Platform Accounts Section */}
        <div className="border-t border-border p-4">
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
            Connected Accounts
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-tiktok-500" />
              <span>TikTok</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-linkedin-500" />
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-twitter-500" />
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

#### TopBar Component

**File:** `components/layout/top-bar.tsx`

```typescript
"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile Menu Button (shown on < md) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>

        {/* Search Bar (center) */}
        <div className="flex-1 max-w-xl">
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-muted-foreground"
            aria-label="Search posts"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search posts...</span>
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="w-full text-left">
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
```

#### AppLayout Component

**File:** `components/layout/app-layout.tsx`

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

#### Update Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`

```typescript
import { AppLayout } from "@/components/layout/app-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
```

---

### 3. Dashboard Components

#### AI Generator Card

**File:** `components/dashboard/ai-generator-card.tsx`

```typescript
"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedContent {
  content: string;
  timestamp: Date;
}

const PLATFORM_LIMITS = {
  twitter: 280,
  tiktok: 2200,
  linkedin: 3000,
};

export function AiGeneratorCard() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<keyof typeof PLATFORM_LIMITS>("twitter");
  const [tone, setTone] = useState("engaging");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [history, setHistory] = useState<GeneratedContent[]>([]);

  const characterCount = generatedContent.length;
  const characterLimit = PLATFORM_LIMITS[platform];
  const isOverLimit = characterCount > characterLimit;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    const toastId = "ai-generate";
    toast.loading("AI is crafting your content...", { id: toastId });

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform, tone, length: "medium" }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setGeneratedContent(data.content);

      // Add to history
      setHistory((prev) => [
        { content: data.content, timestamp: new Date() },
        ...prev.slice(0, 4), // Keep last 5
      ]);

      toast.success("Content generated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate content", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestore = (content: string) => {
    setGeneratedContent(content);
    toast.success("Content restored");
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Platform Selection */}
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as keyof typeof PLATFORM_LIMITS)}
          >
            <option value="twitter">Twitter (280 chars)</option>
            <option value="tiktok">TikTok (2200 chars)</option>
            <option value="linkedin">LinkedIn (3000 chars)</option>
          </Select>
        </div>

        {/* Tone Selection */}
        <div>
          <Label htmlFor="tone">Tone</Label>
          <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="engaging">Engaging</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </Select>
        </div>

        {/* Prompt Input */}
        <div>
          <Label htmlFor="prompt">What do you want to post about?</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Tips for productivity while working from home"
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>

        {/* Generated Content */}
        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label>Generated Content</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-between text-xs">
                <span className={isOverLimit ? "text-red-500 font-semibold" : "text-muted-foreground"}>
                  {characterCount} / {characterLimit} characters
                </span>
                {isOverLimit && (
                  <span className="text-red-500 font-semibold">
                    Over limit by {characterCount - characterLimit}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="pt-4 border-t">
            <Label className="text-xs text-muted-foreground">Previous Versions</Label>
            <div className="mt-2 space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded text-sm cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleRestore(item.content)}
                >
                  <p className="truncate">{item.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Confetti Animation

**File:** `components/dashboard/confetti-animation.tsx`

```typescript
"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiAnimationProps {
  trigger: boolean;
  colors?: string[];
}

export function ConfettiAnimation({ trigger, colors }: ConfettiAnimationProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 1500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors || ["#6366f1", "#8b5cf6", "#ec4899"],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors || ["#6366f1", "#8b5cf6", "#ec4899"],
      });
    }, 50);

    return () => clearInterval(interval);
  }, [trigger, colors]);

  return null; // This component doesn't render anything
}
```

---

### 4. Calendar Components

#### Draggable Event

**File:** `components/calendar/draggable-event.tsx`

```typescript
"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Post } from "@/lib/types/database.types";
import { getPlatformClasses } from "@/lib/constants/platform-colors";
import { motion } from "framer-motion";

interface DraggableEventProps {
  post: Post;
  onClick: () => void;
}

export function DraggableEvent({ post, onClick }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
    data: { post },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        text-xs px-2 py-1 rounded truncate cursor-grab active:cursor-grabbing
        ${getPlatformClasses(post.platform)}
        hover:shadow-md transition-shadow
      `}
    >
      {post.content.substring(0, 20)}...
    </motion.div>
  );
}
```

#### Enhanced Calendar View (with DnD)

**File:** `components/calendar/calendar-view.tsx` (REPLACE EXISTING)

```typescript
"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types/database.types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { DraggableEvent } from "./draggable-event";
import { toast } from "sonner";

interface CalendarViewProps {
  posts: Post[];
  onDateClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
  onPostDrop?: (postId: string, newDate: Date) => Promise<void>;
}

export function CalendarView({
  posts,
  onDateClick,
  onPostClick,
  onPostDrop,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activePost, setActivePost] = useState<Post | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (!post.scheduled_for) return false;
      return isSameDay(new Date(post.scheduled_for), date);
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !onPostDrop) {
      setActivePost(null);
      return;
    }

    const postId = active.id as string;
    const newDate = over.data.current?.date as Date;

    try {
      await onPostDrop(postId, newDate);
      toast.success(`Post rescheduled to ${format(newDate, "MMM d, yyyy")}`);
    } catch (error) {
      toast.error("Failed to reschedule post");
    } finally {
      setActivePost(null);
    }
  };

  return (
    <DndContext onDragStart={(e) => setActivePost(e.active.data.current?.post)} onDragEnd={handleDragEnd}>
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24" />;
            }

            const postsOnDay = getPostsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                data-date={day.toISOString()}
                className={`
                  h-24 border border-border rounded-lg p-2 cursor-pointer transition-all
                  ${isCurrentMonth ? "bg-card hover:bg-accent" : "bg-muted text-muted-foreground"}
                  ${isToday ? "ring-2 ring-primary-500" : ""}
                `}
                onClick={() => onDateClick?.(day)}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm font-medium mb-1 ${isToday ? "text-primary-600 font-bold" : ""}`}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="flex-1 overflow-y-auto space-y-1">
                    {postsOnDay.slice(0, 3).map((post) => (
                      <DraggableEvent
                        key={post.id}
                        post={post}
                        onClick={() => onPostClick?.(post)}
                      />
                    ))}
                    {postsOnDay.length > 3 && (
                      <div className="text-xs text-muted-foreground px-2">
                        +{postsOnDay.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-tiktok-500 rounded" />
            <span>TikTok</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-linkedin-500 rounded" />
            <span>LinkedIn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-twitter-500 rounded" />
            <span>Twitter</span>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activePost ? (
          <div className="bg-primary-100 border-2 border-primary-500 rounded px-2 py-1 text-xs">
            {activePost.content.substring(0, 20)}...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

---

### 5. Analytics Components

#### Engagement Line Chart

**File:** `components/analytics/engagement-line-chart.tsx`

```typescript
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface EngagementLineChartProps {
  data: DataPoint[];
}

export function EngagementLineChart({ data }: EngagementLineChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="shares"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### Metric Card with Trend

**File:** `components/analytics/metric-card-with-trend.tsx`

```typescript
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardWithTrendProps {
  label: string;
  value: number;
  trend: number; // percentage
  icon: React.ReactNode;
  formatter?: (value: number) => string;
}

export function MetricCardWithTrend({
  label,
  value,
  trend,
  icon,
  formatter = (v) => v.toLocaleString(),
}: MetricCardWithTrendProps) {
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatter(value)}</div>
        <div className="flex items-center text-xs mt-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## State Management Patterns

### Optimistic UI Updates

```typescript
// Example: Update UI immediately, rollback on error
const handlePostDrop = async (postId: string, newDate: Date) => {
  // 1. Store original state
  const originalPosts = [...posts];

  // 2. Update UI optimistically
  setPosts((prev) =>
    prev.map((p) =>
      p.id === postId ? { ...p, scheduled_for: newDate.toISOString() } : p
    )
  );

  try {
    // 3. Make API call
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduled_for: newDate.toISOString() }),
    });

    if (!response.ok) throw new Error("Update failed");
  } catch (error) {
    // 4. Rollback on error
    setPosts(originalPosts);
    toast.error("Failed to reschedule post");
  }
};
```

---

## Testing Strategy

### Accessibility Testing

```typescript
// Install: npm install --save-dev @axe-core/react

// app/layout.tsx (development only)
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  const React = require('react');
  const ReactDOM = require('react-dom');
  axe(React, ReactDOM, 1000);
}
```

### Component Testing

```typescript
// Example: Test ThemeToggle
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

test('toggles theme on click', () => {
  render(<ThemeToggle />);
  const button = screen.getByLabelText(/toggle theme/i);

  fireEvent.click(button);

  // Assert theme changed
});
```

---

## Deployment Checklist

### Pre-Launch

- [ ] Run `npm run build` locally - no errors
- [ ] Test on real devices (iOS Safari, Android Chrome)
- [ ] Run Lighthouse audit - all scores 90+
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Verify all environment variables are set in production
- [ ] Test dark mode on all pages
- [ ] Verify analytics tracking is working
- [ ] Test drag-and-drop on touch devices
- [ ] Verify confetti animation works
- [ ] Check bundle size (< 300KB initial JS)

### Launch

- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Monitor analytics for adoption rates

---

## Performance Optimization Tips

### Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const EngagementLineChart = dynamic(
  () => import('@/components/analytics/engagement-line-chart'),
  { loading: () => <LoadingSkeleton variant="chart" /> }
);
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="Logo"
  width={32}
  height={32}
  priority
/>
```

---

## Troubleshooting

### Common Issues

**Issue:** Dark mode flickers on page load
**Solution:** Use `suppressHydrationWarning` in html tag, set `disableTransitionOnChange={false}` in ThemeProvider

**Issue:** Drag-and-drop not working on mobile
**Solution:** Ensure @dnd-kit/core is latest version, add touch-action: none to draggable elements

**Issue:** Recharts not rendering
**Solution:** Wrap in ResponsiveContainer, ensure parent has defined height

**Issue:** Confetti lags on low-end devices
**Solution:** Reduce particle count, check prefers-reduced-motion

---

## Next Steps

1. Complete Phase 1: Theme & Layout (Weeks 1-2)
2. Conduct mid-sprint review with stakeholders
3. Begin Phase 2: Dashboard Experience (Weeks 3-4)
4. Schedule user testing sessions
5. Iterate based on feedback

---

**For questions or support, contact the development team.**
