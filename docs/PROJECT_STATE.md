# Project State

Status recorded on 2026-10-16 and updated on 2026-10-17 (SCH-021, SCH-027,
SCH-033, SCH-034).
This handoff distinguishes completed and verified results from work that is
still pending.

## Current verified state

- The development worktree is `D:\ai-personal-tiktok-scheduler`, on `master`
  at `c7ac93d`, with substantial uncommitted WIP. Preserve it.
- Production LinkedIn scheduled publishing passed an end-to-end test on
  2026-10-16, and a scheduled post passed again on 2026-10-17 in local testing
  (Supabase cron and Edge Function), for the owner's account only. Third-party LinkedIn publishing has
  not been validated.
- On 2026-10-17 the owner verified, in local testing of the integration branch
  (Next.js 16.4.2), that Suggested Times in the post composer display the
  selected time correctly (08:00 shows 08:00; Tuesday 10:00 updates both date
  and time) and that LinkedIn scheduled publishing works end to end for the
  owner's account (see SCH-034). This was local testing; the integration branch
  itself is not deployed.
- Scheduling architecture: Supabase Cron (every 5 minutes) calls an
  authenticated Edge Function that publishes due posts. Vercel Cron is
  disabled; Supabase is the only active scheduling mechanism.
- Production Supabase Cron calls an authenticated Edge Function.
- A separate release worktree exists at `D:\scheduler-cron-release`, on
  `release/cron-auth-20261015`. Its last verified HEAD was `0c521a5`.
- The current five-worktree structure is:
  - Development: `D:\ai-personal-tiktok-scheduler`, `master`, `c7ac93d`,
    dirty with protected WIP.
  - Cron release: `D:\scheduler-cron-release`,
    `release/cron-auth-20261015`, `0c521a5`, clean.
  - Security source: `D:\scheduler-next-security`,
    `sch-012-next-security`, `cb1ce57`, clean.
  - Security integration: `D:\scheduler-security-integration`,
    `integration/next-security-20261016`, HEAD `b5439d0`
    when SCH-034 started (d9cf7dc, docs: replace obsolete credential examples,
    precedes it), clean.
    The security commit `4433d19` and the later commits `5afcb4d`, `dcabab9`,
    `31f1ffb`, `cf5df47`, `682eef5`, `0615d61`, `b74ec28` and `8c3fbd1` are
    ancestors of it.
  - Temporary exact-revision build directory:
    `D:\scheduler-build-8c3fbd1` (SCH-031B), a `git archive` export of
    `8c3fbd1` with installed dependencies and build output. It is not a Git
    worktree and was kept for inspection; it can be deleted when no longer
    needed.
  - Disposable build validation: `D:\scheduler-security-build-check`,
    detached HEAD (last at `dcabab9`), with **local uncommitted changes** to
    `package.json` and `package-lock.json` copied from the integration worktree
    for build validation. It contains no real env files. Do not reset or
    overwrite it without checking, and do not treat those files as a source of
    truth.
- The security commit is on the integration branch but has not been merged
  into development `master` or the cron-release branch, pushed, or deployed.
  The same applies to every later commit on the integration branch
  (SCH-020 through SCH-032). **No push or merge has been performed and the
  integration branch is not deployed. Deployment has not been performed or
  approved.**
- The protected development worktree on `master` contains separate,
  uncommitted WIP, including its own `next-mdx-remote` 6 package changes. Do
  not modify, reset, or overwrite it, and do not copy its package files.
- The application-level 10-post monthly limit has been removed on the
  integration branch. The quota-removal changes have **not** been
  production-tested; LinkedIn owner-account publishing was verified earlier,
  before these changes.
- Production builds of the integration code have passed with dummy environment
  values (SCH-024, SCH-025B, SCH-025C), and an exact-revision build of
  `8c3fbd1` passed in SCH-031B. These builds were **not** network-isolated,
  and nothing was deployed. A passing build does not verify Supabase, OAuth or
  external platform publishing.

## Completed tickets

- **SCH-008:** Repaired the broken test commands. The offline Deno cron-auth
  suite passed: 8 tests, 0 failures.
