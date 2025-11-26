# Automatic Post Publishing System - Deployment Guide

## Overview

This guide walks through deploying the automatic post publishing system to production.

## Prerequisites

- Supabase project set up and configured
- API keys configured in your environment:
  - `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`
  - `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`
  - `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET`
- Supabase CLI installed: `npm install -g supabase`
- Git configured and repository set up

## Step 1: Database Migrations

The database schema has already been updated with:
- `notifications` table with RLS policies
- Error tracking columns on `posts` table

To apply these changes to your Supabase project:

1. Open Supabase Dashboard → SQL Editor
2. Run the updated schema from `supabase-schema.sql` (sections for notifications table)

Or use Supabase CLI:
```bash
supabase db pull  # Pull current schema from remote
supabase db push  # Push local schema to remote
```

## Step 2: Setup Supabase Edge Functions

### 2.1 Initialize Supabase CLI

```bash
# Navigate to project directory
cd D:\AI\ personal\ tiktok\ scheduler\ai-personal-tiktok-scheduler

# Login to Supabase (one time)
supabase login

# Link to your project (replace with your project ref)
supabase link --project-ref your-project-ref
```

Get your project ref from: Supabase Dashboard → Settings → General

### 2.2 Create `.env` for Edge Functions

Create `supabase/.env` with your credentials:

```env
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
TIKTOK_CLIENT_KEY=your-tiktok-key
TIKTOK_CLIENT_SECRET=your-tiktok-secret
LINKEDIN_CLIENT_ID=your-linkedin-id
LINKEDIN_CLIENT_SECRET=your-linkedin-secret
TWITTER_CLIENT_ID=your-twitter-id
TWITTER_CLIENT_SECRET=your-twitter-secret
```

⚠️ **Important**: Add `supabase/.env` to `.gitignore` - Never commit secrets!

### 2.3 Deploy Edge Function

```bash
# Deploy the edge function to your Supabase project
supabase functions deploy publish-scheduled-posts --env-file supabase/.env

# Verify deployment
supabase functions list
```

Output should show:
```
publish-scheduled-posts     https://your-project.supabase.co/functions/v1/publish-scheduled-posts
```

### 2.4 Test the Edge Function

```bash
# Option 1: Using Supabase Dashboard
# Navigate to: Functions → publish-scheduled-posts → Execute

# Option 2: Using curl (get your service role key from Settings)
curl -X POST https://your-project.supabase.co/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer YOUR-SERVICE-ROLE-KEY" \
  -H "Content-Type: application/json" \
  -d '{"scheduled": true}'
```

Expected response:
```json
{
  "scheduled": true,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "totalPostsProcessed": 0,
  "publishedCount": 0,
  "failedCount": 0,
  "results": []
}
```

## Step 3: Setup pg_cron

pg_cron automatically runs the edge function every 5 minutes.

### 3.1 Enable pg_cron Extension

Open Supabase Dashboard → SQL Editor and run:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
```

### 3.2 Get Your Service Role Key

1. Supabase Dashboard → Settings → API
2. Copy the "Service Role" key (this has special permissions)

⚠️ **Security**: Keep this key secret! Only use it for backend operations.

### 3.3 Create Scheduled Job

Run this SQL in Supabase SQL Editor (replace placeholders):

```sql
-- Store service role key as database setting
ALTER DATABASE postgres
SET app.settings.service_role_key = 'sbp_YOUR-SERVICE-ROLE-KEY';

-- Schedule the publishing job to run every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/5 * * * *',  -- Every 5 minutes, every hour, every day
  $$
    SELECT
      net.http_post(
        url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/publish-scheduled-posts',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object('scheduled', true)
      ) AS request_id;
  $$
);
```

### 3.4 Verify Cron Job

```sql
-- List all cron jobs
SELECT * FROM cron.job;

-- View recent job runs
SELECT
  job_name,
  last_successful_run,
  last_failed_run,
  last_run_duration
