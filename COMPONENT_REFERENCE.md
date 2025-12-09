# Component Reference Guide
## Quick Visual Reference for All New Components

This document provides a quick visual reference for all components being created or modified in the UI/UX overhaul.

---

## Component Status Legend

- **[NEW]** - Component to be created
- **[MODIFY]** - Existing component to be enhanced
- **[ENHANCE]** - Existing component with visual improvements only

---

## 1. Layout Components

### Sidebar [NEW]
**File:** `components/layout/sidebar.tsx`
**Priority:** P0 (Must Have)

```
┌─────────────────────────┐
│  📅 SocialScheduler     │ <- Logo
├─────────────────────────┤
│  🏠 Dashboard           │ <- Nav item (active: highlighted)
│  ✨ AI Generator        │
│  📅 Schedule            │
│  📊 Analytics           │
│  ⚙️  Settings            │
├─────────────────────────┤
│ CONNECTED ACCOUNTS      │ <- Section header
│  🔴 TikTok              │ <- Platform indicators
│  🔵 LinkedIn            │
│  ⚫ Twitter             │
└─────────────────────────┘
```

**Props:**
- None (uses pathname for active state)

**Key Features:**
- Platform color indicators
- Active page highlighting with left border
- Collapsible on mobile
- Hover tooltips

---

### TopBar [NEW]
**File:** `components/layout/top-bar.tsx`
**Priority:** P0 (Must Have)

```
┌─────────────────────────────────────────────────────────────┐
│ [≡]  [Search posts... ⌘K]    [🔔] [🌙] [👤]                │
│ ^    ^                         ^     ^    ^                  │
│ Menu Search                    Bell  Theme User              │
│(mobile)                        (P1)  Toggle Avatar           │
└─────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
{
  user: {
    name?: string | null;
    email?: string | null;
  }
}
```

**Key Features:**
- Sticky positioning
- Backdrop blur effect
- Responsive (menu button on mobile)
- User dropdown with profile/settings/signout

---

### AppLayout [NEW]
**File:** `components/layout/app-layout.tsx`
**Priority:** P0 (Must Have)

```
┌─────────────┬───────────────────────────────────────┐
│   Sidebar   │         TopBar                        │
│             ├───────────────────────────────────────┤
│             │                                       │
│             │         Main Content Area             │
│             │         (children)                    │
│             │                                       │
│             │                                       │
└─────────────┴───────────────────────────────────────┘
```

**Props:**
```typescript
{
  children: React.ReactNode
}
```

**Usage:**
```typescript
// In app/(dashboard)/layout.tsx
<AppLayout>
  {children} // Dashboard/Schedule/Analytics pages
</AppLayout>
```

---

## 2. Theme Components

### ThemeProvider [NEW]
**File:** `components/theme/theme-provider.tsx`
**Priority:** P0 (Must Have)

**Purpose:** Wraps entire app to provide theme context

**Props:**
```typescript
{
  attribute: "class";
  defaultTheme: "system" | "light" | "dark";
  enableSystem: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}
```

