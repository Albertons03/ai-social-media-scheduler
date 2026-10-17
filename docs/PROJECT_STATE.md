# Project State

Status recorded on 2026-10-16 and updated on 2026-10-17 (SCH-021, SCH-027).
This handoff distinguishes completed and verified results from work that is
still pending.

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
    `integration/next-security-20261016`, latest commit `682eef5`
    (`fix: remove outdated scheduling quota copy`), clean when SCH-027 started.
    The security commit `4433d19` and the later commits `5afcb4d`, `dcabab9`,
    `31f1ffb` and `cf5df47` are ancestors of it.
  - Disposable build validation: `D:\scheduler-security-build-check`,
    detached HEAD (last at `dcabab9`), with **local uncommitted changes** to
    `package.json` and `package-lock.json` copied from the integration worktree
    for build validation. It contains no real env files. Do not reset or
    overwrite it without checking, and do not treat those files as a source of
    truth.
- The security commit is on the integration branch but has not been merged
  into development `master` or the cron-release branch, pushed, or deployed.
  The same applies to every later commit on the integration branch
  (SCH-020 through SCH-026). **No push or merge has been performed and the
  integration branch is not deployed.**
- The protected development worktree on `master` contains separate,
  uncommitted WIP, including its own `next-mdx-remote` 6 package changes. Do
  not modify, reset, or overwrite it, and do not copy its package files.
- The application-level 10-post monthly limit has been removed on the
  integration branch. The quota-removal changes have **not** been
  production-tested; LinkedIn owner-account publishing was verified earlier,
  before these changes.
- Production builds of the integration code have passed with dummy environment
  values (SCH-024, SCH-025B, SCH-025C). These builds were **not**
  network-isolated, and nothing was deployed.

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

### Verified validation results (integration branch, through `682eef5`)

- TypeScript checks (`npm run type-check`): passed.
- Existing automated tests: 20/20 passed (cron-auth 8, posts API 4, schedule
  prefill 8).
- Production build with `next-mdx-remote` v6: passed, with dummy environment
  values and without network isolation.
- Production `npm audit --omit=dev`: 0 critical, 0 HIGH, 8 MODERATE.

## Known limitations and risks

### Open issues before release

- **A. Suggested Times (not fixed):** the internal post-composer suggestion
  buttons can produce a two-hour scheduling offset. In browser testing, a
  clicked Suggested Time displayed a time two hours earlier than the
  suggestion in the user's timezone. The cause is not confirmed; the SCH-020F
  fix covers only the Dashboard-to-Schedule link. Manual date/time entry is the
  workaround. Fix or disable the affected shortcuts before release.
- **B. Blog marketing:** several `content/posts/*.mdx` files still advertise
  the removed 10-post free tier. A content review is required before
  deployment.
- **C. Dependency audit:** 8 MODERATE production findings remain
  (`next-intl`, `resend` with `svix` and `uuid`, and `gray-matter` with
  `js-yaml`, `argparse` and `sprintf-js`). Their risk was assessed as
  relatively low based on current code paths, but not every exploitation
  condition was verified.
- **D. Release and security:** real deployment configuration, credentials,
  token rotation, OAuth integrations and platform publishing have not all been
  verified end to end. The historical token-shaped literal in Git history has
  not been confirmed as rotated.

### Other limitations

- The quota-removal changes are untested in production. Production builds
  passed only with dummy values and without network isolation, and the built
  app was not run against real services.
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

**Next release decision:** resolve the Suggested Times issue and the stale
blog claims, then perform a final targeted release check before deployment
approval.

0. Fix or disable the composer Suggested Time shortcuts, then re-verify in the
   browser before claiming it is resolved.
0a. Review and correct the blog posts that advertise the removed 10-post free
   tier.
1. Pursue the **PORTFOLIO RELEASE** goal: resolve Git integration carefully
   using the isolated integration worktree, then prepare the README, screenshots,
   demo, and GitHub repository.
2. Reconcile the integration branch with the development WIP's
   `next-mdx-remote` 6 change deliberately. Preserve the dirty master worktree;
   do not copy its package files wholesale.
3. Complete production-build validation in an environment that can establish
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
