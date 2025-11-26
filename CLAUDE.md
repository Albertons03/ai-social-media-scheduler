# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Dependencies
npm install             # Install all dependencies
```

## Project Architecture

### Stack & Conventions
- **Framework**: Next.js 16 (App Router with Turbopack, Server Components by default)
- **Language**: TypeScript 5.9 with strict mode
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Database**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-4 API for content generation
- **Path Aliases**: `@/*` maps to project root

### Core Architecture Patterns

**Authentication Flow**:
- Supabase Auth handles user sessions
- Middleware (`middleware.ts`) refreshes sessions on every request using `updateSession()` from `lib/supabase/middleware`
- Protected routes redirect unauthenticated users to `/login`
- OAuth callbacks handled in `app/api/auth/callback/[provider]/route.ts` files

**Database Layer** (`lib/db/`):
- Each module (posts, social-accounts, ai-generations) exports typed functions
- All DB operations use Supabase server client created via `createClient()` from `lib/supabase/server`
- Row Level Security (RLS) enforces user data isolation at DB level
- Tables: `profiles`, `social_accounts`, `posts`, `ai_generations`, `analytics_snapshots`

**API Routes** (`app/api/`):
- Endpoint structure mirrors REST conventions (GET/POST/PUT/DELETE)
- All endpoints verify authentication before processing
- Error handling returns appropriate HTTP status codes with JSON responses
- Media upload uses Supabase Storage

**Components**:
- UI components in `components/ui/` are shadcn/ui components
- Feature components in `components/` use React hooks and form validation
- Post creation form validates platform-specific requirements (privacy, caps, etc)
- Calendar component uses date-fns for date manipulation

**AI Integration**:
- OpenAI client initialized in API routes (not in components)
- Content generation API endpoint at `/api/ai/generate` accepts: prompt, platform, tone, length
- Platform-specific system prompts applied (TikTok uses hashtags, LinkedIn is professional, Twitter respects 280 char limit)
- Generation history saved to `ai_generations` table for usage tracking

### Database Schema Highlights
- **posts table**: Main table with platform-specific fields (privacy_level for TikTok, post IDs for tracking across platforms)
- **social_accounts**: Stores OAuth tokens and platform credentials for each connected account
- **Status workflow**: draft → scheduled → published (or failed)
- **Analytics fields**: views_count, likes_count, comments_count, shares_count, engagement_rate
- **Indexes**: on user_id, status, scheduled_for, platform for query performance

### Key Type System
- All database types exported from `lib/types/database.types.ts`
- Zod schemas used for form validation (react-hook-form + Zod resolver pattern)
- Platform-specific types: 'tiktok' | 'linkedin' | 'twitter'
- Status types: 'draft' | 'scheduled' | 'published' | 'failed'

## Planned Features (Not Yet Implemented)

These features are documented in the README but not yet coded:

1. **Platform API Integration**: TikTok OAuth, LinkedIn API, Twitter/X API actual publishing (routes exist but lack implementation)
2. **Automatic Publishing**: Cron jobs to publish scheduled posts at scheduled_for time
3. **Real-time Analytics Sync**: Currently analytics are static; need platform API polling
4. **File Upload** (`/api/upload`): Video/image upload handling to Supabase Storage

## Important Implementation Notes

- **Environment Variables**: Required env vars in `.env.local` (see `.env.example`)
- **Server vs Client**: Prefer Server Components; use 'use client' only when necessary (forms, interactivity, hooks)
- **Form Handling**: react-hook-form + Zod for validation on form components
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints (md:, lg:)
- **Error Handling**: All async operations wrapped in try-catch; return meaningful error messages to frontend
- **Empty States**: Include loading spinners and empty state callouts (seen in calendar and analytics pages)
- **Toast Notifications**: Use Sonner library for success/error feedback

## File Structure Notes

Key directories:
- `app/` - Next.js App Router (auth layout group, dashboard layout group)
- `components/` - React components (UI, post form, calendar)
- `lib/` - Utilities (Supabase clients/types, database functions)
- `public/` - Static assets
- Configuration: `tsconfig.json`, `next.config.js`, `tailwind.config.ts`

## Security

- Row Level Security (RLS) policies enforce user isolation (all tables have RLS enabled)
- API keys (OpenAI, Supabase) stored as environment variables only
- Supabase service role key used only on server-side
- Public anon key used on client-side with RLS protection
- HTTPS enforced in production