FROM cron.job_run_details
WHERE job_name = 'publish-scheduled-posts'
ORDER BY start_time DESC
LIMIT 10;
```

## Step 4: Test Publishing

### 4.1 Create a Test Post

1. Go to Dashboard → Create Post
2. Write content (keep Twitter under 280 chars)
3. Select platform (Twitter, LinkedIn, or TikTok)
4. Schedule for the next 5 minutes

Example:
- Platform: Twitter
- Content: "Testing automatic publishing! 🚀"
- Scheduled for: Now + 5 minutes

### 4.2 Wait for Publishing

The job runs every 5 minutes at :00, :05, :10, etc.

- Check post status: Dashboard should show "Published"
- Check notifications: Bell icon should show success notification
- Verify on platform: Tweet/post should appear on Twitter/LinkedIn/TikTok

### 4.3 Monitor Errors

If publishing fails:
1. Check Notification Bell for error message
2. Check Supabase Logs: Functions → publish-scheduled-posts → Invocations
3. Check post error_message field: Posts table error_message column

## Step 5: Frontend Integration

### 5.1 Add Notification Bell to Header

In your main layout or header component:

```tsx
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Header() {
  return (
    <header>
      {/* ... other header content ... */}
      <NotificationBell />
    </header>
  );
}
```

### 5.2 Display Real-time Status

The bell shows:
- Unread notification count badge
- List of recent notifications
- Auto-updates when new notifications arrive

## Monitoring & Troubleshooting

### Check Edge Function Logs

```bash
# View logs in real-time
supabase functions list
supabase functions describe publish-scheduled-posts

# Or via dashboard: Functions → publish-scheduled-posts → Logs tab
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Missing credentials" error | Check environment variables in supabase/.env |
| Posts not publishing | Verify scheduled_for is in the past |
| Token refresh fails | Ensure OAuth tokens are still valid; user needs to re-connect |
| Rate limiting (429 errors) | System will retry with backoff; check platform rate limits |
| LinkedIn post fails | LinkedIn requires re-auth every 60 days (notifications will prompt) |

### Manual Trigger

To test without waiting for cron schedule:

```bash
# Trigger immediately
curl -X POST https://your-project.supabase.co/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer YOUR-SERVICE-ROLE-KEY" \
  -H "Content-Type: application/json" \
  -d '{"scheduled": true, "timestamp": "'$(date -Iseconds)'"}'
```

## Production Checklist

- [ ] Database migrations applied (notifications table, error tracking)
- [ ] Edge function deployed to Supabase
- [ ] .env file created with all API keys (NOT in git)
- [ ] Service role key stored in database setting
- [ ] pg_cron job created and verified
- [ ] Test post published successfully
- [ ] Notifications appear in UI
- [ ] Platform post ID saved to database
- [ ] Error handling tested (create failing scenario)
- [ ] Real API keys configured (not staging/test keys)
- [ ] Notification bell added to header
- [ ] Deployment to production pushed to GitHub

## Scaling Considerations

Current limits:
- Max 50 posts per run (configurable in index.ts)
- Runs every 5 minutes (configurable via cron expression)
- 120 second timeout per edge function invocation

For high volume:
- Increase `limit(50)` in SQL query
- Adjust cron schedule to run more frequently
- Implement queue system for very high volume (1000+ posts/day)

## Security Notes

- Service role key stored in database as setting (uses PostgreSQL privilege system)
- RLS policies enforce that users can only see their own notifications
- Edge function uses service role for system operations only
- Platform API keys stored as environment variables (not in database)
- No sensitive data logged to console in production

## Support

For issues:
1. Check Supabase logs: Dashboard → Functions → Logs
2. Review database error_details JSONB field for specifics
3. Check notification message for user-facing error details
4. Monitor pg_cron job runs: SELECT * FROM cron.job_run_details

## Next Steps

- [ ] Test with real posts and verify all platforms work
- [ ] Set up monitoring/alerting for failed posts
- [ ] Create admin dashboard for monitoring publishing system
- [ ] Implement automatic analytics sync from platforms
- [ ] Add support for scheduling across multiple time zones
