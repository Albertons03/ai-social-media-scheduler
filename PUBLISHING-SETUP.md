# Automatic Post Publishing Setup

This guide explains how to set up automatic publishing for scheduled posts using **Supabase Edge Functions**.

## How It Works

The application uses **Supabase Edge Functions + pg_cron** to automatically publish scheduled posts **every 5 minutes**.

### Architecture

1. **pg_cron** triggers Supabase Edge Function every 5 minutes
2. The Edge Function queries the database for posts where:
   - `status = 'scheduled'`
   - `scheduled_for <= current_time`
3. For each post, it:
   - Checks if the social account token is valid
   - Refreshes the token if needed
   - Publishes to the platform (Twitter, LinkedIn, **TikTok**)
   - Updates the post status to `published` or `failed`
   - Creates success/failure notifications
   - Sends email notifications

## Why Supabase Edge Functions?

**Advantages over Vercel Cron:**
- ✅ **Frequent runs**: Every 5 minutes vs daily
- ✅ **Free**: Supabase Free tier (1M invocations/month)  
- ✅ **TikTok included**: Full video upload implementation
- ✅ **Retry logic**: Exponential backoff on failures
- ✅ **Notifications**: Auto-created user notifications
- ✅ **Media support**: Twitter image/video upload

## Setup Instructions

### 1. Deploy Supabase Edge Function

**Quick Deploy:**
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login and link project
supabase login  
supabase link --project-ref zthibjgjsuyovieipddd

# Deploy the function
supabase functions deploy publish-scheduled-posts
```

### 2. Environment Variables

Set these in **Supabase Dashboard** (not Vercel):

Go to: https://supabase.com/dashboard/project/zthibjgjsuyovieipddd/functions → publish-scheduled-posts → Settings

```env
# TikTok API Configuration (required for TikTok publishing)  
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# LinkedIn API Credentials (required for LinkedIn publishing)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Twitter API Credentials (required for Twitter publishing)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Setup pg_cron (Database)

Run this in **Supabase SQL Editor**:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-posts-job',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

### 4. Verify Setup

Check if everything is working:

```sql
-- Verify cron job exists
SELECT * FROM cron.job WHERE jobname = 'publish-scheduled-posts-job';

-- Check recent runs  
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'publish-scheduled-posts-job')
ORDER BY start_time DESC LIMIT 5;
```

## Testing

### Manual Trigger (for testing)

You can manually trigger the publishing endpoint:

```bash
# Using curl (replace YOUR_CRON_SECRET)
curl -X POST https://landingbits.net/api/cron/publish \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Or use the browser (GET method, shows status only)
https://landingbits.net/api/cron/publish
```

### Check Logs

View logs in Vercel Dashboard:

1. Go to **Deployments** → Select your deployment
2. Click on **Functions**
3. Find `/api/cron/publish`
4. View logs

## Troubleshooting

### Posts Not Publishing

**Check 1: Cron Job is Active**

- Vercel Dashboard → Settings → Cron Jobs
- Ensure the cron job appears and is enabled

**Check 2: Environment Variables**

- Vercel Dashboard → Settings → Environment Variables
- Verify `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `CRON_SECRET` are set

**Check 3: Token Validity**

- Go to Settings page in the app
- Check if your Twitter account is connected
- Reconnect if needed

**Check 4: Post Status**

- Posts must have `status = 'scheduled'`
- `scheduled_for` must be in the past
- Must have a connected `social_account_id`

### View Error Messages

Failed posts will have:

- `status = 'failed'`
- `error_message` field with details

Check the database or view in the app's schedule page.

## Supported Platforms

| Platform | Status         | Notes                                   |
| -------- | -------------- | --------------------------------------- |
| Twitter  | ✅ Implemented | Text-only tweets (OAuth 2.0 limitation) |
| LinkedIn | ✅ Implemented | Text posts, public visibility           |
| TikTok   | ✅ Implemented | Video posts with chunked upload         |

## Rate Limits & Performance

- **Supabase Edge Functions:** 1M invocations/month (Free tier)
- **pg_cron:** Runs every 5 minutes (288 times/day)
- **Twitter API:** 1,500 tweets per month (Free tier)
- **Processing:** Unlimited posts per run with retry logic

## Security

- **Edge Function Authentication**: Uses Supabase service role key
- **pg_cron Security**: Runs within Supabase's secure environment  
- **Token Management**: Automatic refresh with secure storage
- **API Rate Limiting**: Built-in Supabase protections

## Monitoring

### Success Indicators

- Post status changes from `scheduled` → `published`
- `published_at` timestamp is set
- Platform post ID is stored (e.g., `twitter_post_id`, `tiktok_post_id`)
- Success notification created in `notifications` table
- Success email sent (if configured)

### Failure Indicators

- Post status changes to `failed`
- `error_message` contains details  
- `retry_count` increments (with exponential backoff)
- Error notification created in `notifications` table
- Failure email sent (if configured)

### Monitoring Queries

```sql
-- Check recent publishing activity
SELECT * FROM posts 
WHERE status IN ('published', 'failed')
ORDER BY updated_at DESC LIMIT 10;

-- View notifications
SELECT * FROM notifications
ORDER BY created_at DESC LIMIT 10;

-- Check cron job health
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'publish-scheduled-posts-job')
ORDER BY start_time DESC LIMIT 5;
```

## Next Steps

After setup:

1. ✅ Connect your Twitter account in Settings
2. ✅ Create a post and schedule it
3. ✅ Wait 5 minutes (or trigger manually for testing)
4. ✅ Check if the post was published on Twitter
5. ✅ View logs in Vercel Dashboard

## Support

If you encounter issues:

1. Check the Vercel function logs
2. Verify environment variables
3. Check post error_message in database
4. Ensure Twitter tokens are valid
