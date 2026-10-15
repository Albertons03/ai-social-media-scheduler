# Security Review: Cron Credential and Authentication

**Review date:** 2026-10-15
**Scope:** Read-only review of cron credential handling and authentication. No secret values were read, copied, or tested.

## Findings

| Severity | File | Finding | Confidence |
|---|---|---|---:|
| MEDIUM | `setup-cron.sql` (historical blob in commit `074311674a6af18a2b162699ec0b0d35a771f8d1`) | Git history contains a bearer-token-shaped literal. Its validity and access scope could not be established without contacting its issuer. Treat it as exposed if genuine. | 8/10 |
| MEDIUM | `supabase/functions/publish-scheduled-posts/index.ts:385` | The Edge Function logs the complete request headers, which may include authorization or API-key values. | 9/10 |
| MEDIUM | `app/api/cron/publish/route.ts:342-346` | The route rejects a mismatched authorization header only when `CRON_SECRET` is truthy. If the setting is absent or empty, this guard is skipped. | 9/10 |

## Recommended remediation

### Source changes

1. Remove full request-header logging, or log only explicitly allowlisted non-sensitive fields.
2. Make the cron route fail closed when its required secret is missing or empty, as well as when the supplied value is incorrect.
3. Add focused tests confirming that sensitive header values are not logged and that missing, empty, and incorrect secrets are rejected while a valid secret is accepted.

### Credential rotation and deployment configuration

If the historical literal is a genuine credential, revoke or rotate it with its issuer. Configure the replacement outside source control and update the scheduler authorization configuration. Removing a literal from the current file or rewriting Git history does not revoke a credential.

The review did not establish whether the historical value is valid. No network requests or credential tests were made. Deployment configuration was not inspected.

## Review state

The reviewed worktree had `setup-cron.sql` tracked and modified but unstaged. The wider existing worktree changes, including TikTok refactor files, deleted scripts, and untracked files, were preserved. This report does not include credential values.
