# Phase 1 Kickoff Checklist
## Theme & Layout System (Weeks 1-2)

**Goal:** Establish the foundation for the UI overhaul with theme system and new layout

**Duration:** 2 weeks (10 working days)

**Team:** 1 Frontend Developer (full-time)

---

## Pre-Implementation Checklist

### Day 0: Setup & Preparation

- [ ] **Read Documentation**
  - [ ] Review `PRODUCT_REQUIREMENTS.md` (focus on Theme & Layout epic)
  - [ ] Review `TECHNICAL_IMPLEMENTATION_GUIDE.md` (sections 1-2)
  - [ ] Review `COMPONENT_REFERENCE.md` (layout and theme components)

- [ ] **Install Dependencies**
  - [ ] Run installation script:
    ```bash
    # On Windows:
    scripts\install-dependencies.bat

    # On Mac/Linux:
    chmod +x scripts/install-dependencies.sh
    ./scripts/install-dependencies.sh
    ```
  - [ ] Verify installation: `npm list | grep -E 'next-themes|framer-motion'`
  - [ ] Run dev server: `npm run dev`
  - [ ] Verify no errors in console

- [ ] **Create Git Branch**
  - [ ] Create feature branch: `git checkout -b feature/ui-overhaul-phase-1`
  - [ ] Push to remote: `git push -u origin feature/ui-overhaul-phase-1`

- [ ] **Set Up Development Environment**
  - [ ] Ensure Node.js 18+ is installed
  - [ ] Install browser extensions: React DevTools, axe DevTools
  - [ ] Set up ESLint and Prettier (if not already)
  - [ ] Configure VS Code settings (if using)

---

## Week 1: Theme System (Days 1-5)

### Day 1: Tailwind Configuration

**Milestone:** M1.1 - Theme System Setup (Part 1)

- [ ] **Update Tailwind Config**
  - [ ] Open `tailwind.config.ts`
  - [ ] Add `darkMode: "class"` configuration
  - [ ] Extend color palette with primary, platform colors
  - [ ] Add custom animations (fade-in, slide-in, shimmer)
  - [ ] Test: Run `npm run build` - should compile without errors

- [ ] **Create Platform Colors Constants**
  - [ ] Create file: `lib/constants/platform-colors.ts`
  - [ ] Copy implementation from Technical Guide
  - [ ] Test: Import in a test file, verify types work

- [ ] **Update Global CSS**
  - [ ] Open `app/globals.css`
  - [ ] Add CSS custom properties for light/dark themes
  - [ ] Add animation keyframes
  - [ ] Test: Start dev server, check for CSS errors

**Deliverable:** Tailwind configured for dark mode with custom colors

---

### Day 2: Theme Provider Setup

**Milestone:** M1.1 - Theme System Setup (Part 2)

- [ ] **Create ThemeProvider Component**
  - [ ] Create file: `components/theme/theme-provider.tsx`
  - [ ] Implement using `next-themes` package
  - [ ] Add TypeScript types

- [ ] **Create ThemeToggle Component**
  - [ ] Create file: `components/theme/theme-toggle.tsx`
  - [ ] Implement toggle button with Sun/Moon icons
  - [ ] Add smooth transitions
  - [ ] Handle hydration (suppressHydrationWarning)

- [ ] **Integrate Theme System**
  - [ ] Update `app/layout.tsx`
  - [ ] Wrap children with ThemeProvider
  - [ ] Add `suppressHydrationWarning` to `<html>` tag
  - [ ] Test: Toggle theme, verify it persists on reload

**Deliverable:** Functional theme toggle that persists across sessions

---

### Day 3: Update Existing Components for Dark Mode

**Milestone:** M1.1 - Theme System Setup (Part 3)

- [ ] **Audit Existing Components**
  - [ ] List all components with hardcoded colors
  - [ ] Identify components using `bg-white`, `text-gray-X`, etc.
  - [ ] Create checklist of components to update

