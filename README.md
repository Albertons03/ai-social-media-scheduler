# AI Social Media Scheduler

A portfolio project for drafting, scheduling, and managing social media posts
from one Next.js application. It combines a calendar-based scheduler, platform
accounts, AI-assisted writing, and a Supabase-backed publishing workflow.

The project is under active development. The implementation and validation
status below distinguish shipped code from platform behavior that has not yet
been verified.

## Technology

- Next.js 16.4.2 (App Router), React 19, and TypeScript 5
- Tailwind CSS 3 and reusable UI components
- Supabase Auth, Postgres, Storage, and Edge Functions
- OpenAI and Anthropic SDKs for AI features
- Deno for Supabase Edge Function tests
- Zod, React Hook Form, and date-fns

Versions and integrations are based on the dependencies and code in this
repository.

## Features

- Dashboard, schedule calendar, post composer, and analytics views
- Draft and schedule posts for TikTok, LinkedIn, and X/Twitter
- Connect social accounts through platform OAuth routes
- Generate post text with AI; AI-backed chat and suggestions are also present
- Upload post media through the application API
- Platform-specific composer options, including TikTok privacy settings
- Supabase Edge Function for processing due scheduled posts, with cron-request
  authentication and retry/notification helpers

Analytics are based on data available to the application; live synchronization
of analytics from every platform is not verified.

## Scheduling and publishing flow

1. Sign in and connect an eligible social account.
2. Create a post, optionally use AI assistance, select its platform, and set a
   schedule time.
3. The post is stored with its scheduled status and time in Supabase.
4. Supabase Cron invokes the authenticated `publish-scheduled-posts` Edge
   Function. The function finds due posts, checks their current status, and
   dispatches them to platform-specific publisher modules.
5. The function records outcomes and uses retry/notification helpers for
   failures.

Production LinkedIn scheduled publishing has passed an end-to-end test on the
owner's account only. That test does not establish general reliability or
exactly-once delivery.

## Architecture

| Path | Responsibility |
| --- | --- |
| `app/` | Next.js routes, dashboard pages, and API handlers |
| `components/` | Calendar, composer, layout, dashboard, and UI components |
| `lib/db/` | Typed Supabase database operations |
| `lib/supabase/` | Browser, server, and middleware Supabase clients |
| `lib/publishers/` | Application-side TikTok publishing helper |
| `supabase/functions/publish-scheduled-posts/` | Scheduled-post Edge Function, platform publishers, auth, retry, and notifications |
| `supabase/migrations/` | Database migrations |
| `docs/PROJECT_STATE.md` | Verified project state, risks, and worktree/release notes |

## Local development

### Prerequisites

- Node.js 20.9 or later
- npm
- Deno to run the offline cron-auth test
- A Supabase project and provider credentials for the features you want to
  exercise

Local development features that call Supabase or AI/platform APIs need
developer-owned credentials. Do not commit credentials or use production
credentials for local testing. Keep service-role and cron secrets server-side;
never place them in client-side code.

### Setup

1. Clone the repository and enter its directory.
2. Install the committed dependency versions:

   ```powershell
   npm ci
   ```

3. Copy `.env.example` to `.env.local` and fill in only the values needed for
   your own development environment. Obtain credentials from the relevant
   provider dashboards; do not paste them into issues, screenshots, or commits.
4. Start the app:

   ```powershell
   npm run dev
   ```

5. Open `http://localhost:3000`.

To run validation commands:

```powershell
npm run type-check
npm run test:cron-auth
```

The cron-auth test is offline and does not publish posts. Local Supabase Edge
Function development additionally requires the Supabase CLI and Docker; see
`LOCAL_TESTING_README.md`.

## Screenshots

Screenshots have not been added to this repository yet. These are placeholders
for future, sanitized captures:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/schedule.png`
- `docs/screenshots/post-composer.png`

Do not add screenshots containing account details, tokens, or private post
content.

## Verification status and limitations

- **LinkedIn:** Scheduled publishing E2E verified on the owner's account.
  Third-party LinkedIn publishing has not been validated.
- **TikTok:** Public third-party publishing awaits platform approval. Do not
  treat public publishing as generally available.
- **X/Twitter:** Integration code exists; production scheduled-publishing E2E
  is not verified here.
- **Security update:** Next.js 16.4.2 is on the isolated security integration
  branch. It has not been merged into development `master` or the cron-release
  branch, pushed, or deployed.
- **Dependency audit:** The latest recorded production audit reported 15
  findings (0 critical, 7 high, 8 moderate). Remediation remains open; these
  findings must not be considered fixed by the Next.js update.
- **Build validation:** A production build passed on the separate security
  source branch using temporary fake Supabase configuration. The integration
  branch build has not been run because outbound-network isolation could not be
  verified in the available environment.
- **Development WIP:** The development worktree contains protected,
  uncommitted changes, including a `next-mdx-remote` 6 upgrade. That upgrade
  has not been reconciled with the security integration.

## Roadmap

- Complete security integration and validate a clean release candidate.
- Triage and resolve the remaining dependency findings in separate changes.
- Reconcile the MDX 6 upgrade deliberately, without overwriting development WIP.
- Add sanitized screenshots and a short product demo for the portfolio release.
- Validate platform behavior and obtain required TikTok approval before making
  broader publishing claims.

## Engineering decisions

- Keep platform OAuth and publishing work behind server-side routes or the
  authenticated Edge Function.
- Keep Supabase row-level security as a database boundary in addition to
  application authentication.
- Use cron authentication for the scheduled publishing function.
- Keep security remediation, dependency reconciliation, and cron-release
  changes reviewable as separate work.