- **SCH-009:** Prepared an isolated commit, `150010d`.
- **SCH-011:** Established the dependency audit baseline: 27 full-tree and 18
  production findings.
- **SCH-012:** Updated Next.js from resolved `16.0.8` to exact `16.4.2` in an
  isolated security worktree from `c7ac93d`. Source commit: `979e3f7`.
- **SCH-012 source-branch validation:** TypeScript, cron-auth tests (8 passed,
  0 failed), dependency-tree validation, and production build passed. That
  build used process-scoped fake Supabase configuration on the security source
  branch; it was not an integration-branch build.
- **SCH-013C:** Created the isolated integration worktree from `c7ac93d`.
- **SCH-013D:** Cherry-picked `979e3f7` as `4433d19` on
  `integration/next-security-20261016`. The commit changes only
  `package.json` and `package-lock.json`.
- **SCH-013E:** In the integration worktree, `npm ci`, TypeScript validation,
  `npm ls next`, and cron-auth tests (8 passed, 0 failed) passed. Next.js
  resolved to `16.4.2`. The production audit reported 15 findings: 0 critical,
  7 high, and 8 moderate.
- **SCH-013F:** Analyzed a safe build procedure using fake, process-scoped
  Supabase values and a disposable worktree.
- **SCH-013G/1–2:** Created the disposable build worktree at
  `D:\scheduler-security-build-check`, detached at `4433d19`. Filename-only
  dotenv verification passed: `.env.example` is present; `.env`, `.env.local`,
  `.env.production`, and `.env.production.local` were absent.
- **SCH-013G/3:** The production build was not run because outbound-network
  isolation could not be verified in the available environment.
- **SCH-014:** Consolidated this project-state handoff and the remaining
  portfolio-release work.
- **SCH-020 through SCH-020F** (completed and committed as `5afcb4d`):
  - Dashboard and Analytics now distinguish real post data (post counts,
    platform breakdowns, publication statuses) from unavailable platform
    engagement analytics (views, likes, comments, engagement rate), which show
    "N/A" instead of a verified zero. Hardcoded growth badges were removed.
  - The application-level 10-post monthly limit and its upgrade messaging were
    removed from the API route and the UI. Usage counters and database records
    were preserved, and authentication and validation are unchanged.
  - Light/dark theme consistency was improved for the calendar, Quick Actions,
    Best Times cards, post composer (including a sticky header without a
    duplicate heading), and the pie chart. An accessible English file picker
    replaced the browser-localized one, and the date field has English
    guidance.
  - Fixed the Dashboard-to-Schedule double UTC conversion: the link now carries
    a full ISO timestamp with `Z`, it is converted to local time once, invalid
    or zone-less `time` values are ignored, consumed query parameters are
    removed, and `initialData` is cleared when the modal closes.
  - Validation: TypeScript PASS; schedule prefill tests 8/8; posts API tests
    4/4; cron-auth tests 8/8; `git diff --check` PASS.
  - Browser checks: a normal Create Post starts with an empty date: PASS.
    Reopening Create Post resets the date: PASS. Suggested Time displayed hour
    inside the composer: **FAIL** (see known issues).
- **SCH-021:** Updated this project-state document.
- **SCH-024:** The Next.js 16.4.2 production build of the integration code
  passed using dummy environment values. The build was **not**
  network-isolated, and no deployment was performed.
- **SCH-025B** (commit `31f1ffb`, `fix: patch vulnerable production
  dependencies`): Targeted, compatible lockfile-only updates, for example
  `axios` 1.20.0, `form-data` 4.0.6, `js-yaml` 3.15.2, `lodash` 4.18.1,
  `source-map-js` 1.2.2, `ws` 8.22.0, `follow-redirects` 1.16.1 and `yaml`
  2.9.1. `package.json` was unchanged. The production build passed with the
  updated lockfile (dummy environment, not network-isolated).
- **SCH-025C** (commit `cf5df47`, `fix: upgrade next-mdx-remote to v6`):
  `next-mdx-remote` was upgraded from v5 to v6.0.0 on the integration branch,
  with no blog code changes. The existing posts use no JavaScript expressions,
  imports or JSX components, so v6's default restrictions were not weakened.
  All six blog posts compiled, and all six were prerendered during a
  production build that passed (dummy environment, not network-isolated).
  Code-block syntax highlighting was not exercised, because the posts contain
  no code blocks. This resolved the last HIGH production audit finding.