- [ ] **Update Component Styles**
  - [ ] Replace hardcoded colors with Tailwind dark mode variants
  - [ ] Example: `bg-white` → `bg-white dark:bg-gray-900`
  - [ ] Update at least: Dashboard page, Schedule page, Analytics page
  - [ ] Test each page in both light and dark mode

- [ ] **Verify Contrast Ratios**
  - [ ] Use browser DevTools or online contrast checker
  - [ ] Ensure all text meets WCAG AA (4.5:1 for normal text)
  - [ ] Document any issues in a separate file

**Deliverable:** All existing pages support dark mode

---

### Day 4: Create Sidebar Component

**Milestone:** M1.2 - Layout Architecture (Part 1)

- [ ] **Create Sidebar Component**
  - [ ] Create file: `components/layout/sidebar.tsx`
  - [ ] Implement navigation items with icons
  - [ ] Add active state highlighting using `usePathname()`
  - [ ] Add platform accounts section at bottom
  - [ ] Style: Use platform colors for indicators

- [ ] **Add Responsive Behavior**
  - [ ] Hide sidebar on mobile (< 768px)
  - [ ] Show hamburger menu button on mobile
  - [ ] Test on various screen sizes

- [ ] **Add Accessibility**
  - [ ] Add `role="navigation"` and `aria-label`
  - [ ] Add aria-current="page" for active nav item
  - [ ] Test with keyboard navigation (Tab, Enter)

**Deliverable:** Functional sidebar with platform branding

---

### Day 5: Create TopBar Component

**Milestone:** M1.2 - Layout Architecture (Part 2)

- [ ] **Create TopBar Component**
  - [ ] Create file: `components/layout/top-bar.tsx`
  - [ ] Add logo/title on left
  - [ ] Add search placeholder in center (functional in Phase 2)
  - [ ] Add theme toggle, user avatar on right

- [ ] **Add User Dropdown Menu**
  - [ ] Use shadcn/ui DropdownMenu component
  - [ ] Add menu items: Profile, Settings, Sign out
  - [ ] Connect "Sign out" to existing `/api/auth/signout`

- [ ] **Style TopBar**
  - [ ] Make sticky (stays at top on scroll)
  - [ ] Add backdrop blur effect
  - [ ] Ensure dark mode support
  - [ ] Test on mobile and desktop

**Deliverable:** Functional top bar with theme toggle and user menu

---

## Week 2: Layout Integration (Days 6-10)

### Day 6: Create AppLayout Component

**Milestone:** M1.2 - Layout Architecture (Part 3)

- [ ] **Create AppLayout Component**
  - [ ] Create file: `components/layout/app-layout.tsx`
  - [ ] Combine Sidebar + TopBar + main content area
  - [ ] Use flexbox for layout (sidebar left, content right)
  - [ ] Handle authentication (redirect to /login if not authenticated)

- [ ] **Test Layout Structure**
  - [ ] Verify sidebar and top bar render correctly
  - [ ] Test on different screen sizes
  - [ ] Ensure content area scrolls independently

**Deliverable:** Complete layout structure

---

### Day 7: Integrate AppLayout into Dashboard

**Milestone:** M1.2 - Layout Architecture (Part 4)

- [ ] **Update Dashboard Layout**
  - [ ] Open `app/(dashboard)/layout.tsx`
  - [ ] Replace existing layout with AppLayout
  - [ ] Remove old header/navigation code

- [ ] **Test All Dashboard Routes**
  - [ ] Visit `/dashboard` - verify layout works
  - [ ] Visit `/schedule` - verify layout works
  - [ ] Visit `/analytics` - verify layout works
  - [ ] Visit `/settings` - verify layout works

- [ ] **Fix Any Styling Issues**
  - [ ] Adjust padding/margins if content is cut off
  - [ ] Ensure responsive behavior on mobile
  - [ ] Test navigation clicks (should highlight active page)

**Deliverable:** All dashboard pages use new layout

---

### Day 8: Create Common Components

**Milestone:** M1.3 - Design System Enhancement (Part 1)

