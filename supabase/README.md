# Supabase Edge Functions (Backup/Alternative Implementation)

> ✅ **ACTIVE IMPLEMENTATION** - Supabase Edge Functions + pg_cron (every 5 minutes)
>
> ⚠️ **BACKUP:** Vercel Cron (`/app/api/cron/publish/route.ts`) - runs daily

## What's in this folder?

This folder contains a **complete Supabase Edge Functions implementation** for publishing scheduled posts. It was created before switching to Vercel Cron.

### Structure:

```
supabase/functions/publish-scheduled-posts/
├── index.ts                    (9.3 KB) - Main handler, fetches & publishes posts
├── notification-service.ts     (4.7 KB) - Creates success/error notifications
├── retry-handler.ts            (5.9 KB) - Exponential backoff retry logic
├── token-manager.ts            (6.8 KB) - Token refresh & expiry management
├── supabase.json                       - Edge Function config
└── publishers/
    ├── twitter-publisher.ts    (5 KB)   - Twitter API v2 integration
    ├── linkedin-publisher.ts   (6.8 KB) - LinkedIn UGC Posts API
    └── tiktok-publisher.ts     (7.3 KB) - TikTok API integration
```

## Why keep this?

**Advantages (Why this is NOW ACTIVE):**
- ✅ **Frequent runs**: Every 5 minutes vs daily
- ✅ **Free**: Supabase Free tier vs Vercel limits
- ✅ **TikTok ready**: Full implementation included
- ✅ **Robust retry logic**: Exponential backoff
- ✅ **User notifications**: Creates DB notifications
- ✅ **Media upload support**: Twitter v1.1 API

**Disadvantages:**
- ❌ Requires manual deployment (Supabase CLI)
- ❌ Separate infrastructure to maintain
- ❌ More complex setup (pg_cron + Edge Function)
- ❌ Not auto-deployed with git push

## When to use this?

Deploy this Supabase Edge Function implementation if you need:

1. **TikTok Publishing** - Already implemented in `publishers/tiktok-publisher.ts`
2. **Media Upload for Twitter** - Uses v1.1 API for media
3. **Advanced Retry Logic** - Exponential backoff with max retries
4. **User Notifications** - Automatic notification creation on publish/fail
5. **Separate Infrastructure** - Want publishing separate from main app

## How to deploy (if needed)

### Prerequisites:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link to your Supabase project:
```bash
supabase login
supabase link --project-ref zthibjgjsuyovieipddd
```

### Deploy Edge Function:

```bash
# From project root
supabase functions deploy publish-scheduled-posts
```

### Set Environment Variables:

```bash
supabase secrets set \
  TWITTER_CLIENT_ID=your_twitter_client_id \
  TWITTER_CLIENT_SECRET=your_twitter_client_secret \
  LINKEDIN_CLIENT_ID=your_linkedin_client_id \
  LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret \
  TIKTOK_CLIENT_KEY=your_tiktok_client_key \
  TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

### Setup pg_cron (Supabase Dashboard):

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job to run every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

### Test manually:

```bash
curl -X POST https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Current Status

- **Deployed:** ✅ Yes (Edge Function active)
- **Used:** ✅ Yes (primary publishing system)
- **Tested:** ✅ Production ready
- **Complete:** ✅ Yes (TikTok + all platforms)

## Migration Path

If you want to switch from Vercel Cron to Supabase Edge Functions:

1. Deploy this Edge Function (see above)
2. Set up pg_cron schedule
3. Remove `vercel.json` cron configuration
4. Test publishing works
5. Monitor Supabase Function logs

## Performance Impact

- **On Next.js build:** ❌ None (not included in build)
- **On Vercel deploy:** ❌ None (not deployed to Vercel)
- **On git operations:** ✅ Minimal (~35 KB total)
- **On runtime:** ❌ None (code not executed)

## Maintenance

This code is kept as:
- 📦 **Backup** - In case Vercel Cron has issues
- 🔄 **Alternative** - If you need advanced features
- 📚 **Reference** - For TikTok/media upload implementation
- 🎯 **Future** - Ready to deploy when needed

---

**Last Updated:** December 2024
**Status:** Inactive (backup implementation)
**Active System:** Vercel Cron (`/app/api/cron/publish/route.ts`)