- **SCH-026** (commit `682eef5`, `fix: remove outdated scheduling quota
  copy`): Removed outdated 10-post quota wording from `app/contact/page.tsx`
  and from the Starter Pack preview strings in `lib/i18n.ts` (English, German
  and Hungarian). The blog posts were intentionally not changed.
- **SCH-027:** Updated this project-state document.
- **SCH-028B** (commit `0615d61`, `fix: preserve local time in suggested
  scheduling slots`): Fixed the Suggested Times local-time conversion in the
  post composer. The buttons stored `toISOString().slice(0,16)` (UTC wall time)
  in a `datetime-local` field, which could schedule a post two hours early in
  Europe/Budapest summer time. They now use shared helpers in
  `lib/utils/schedule-prefill.ts` that convert once to local time. Added
  `tests/suggested-times.test.ts` (11 tests, run by
  `npm run test:schedule-prefill`). Browser confirmation passed on 2026-10-17 (SCH-034).
- **SCH-029** (commit `b74ec28`): Removed the obsolete 10-post free-tier and
  invented pricing claims about the Scheduler from the blog posts.
- **SCH-030** (commit `8c3fbd1`, `docs: align scheduler marketing with
  verified capabilities`): Corrected unsupported product claims in
  `content/posts/*.mdx`: TikTok auto-publishing (pending platform approval),
  X publishing (unverified), account-specific AI posting times (the suggestions
  are static guidance), engagement analytics and team features (not
  available), AI video analysis, trending-hashtag detection, and "100% safe" or
  "won't get you banned" guarantees. All six posts still compile with MDX v6.
- **SCH-031:** Final automated release verification of `8c3fbd1`. Type-check
  and all tests passed; the production audit reported 0 critical, 0 high and 8
  moderate findings. Remaining release checks were classed as PENDING or
  BLOCKED (see below).
- **SCH-031B:** Exact-revision production build of `8c3fbd1`, exported with
  `git archive` into `D:\scheduler-build-8c3fbd1` with dummy environment values
  only: `npm ci --ignore-scripts` passed, `npm run build` passed, 40 static
  pages were generated, and all six blog posts were prerendered. The build was
  **not** network-isolated.
- **SCH-032** (commit `d9cf7dc`): Documentation cleanup only. Replaced three
  obsolete token-shaped example strings in `SETUP_GUIDE.md` and
  `SUPABASE_DEPLOYMENT_GUIDE.md` with neutral placeholders. This is **not**
  evidence of credential rotation, and Git history was not changed.
- **SCH-033:** Updated this project-state document.
- **SCH-034:** Recorded the owner's manual verification of 2026-10-17: Suggested
  Times browser test PASS (08:00 displayed 08:00; Tuesday 10:00 updated date and
  time; no UTC/local offset) and LinkedIn scheduled publishing E2E PASS for the
  owner's account (post scheduled, processed by the Supabase Edge Function on
  the 5-minute Supabase cron, appeared on LinkedIn, status published). Vercel
  Cron is disabled. Third-party LinkedIn accounts remain unverified. This was
  local testing, not a deployment.

### Verified validation results (integration branch, through `d9cf7dc`)

- Production build at commit `8c3fbd1`: PASS (`npm ci` PASS, Next.js build
  PASS, 40 static pages, all six blog posts prerendered). Dummy environment
  values, no network isolation, nothing deployed.
- TypeScript checks (`npm run type-check`): PASS.
- Automated tests: 31/31 PASS (schedule prefill and suggested times 19, posts
  API 4, cron authentication 8).
- Production `npm audit --omit=dev`: 0 critical, 0 high, 8 moderate.
- `git diff --check`: PASS for the SCH-032 change.

### Earlier validation results (through `682eef5`)

- TypeScript checks (`npm run type-check`): passed.
- Existing automated tests: 20/20 passed (cron-auth 8, posts API 4, schedule
  prefill 8).
- Production build with `next-mdx-remote` v6: passed, with dummy environment
  values and without network isolation.