- [ ] **Create LoadingSkeleton Component**
  - [ ] Create file: `components/common/loading-skeleton.tsx`
  - [ ] Implement variants: card, line, circle, chart
  - [ ] Add shimmer animation
  - [ ] Test in light and dark mode

- [ ] **Create EmptyState Component**
  - [ ] Create file: `components/common/empty-state.tsx`
  - [ ] Implement with icon, title, description, CTA
  - [ ] Test on Schedule page (when no posts exist)

- [ ] **Create Tooltip Component**
  - [ ] Create file: `components/common/tooltip.tsx`
  - [ ] Use Radix UI or shadcn/ui tooltip
  - [ ] Test keyboard accessibility

**Deliverable:** Reusable common components

---

### Day 9: Add Micro-Interactions

**Milestone:** M1.3 - Design System Enhancement (Part 2)

- [ ] **Add Hover Effects to Buttons**
  - [ ] Add `hover:scale-105` to primary buttons
  - [ ] Add shadow elevation on hover
  - [ ] Test all buttons in app

- [ ] **Add Hover Effects to Cards**
  - [ ] Add `hover:shadow-lg` transition
  - [ ] Test on dashboard stat cards

- [ ] **Add Focus States**
  - [ ] Ensure all interactive elements have visible focus ring
  - [ ] Use `focus:ring-2 focus:ring-primary-500`
  - [ ] Test with keyboard navigation

- [ ] **Add Button Press Animation**
  - [ ] Use Framer Motion for scale-down on click
  - [ ] Test on all buttons

**Deliverable:** Polished micro-interactions throughout app

---

### Day 10: Testing & Refinement

**Milestone:** Phase 1 Complete

- [ ] **Comprehensive Testing**
  - [ ] Test theme toggle on all pages
  - [ ] Test navigation on all pages
  - [ ] Test on real mobile device (iOS Safari, Android Chrome)
  - [ ] Test with keyboard only (no mouse)
  - [ ] Test with screen reader (NVDA or VoiceOver)

- [ ] **Accessibility Audit**
  - [ ] Run Lighthouse audit (aim for 90+ accessibility score)
  - [ ] Run axe DevTools extension
  - [ ] Fix all critical accessibility issues

- [ ] **Performance Check**
  - [ ] Run Lighthouse performance audit
  - [ ] Check bundle size: `npm run build` and review output
  - [ ] Ensure no console warnings or errors

- [ ] **Code Review**
  - [ ] Self-review all code changes
  - [ ] Ensure consistent code style
  - [ ] Add comments where needed
  - [ ] Remove any debug console.logs

- [ ] **Documentation**
  - [ ] Update any relevant documentation
  - [ ] Take screenshots of new layout for demo
  - [ ] Note any issues or improvements for Phase 2

**Deliverable:** Completed Phase 1, ready for stakeholder demo

---

## Definition of Done (Phase 1)

### Functional Requirements
- [ ] Dark mode toggle works on all pages
- [ ] Theme preference persists across sessions
- [ ] Sidebar navigation works correctly
- [ ] Top bar displays user info correctly
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] All existing functionality still works

### Visual Requirements
- [ ] Consistent color scheme across all pages
- [ ] Platform colors visible in sidebar
- [ ] Smooth transitions when toggling theme
- [ ] All components support dark mode
- [ ] Proper spacing and alignment

### Accessibility Requirements
- [ ] Lighthouse accessibility score 90+
- [ ] No critical axe violations
- [ ] Keyboard navigation works
- [ ] Screen reader can navigate app
- [ ] Focus states visible
- [ ] ARIA labels on interactive elements

### Performance Requirements
- [ ] Lighthouse performance score 90+
- [ ] No console errors or warnings
- [ ] Bundle size increase < 100KB
- [ ] Page load time < 3 seconds

---

## Demo Preparation (End of Week 2)

### Create Demo Script

1. **Show Theme Toggle**
   - Start in light mode
   - Click theme toggle, show smooth transition
   - Refresh page, show persistence