**Usage:**
```typescript
// In app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

---

### ThemeToggle [NEW]
**File:** `components/theme/theme-toggle.tsx`
**Priority:** P0 (Must Have)

```
Light Mode:  [☀️]  ->  Click  ->  Dark Mode:  [🌙]
```

**Props:** None

**Key Features:**
- Smooth icon transition
- Persists to localStorage
- Accessible (aria-label)
- Shows sun icon in light mode, moon in dark mode

---

## 3. Dashboard Components

### AiGeneratorCard [NEW]
**File:** `components/dashboard/ai-generator-card.tsx`
**Priority:** P0 (Must Have)

```
┌────────────────────────────────────────────────────┐
│ ✨ AI Content Generator                            │ <- Gradient header
├────────────────────────────────────────────────────┤
│ Platform: [Twitter ▼]                              │
│ Tone:     [Engaging ▼]                             │
│ Prompt:   [___________________________]            │
│           [                           ]            │
│           [       Generate ✨         ]            │ <- CTA button
├────────────────────────────────────────────────────┤
│ Generated Content:              [🔄 Regenerate]    │
│ ┌────────────────────────────────────────────┐    │
│ │ Here's your AI-generated content...        │    │
│ │                                            │    │
│ └────────────────────────────────────────────┘    │
│ 127 / 280 characters                              │
├────────────────────────────────────────────────────┤
│ Previous Versions:                                 │
│ • Version 3: "Check out this amazing..." 10:30am  │
│ • Version 2: "Here's a quick tip..." 10:28am      │
└────────────────────────────────────────────────────┘
```

**Props:**
```typescript
{
  onGenerate?: (content: string) => void; // Optional callback
}
```

**Key Features:**
- Platform-specific character limits
- Real-time character counter
- Regenerate button
- History of last 5 generations
- Loading animations (typing effect, sparkles)

---

### MediaPreviewModal [NEW]
**File:** `components/dashboard/media-preview-modal.tsx`
**Priority:** P1 (Should Have)

```
┌─────────────────────────────────────────┐
│  Media Preview                     [X]  │
├─────────────────────────────────────────┤
│                                         │
│        [      Image/Video       ]       │
│        [      Preview Here      ]       │
│                                         │
│  File: image.jpg                        │
│  Size: 2.3 MB                           │
│  Dimensions: 1920x1080                  │
│                                         │
│  [         Use This Media        ]      │
└─────────────────────────────────────────┘
```

**Props:**
```typescript
{
  mediaUrl: string;
  mediaType: "image" | "video";
  isOpen: boolean;
  onClose: () => void;
}
```

**Key Features:**
- Full-screen overlay
- Video playback controls
- Image zoom capability
- ESC key to close
- Blurred backdrop

---

### ConfettiAnimation [NEW]
**File:** `components/dashboard/confetti-animation.tsx`
**Priority:** P1 (Should Have)

```
Visual: Confetti particles bursting from both sides of screen
Colors: Platform-specific (TikTok pink, LinkedIn blue, etc.)
Duration: 1.5 seconds
```

**Props:**
```typescript
{
  trigger: boolean;     // Set to true to trigger animation
  colors?: string[];    // Optional: override default colors
}
```

**Usage:**
```typescript
const [showConfetti, setShowConfetti] = useState(false);

// On successful post save:
setShowConfetti(true);
setTimeout(() => setShowConfetti(false), 2000);

<ConfettiAnimation trigger={showConfetti} colors={['#FE2C55']} />
```

**Key Features:**
- Non-blocking (doesn't prevent user actions)
- Respects prefers-reduced-motion
- Can be disabled in settings

---

### GenerationHistory [NEW]
**File:** `components/dashboard/generation-history.tsx`
**Priority:** P1 (Should Have)

```
┌────────────────────────────────────────┐
│ Previous Versions                      │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ "Check out this amazing..."        │ │ <- Clickable
│ │ Generated at 10:30am               │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ "Here's a quick tip..."            │ │
│ │ Generated at 10:28am               │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Props:**
```typescript
{
  versions: GeneratedContent[];
  onRestore: (content: string) => void;
}

interface GeneratedContent {
  content: string;
  timestamp: Date;
}
```

---

## 4. Calendar Components

### CalendarView [MODIFY]
**File:** `components/calendar/calendar-view.tsx`
**Priority:** P0 (Must Have)

**Changes:**
- Add drag-and-drop functionality
- Enhance platform color coding
- Add drop zone highlights
- Improve mobile layout

```
┌──────────────────────────────────────────────────────┐
│  November 2025         [Today] [<] [>]               │
├──────────────────────────────────────────────────────┤
│ Sun   Mon   Tue   Wed   Thu   Fri   Sat             │
├──────────────────────────────────────────────────────┤
│       │  1  │  2  │  3  │  4  │  5  │  6            │
│       │     │ 📱  │     │ 📱  │     │                │ <- Posts (draggable)
├──────────────────────────────────────────────────────┤
│  7    │  8  │  9  │ 10  │ 11  │ 12  │ 13            │
│       │ 💼  │     │ 📱  │     │ 💼  │                │
│       │     │     │ 💼  │     │     │                │
├──────────────────────────────────────────────────────┤
│ Legend: 🔴 TikTok  🔵 LinkedIn  ⚫ Twitter           │
└──────────────────────────────────────────────────────┘
```

**New Props:**
```typescript
{
  posts: Post[];
  onDateClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
  onPostDrop?: (postId: string, newDate: Date) => Promise<void>; // NEW
}
```

---

### DraggableEvent [NEW]
**File:** `components/calendar/draggable-event.tsx`
**Priority:** P0 (Must Have)

```
Normal State:  [📱 Check out this...]
Dragging:      [📱 Check out this...] <- 50% opacity, follows cursor
```

**Props:**
```typescript
{
  post: Post;
  onClick: () => void;
}
```

**Key Features:**
- Platform color background
- Cursor changes to grab/grabbing
- Opacity reduces when dragging
- Works on touch devices

---

### CalendarViewToggle [NEW - Phase 2]
**File:** `components/calendar/calendar-view-toggle.tsx`
**Priority:** P2 (Could Have)

```
┌────────────────────────────┐
│ [ Day ] [ Week ] [Month] ✓ │ <- Button group
└────────────────────────────┘
```

