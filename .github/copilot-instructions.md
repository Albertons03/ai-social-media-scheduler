# Copilot Instructions for AI Social Media Scheduler

## Project Overview
- **Stack**: Next.js 16 (App Router, Server Components), TypeScript (strict), Tailwind CSS + shadcn/ui, Supabase (Postgres, Auth, Storage), OpenAI GPT-4 API
- **Purpose**: Schedule and auto-publish posts to TikTok, LinkedIn, Twitter with AI-powered content generation

## Architecture & Key Patterns
- **App Structure**: 
  - `app/` (Next.js App Router): Auth, dashboard, analytics, schedule, settings
  - `components/`: UI (shadcn/ui), feature components (React hooks, forms)
  - `lib/`: Supabase clients, DB functions, types, utilities
  - `public/`: Static assets
- **API**: RESTful endpoints in `app/api/`, one file per endpoint, always verify auth, wrap in try-catch, return proper status codes
- **Database**: Typed functions in `lib/db/`, RLS enforced, never expose service role key to client, types in `lib/types/database.types.ts`
- **Authentication**: Supabase Auth, session refreshed in `middleware.ts`, OAuth callbacks in `app/api/auth/callback/[provider]/route.ts`
- **AI Integration**: `/api/ai/generate` endpoint, platform-specific prompts, history saved to `ai_generations` table

## Conventions & Rules
- **TypeScript**: Strict mode, no `any`, all params/returns typed, use `import type { ... }`
- **Styling**: Tailwind only (no CSS modules/inline styles), shadcn/ui for all UI, mobile-first with breakpoints
- **Forms**: Use react-hook-form + Zod for validation
- **Error Handling**: All async ops in try-catch, log with context, never expose server details
- **Testing**: Use React Testing Library, focus on user behavior, mock external deps
- **Performance**: Optimize DB queries, lazy load components, use date-fns for dates
- **Security**: Validate all input, sanitize errors, never store secrets in code, HTTPS in prod

## Developer Workflow
- **Setup**: See `README.md` and `.env.example` for env vars
- **Build/Test**: Standard Next.js scripts (`dev`, `build`, `start`), test with `jest`/`react-testing-library`
- **Deploy**: Vercel recommended (see UTMUTATO.md for quick steps)
- **Agent Usage**: See `.claude/rules.md` for agent handoff, always provide full context and constraints

## What NOT To Do
- No CSS modules/inline styles, no other UI libs, no breaking DB changes without migration, no client-side DB ops, no hardcoded env vars, no TypeScript errors, no over-engineering

## References
- `CLAUDE.md`: Architecture, quick reference
- `.claude/rules.md`: Code/agent rules
- `README.md`: Project setup
- Inline comments: Only for non-obvious logic

---
For questions or ambiguity, ask for clarification and reference relevant files. Follow established patterns and keep changes minimal and focused on the task.