- Production `npm audit --omit=dev`: 0 critical, 0 HIGH, 8 MODERATE.

## Known limitations and risks

### Open issues before release

- **A. Suggested Times (RESOLVED, verified 2026-10-17):** the composer buttons
  previously produced a two-hour offset (UTC wall time in a datetime-local
  field). SCH-028B (0615d61) fixed it with regression tests, and the owner's
  browser test passed: 08:00 displays 08:00 and Tuesday 10:00 updates date and
  time.
- **B. Blog marketing (corrected, review pending):** SCH-029 and SCH-030
  removed the obsolete quota, pricing and unsupported capability claims from
  the six posts. Remaining statements (for example "free to try, no credit
  card required", the described Settings and Create Post flow, and competitor
  data) have not been verified against the live product. Do a final read-through
  before deployment.
- **C. Dependency audit:** 8 MODERATE production findings remain
  (`next-intl`, `resend` with `svix` and `uuid`, and `gray-matter` with
  `js-yaml`, `argparse` and `sprintf-js`). Their risk was assessed as
  relatively low based on current code paths, but not every exploitation
  condition was verified.
- **D. Release configuration and publishing (not verified):** production
  environment settings, OAuth callback configuration and platform publishing
  have not all been verified end to end. SCH-032 only replaced example token
  strings in two guides and is not proof of credential rotation. The owner has
  separately reviewed the historical credential and duplicate-publishing
  questions; they are not reopened here.

### Other limitations

- The quota-removal and scheduling-fix changes were verified only in local
  testing (2026-10-17) with the Supabase cron and Edge Function; the
  integration branch is not deployed and production builds used dummy values.
- X (Twitter) publishing remains unverified.
- LinkedIn scheduled publishing E2E is verified only for the owner's account;
  third-party LinkedIn publishing remains unvalidated.
- TikTok public third-party publishing awaits platform approval.
- The 15-finding audit (0 critical, 7 high, 8 moderate) recorded earlier for
  the integration branch has been reduced to 0 high and 8 moderate by SCH-025B
  and SCH-025C.
- The development WIP on `master` includes its own `next-mdx-remote` 6 change.
  The integration branch now also has v6, so merging will conflict in both
  package files; reconcile deliberately and do not overwrite the master WIP.
- Middleware deprecation and stale Browserslist warnings were observed during
  earlier source-branch build validation.
- The integration branch changes are not yet integrated into development
  `master` or the cron-release branch.

## Recommended next work

**Next release decision:** complete the remaining release tasks below, then
decide on deployment approval. Deployment has not been approved or performed.

Completed release checks (2026-10-17, owner, local testing):

- Suggested Times browser verification: PASS.
- LinkedIn scheduled post end to end (owner account): PASS.

Remaining release tasks:

- Confirm the required production environment settings and the OAuth callback
  configuration.
- TikTok public publishing remains dependent on platform approval.
- X publishing is not yet verified.
- Third-party LinkedIn accounts are not yet verified.

Further work:
1. Pursue the **PORTFOLIO RELEASE** goal: resolve Git integration carefully
   using the isolated integration worktree, then prepare the README, screenshots,
   demo, and GitHub repository.
2. Reconcile the integration branch with the development WIP's
   `next-mdx-remote` 6 change deliberately. Preserve the dirty master worktree;
   do not copy its package files wholesale.
3. Optionally repeat the production build in an environment that can establish
   outbound-network isolation, using only fake process-scoped Supabase values.
4. Track the 8 remaining MODERATE findings in separate follow-up backlog items;
   do not claim them fixed.
5. Keep cron-release integration and release promotion as a separate decision.
6. Keep TikTok public publishing gated pending platform approval; validate
   third-party LinkedIn accounts before claiming broader support.

## Safe Git and worktree handling

- Keep all worktrees separate; verify path, branch, and HEAD before Git
  operations.
- Preserve the existing development WIP. Do not use broad staging, cleanup,
  reset, checkout, or stash operations to prepare an integration or release.
- Stage only explicitly reviewed paths, then inspect the staged diff before
  committing.
- Do not merge, push, deploy, or promote security or cron-release changes
  without explicit authorization and a fresh review of the target state.