**Props:**
```typescript
{
  currentView: "day" | "week" | "month";
  onChange: (view: "day" | "week" | "month") => void;
}
```

---

## 5. Analytics Components

### EngagementLineChart [NEW]
**File:** `components/analytics/engagement-line-chart.tsx`
**Priority:** P0 (Must Have)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   800 ┤                             ╱───╲         │ <- Views (blue)
│   600 ┤                    ╱───╲  ╱      ╲        │
│   400 ┤          ╱───╲   ╱      ╲╱        ╲       │ <- Likes (red)
│   200 ┤    ╱───╲╱      ╲╱                  ╲      │
│     0 ┼────────────────────────────────────────   │
│       Nov 1   Nov 8   Nov 15  Nov 22  Nov 29     │
│                                                    │
│  Legend: ─── Views  ─── Likes  ─── Comments       │
└────────────────────────────────────────────────────┘
```

**Props:**
```typescript
{
  data: AnalyticsDataPoint[];
}

interface AnalyticsDataPoint {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}
```

**Key Features:**
- Interactive tooltips on hover
- Responsive (scales to container)
- Smooth animations on load
- Click data point for details

---

### MetricCardWithTrend [NEW]
**File:** `components/analytics/metric-card-with-trend.tsx`
**Priority:** P0 (Must Have)

```
┌────────────────────────────┐
│ Total Views          👁️    │ <- Icon
│ 12,456               │
│ ↗ +12.3% from last period │ <- Trend (green if positive)
└────────────────────────────┘
```

**Props:**
```typescript
{
  label: string;
  value: number;
  trend: number; // percentage
  icon: React.ReactNode;
  formatter?: (value: number) => string;
}
```

**Key Features:**
- Large value display (2xl font)
- Trend indicator with arrow
- Color-coded trend (green=positive, red=negative)
- Mini sparkline on hover (Phase 2)

---

### PlatformBarChart [NEW]
**File:** `components/analytics/platform-bar-chart.tsx`
**Priority:** P1 (Should Have)

```
┌────────────────────────────────────────┐
│                                        │
│ TikTok     ████████████░░░░░░  45     │ <- Pink bar
│ LinkedIn   ███████░░░░░░░░░░░  30     │ <- Blue bar
│ Twitter    ██████░░░░░░░░░░░░  25     │ <- Black bar
│                                        │
└────────────────────────────────────────┘
```

**Props:**
```typescript
{
  data: PlatformStats[];
}

interface PlatformStats {
  platform: string;
  count: number;
}
```

---

### DateRangeFilter [NEW]
**File:** `components/analytics/date-range-filter.tsx`
**Priority:** P0 (Must Have)

```
┌─────────────────────────────────────┐
│ Date Range: [Last 30 days ▼]       │
│                                     │
│ Preset Options:                     │
│ • Last 7 days                       │
│ • Last 30 days                      │
│ • Last 3 months                     │
│ • Custom range... (Phase 2)         │
└─────────────────────────────────────┘
```

**Props:**
```typescript
{
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: PresetOption[];
}

interface DateRange {
  start: Date;
  end: Date;
}
```

---

## 6. Common Components

### LoadingSkeleton [NEW]
**File:** `components/common/loading-skeleton.tsx`
**Priority:** P1 (Should Have)

```
Card Variant:
┌────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░   │ <- Shimmer effect
│ ███░░░░░░░░░░░░░░░░░░░░░   │
│                            │
│ ████░░░░░░░░░  ███░░░░░░   │
└────────────────────────────┘

Line Variant:
████████████░░░░░░░░░░░░░
████████░░░░░░░░░░░░░░░░░

Circle Variant:
 ████
█░░░░█
█░░░░█
 ████
```

**Props:**
```typescript
{
  variant: "card" | "line" | "circle" | "chart";
  count?: number;
  className?: string;
}
```

---

### EmptyState [NEW]
**File:** `components/common/empty-state.tsx`
**Priority:** P1 (Should Have)

```
┌──────────────────────────────────────┐
│                                      │
│           [   Large Icon   ]         │
│                                      │
│        No posts yet                  │ <- Title
│                                      │
│  Get started by creating your first  │ <- Description
│  social media post.                  │
│                                      │
│      [  Create Your First Post  ]    │ <- CTA button
│                                      │
└──────────────────────────────────────┘
```

**Props:**
```typescript
{
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}
```

---

### Tooltip [NEW]
**File:** `components/common/tooltip.tsx`
**Priority:** P1 (Should Have)

```
                ┌─────────────────┐
                │ Tooltip content │
                └────────┬────────┘
                         │
                    [  Button  ] <- Trigger element
