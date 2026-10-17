# Project State

Status recorded on 2026-10-16 and updated on 2026-10-17 (SCH-021). This
handoff distinguishes completed and verified results from work that is still
pending.

## Current verified state

- The development worktree is `D:\ai-personal-tiktok-scheduler`, on `master`
  at `c7ac93d`, with substantial uncommitted WIP. Preserve it.
- Production LinkedIn scheduled publishing passed an end-to-end test on
  2026-10-16 for the owner's account only. Third-party LinkedIn publishing has
  not been validated.
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
    `integration/next-security-20261016`, latest commit `5afcb4d`
    (`fix: polish scheduler UI and remove portfolio quota`), clean when
    SCH-021 started. The security commit `4433d19` is an ancestor of it.
  - Disposable build validation: `D:\scheduler-security-build-check`,
    detached at `4433d19`, clean.
- The security commit is on the integration branch but has not been merged
  into development `master` or the cron-release branch, pushed, or deployed.
  The same applies to the SCH-020 UI and quota changes in `5afcb4d`.
- The application-level 10-post monthly limit has been removed on the
  integration branch. The quota-removal changes have **not** been
  production-tested; LinkedIn owner-account publishing was verified earlier,
  before these changes.
- A production build of the integration worktree has **not** been verified.

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

## Known limitations and risks

- **Open issue (not fixed):** in browser testing, clicking a Suggested Time
  inside the post composer still displays a time two hours earlier than the
  suggestion in the user's timezone. The cause is not yet confirmed or fixed;
  the SCH-020F changes cover only the Dashboard-to-Schedule link. Manual
  date/time selection is the recommended workaround until this is verified.
- The quota-removal changes are untested in production, and no production
  build has been verified for the integration worktree.
- X (Twitter) publishing remains unverified.
- LinkedIn scheduled publishing E2E is verified only for the owner's account;
  third-party LinkedIn publishing remains unvalidated.
- TikTok public third-party publishing awaits platform approval.
- The latest recorded integration production audit had 15 findings (0 critical,
  7 high, 8 moderate). These findings were not fixed by the Next.js update and
  require separate follow-up remediation tickets.
- The development WIP includes a `next-mdx-remote` 5-to-6 upgrade. Its changes
  overlap with the security update in both package files; deliberate
  reconciliation remains pending. Do not overwrite the master WIP.
- Middleware deprecation and stale Browserslist warnings were observed during
  earlier source-branch build validation.
- The security update is present only on the integration branch; it is not yet
  integrated into development `master` or the cron-release branch.

## Recommended next work

0. Investigate and fix the composer Suggested Time two-hour offset, then
   re-verify in the browser before claiming it is resolved.
1. Pursue the **PORTFOLIO RELEASE** goal: resolve Git integration carefully
   using the isolated integration worktree, then prepare the README, screenshots,
   demo, and GitHub repository.
2. Reconcile the Next.js security update with the development WIP's
   `next-mdx-remote` 6 change deliberately. Preserve the dirty master worktree;
   do not copy its package files wholesale.
3. Complete production-build validation in an environment that can establish
   outbound-network isolation, using only fake process-scoped Supabase values.
4. Track remaining dependency vulnerabilities and MDX 6 reconciliation in
   separate follow-up backlog items; do not claim them fixed.
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
