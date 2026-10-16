# Project State

Status recorded on 2026-10-16. This handoff distinguishes completed and
verified results from work that is still pending.

## Current verified state

- The development repository is on `master` at `150010d`.
- Production LinkedIn scheduled publishing passed an end-to-end test on
  2026-10-16. This result is verified for the owner's LinkedIn account only.
- Production Supabase Cron calls an authenticated Edge Function.
- A separate release worktree exists at `D:\scheduler-cron-release`, on
  `release/cron-auth-20261015`. Its last verified HEAD was `0c521a5`.
- The release branch has not been merged or pushed.
- The original development worktree contains substantial unrelated work in
  progress. Preserve it; do not treat it as part of a release.

## Completed tickets

- **SCH-008:** Repaired the broken test commands. The offline Deno cron-auth
  suite passed: 8 tests, 0 failures.
- **SCH-009:** Prepared an isolated commit, `150010d`.

## Known limitations and risks

- LinkedIn publishing has only been verified on the owner's account; behavior
  for other accounts is not yet established.
- TikTok third-party/public publishing approval remains pending.
- `npm audit` previously reported 19 vulnerabilities. Remediation remains
  pending; reassess against a fresh audit before prioritizing fixes.
- The release worktree's branch has not been merged or pushed.

## Recommended next work

1. Re-run `npm audit`, triage the current findings, and plan safe remediation.
2. Verify LinkedIn scheduled publishing with additional authorized accounts
   before claiming broader account coverage.
3. Track TikTok third-party/public publishing approval and keep that capability
   gated until approval is obtained.
4. Separately review the release worktree at its current HEAD and decide on
   release promotion only after the required review and validation.

## Safe Git and worktree handling

- Keep the development and release worktrees separate; confirm the repository,
  branch, and HEAD before any Git operation.
- Preserve the existing development WIP. Do not use broad staging, cleanup,
  reset, or stash operations to prepare a release.
- Stage only explicitly reviewed paths, then inspect the staged diff before
  committing.
- Do not merge, push, or deploy the release branch without explicit
  authorization and a fresh review of the release state.