```

**Props:**
```typescript
{
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
```

**Usage:**
```typescript
<Tooltip content="Schedule this post" side="top">
  <Button>Schedule</Button>
</Tooltip>
```

---

## 7. Modified Components

### PostForm [MODIFY]
**File:** `components/post/post-form.tsx`
**Priority:** P0 (Must Have)

**Changes:**
1. Integrate AiGeneratorCard at top
2. Add MediaPreviewModal for uploads
3. Trigger ConfettiAnimation on success
4. Improve loading states

**New Usage:**
```typescript
<PostForm onSubmit={handleSubmit} />
// Internally handles:
// - AI generation
// - Media preview
// - Confetti on success
```

---

## Component Dependency Tree

```
App (layout.tsx)
└── ThemeProvider
    ├── (auth) pages
    │   ├── /login
    │   └── /signup
    │
    └── (dashboard) - AppLayout
        ├── Sidebar
        ├── TopBar
        │   ├── ThemeToggle
        │   └── UserDropdown
        │
        └── Pages
            ├── Dashboard
            │   ├── DashboardStats
            │   └── AiGeneratorCard
            │       ├── GenerationHistory
            │       └── LoadingSkeleton
            │
            ├── Schedule
            │   ├── CalendarView (with DnD)
            │   │   └── DraggableEvent
            │   ├── PostForm
            │   │   ├── AiGeneratorCard
            │   │   ├── MediaPreviewModal
            │   │   └── ConfettiAnimation
            │   └── EmptyState
            │
            └── Analytics
                ├── DateRangeFilter
                ├── PlatformFilter
                ├── MetricCardWithTrend
                ├── EngagementLineChart
                └── PlatformBarChart
```

---

## Import Paths Quick Reference

```typescript
// Layout
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { AppLayout } from "@/components/layout/app-layout";

// Theme
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Dashboard
import { AiGeneratorCard } from "@/components/dashboard/ai-generator-card";
import { MediaPreviewModal } from "@/components/dashboard/media-preview-modal";
import { ConfettiAnimation } from "@/components/dashboard/confetti-animation";
import { GenerationHistory } from "@/components/dashboard/generation-history";

// Calendar
import { CalendarView } from "@/components/calendar/calendar-view";
import { DraggableEvent } from "@/components/calendar/draggable-event";
import { CalendarViewToggle } from "@/components/calendar/calendar-view-toggle";

// Analytics
import { EngagementLineChart } from "@/components/analytics/engagement-line-chart";
import { MetricCardWithTrend } from "@/components/analytics/metric-card-with-trend";
import { PlatformBarChart } from "@/components/analytics/platform-bar-chart";
import { DateRangeFilter } from "@/components/analytics/date-range-filter";

// Common
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Tooltip } from "@/components/common/tooltip";

// Constants
import { PLATFORM_COLORS, getPlatformColor } from "@/lib/constants/platform-colors";
```

---

## Color Reference

### Primary Colors
```css
--primary-500: #6366f1  /* Indigo - Main brand color */
--primary-600: #4f46e5  /* Indigo darker - Hover states */
```

### Platform Colors
```css
--tiktok-500: #FE2C55   /* Pink */
--linkedin-500: #0077B5 /* Blue */
--twitter-500: #000000  /* Black */
```

### Semantic Colors
```css
--success: #10b981   /* Green */
--error: #ef4444     /* Red */
--warning: #f59e0b   /* Orange */
--info: #3b82f6      /* Blue */
```

---

## Animation Reference

### CSS Animations (Tailwind)
```css
.animate-fade-in     /* 0.3s fade in */
.animate-slide-in    /* 0.3s slide from top */
.animate-scale-in    /* 0.2s scale from 95% */
.animate-shimmer     /* 2s shimmer effect (skeletons) */
```

### Framer Motion Animations
```typescript
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}

// Slide in
initial={{ y: -20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.3 }}

// Scale
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

---

## Testing Checklist Per Component

For each component, verify:
- [ ] Renders without errors
- [ ] Props work as expected
- [ ] Dark mode styling correct
- [ ] Mobile responsive
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Screen reader compatible (aria-labels)
- [ ] Loading states display
- [ ] Error states display
- [ ] Animations smooth (60fps)
- [ ] Respects prefers-reduced-motion

---

## Questions?

Refer to:
1. **PRODUCT_REQUIREMENTS.md** - Full user stories and acceptance criteria
2. **TECHNICAL_IMPLEMENTATION_GUIDE.md** - Code examples and patterns
3. **UI_UX_OVERHAUL_SUMMARY.md** - Executive overview

---

**Happy Building!**