2. **Show Navigation**
   - Click through all nav items
   - Show active state highlighting
   - Show platform indicators in sidebar

3. **Show Responsiveness**
   - Resize browser to show mobile layout
   - Show hamburger menu on mobile
   - Show sidebar collapses appropriately

4. **Show Dark Mode Support**
   - Toggle to dark mode
   - Navigate through all pages
   - Show consistent theming

### Prepare Demo Assets
- [ ] Take screenshots of before/after
- [ ] Record short video of theme toggle
- [ ] Prepare list of completed features
- [ ] Prepare list of Phase 2 features

---

## Troubleshooting Common Issues

### Theme Toggle Not Working
- Check: `next-themes` installed correctly
- Check: ThemeProvider wraps entire app in `app/layout.tsx`
- Check: `suppressHydrationWarning` on `<html>` tag
- Check: Tailwind config has `darkMode: "class"`

### Sidebar Not Showing
- Check: `md:flex` class on sidebar (hidden on mobile)
- Check: AppLayout component is used in dashboard layout
- Check: No CSS conflicts with existing styles

### Colors Not Changing in Dark Mode
- Check: Using Tailwind dark mode variants (e.g., `dark:bg-gray-900`)
- Check: Theme system is actually toggling (inspect HTML, should have `class="dark"`)
- Check: Color definitions in Tailwind config

### Layout Breaks on Mobile
- Check: Responsive classes (md:, lg:) are correct
- Check: Sidebar has `hidden md:flex` classes
- Check: Top bar has mobile menu button visible on mobile

---

## Git Workflow

### Daily Commits
```bash
# At end of each day:
git add .
git commit -m "Phase 1 Day X: [Brief description]"
git push origin feature/ui-overhaul-phase-1
```

### Example Commit Messages
- "Phase 1 Day 1: Configure Tailwind dark mode and custom colors"
- "Phase 1 Day 2: Implement theme provider and toggle component"
- "Phase 1 Day 3: Update existing components for dark mode support"
- "Phase 1 Day 4: Create sidebar with platform branding"
- "Phase 1 Day 5: Create top bar with theme toggle"

### End of Phase 1
```bash
# Create pull request:
git push origin feature/ui-overhaul-phase-1

# On GitHub/GitLab:
# Create PR with title: "Phase 1: Theme & Layout System"
# Add screenshots and description
# Request review from team
```

---

## Questions During Implementation?

1. **Refer to Documentation**
   - `TECHNICAL_IMPLEMENTATION_GUIDE.md` has code examples
   - `COMPONENT_REFERENCE.md` has visual references
   - `PRODUCT_REQUIREMENTS.md` has detailed requirements

2. **Common Issues**
   - Check Troubleshooting section above
   - Search for error message online
   - Check Next.js and Tailwind documentation

3. **Need Help?**
   - Document the issue
   - Share screenshots/error messages
   - Reach out to team

---

## Success Metrics (Track These)

### Before Phase 1
- [ ] Take baseline Lighthouse scores (all pages)
- [ ] Record current bundle size
- [ ] Take screenshots of current UI

### After Phase 1
- [ ] Compare Lighthouse scores (should improve or stay same)
- [ ] Compare bundle size (increase should be < 100KB)
- [ ] Take screenshots of new UI

---

## Phase 1 Completion Checklist

Before marking Phase 1 as complete:

- [ ] All Day 1-10 tasks completed
- [ ] All Definition of Done criteria met
- [ ] Demo prepared
- [ ] Pull request created
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Stakeholder demo scheduled

---

## Next Steps (Phase 2 Preview)

After Phase 1 approval:
1. Schedule Phase 2 kickoff (Dashboard Experience)
2. Review feedback from Phase 1 demo
3. Adjust Phase 2 scope if needed
4. Begin AI Generator Card implementation

---

**You've got this! Phase 1 is the foundation for an amazing UI transformation.**

**Questions? Refer to the documentation. Stuck? Ask the team. Let's build something great!**
