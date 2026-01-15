# Supabase Edge Functions Deployment Guide

## 🎯 Why Switch to Supabase?

- ✅ **Frequent Publishing**: Every 5 minutes vs Vercel's daily
- ✅ **Free**: Supabase Free tier (1M Edge Function invocations/month)
- ✅ **TikTok Ready**: Full implementation included
- ✅ **Better Architecture**: Retry logic + notifications

## 📋 Prerequisites

1. **Supabase CLI installed**
```bash
npm install -g supabase
```

2. **Project linked**
```bash
supabase login
supabase link --project-ref zthibjgjsuyovieipddd
```

## 🚀 Step 1: Deploy Edge Function

```bash
# From project root (d:\ai-personal-tiktok-scheduler)
supabase functions deploy publish-scheduled-posts
```

**Expected output:**
```
Deploying function publish-scheduled-posts...
Function deployed successfully!
URL: https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts
```

## 🔑 Step 2: Set Environment Variables

```bash
supabase secrets set \
  TWITTER_CLIENT_ID=your_twitter_client_id \
  TWITTER_CLIENT_SECRET=your_twitter_client_secret \
  LINKEDIN_CLIENT_ID=your_linkedin_client_id \
  LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret \
  TIKTOK_CLIENT_KEY=awidjo317lw1p5o1 \
  TIKTOK_CLIENT_SECRET=BD3yz7Re3QMoO6R6BsRij7yGDhdI4LdV \
  OPENAI_API_KEY=your_openai_api_key
```

**Or set them via Supabase Dashboard:**
1. Go to https://supabase.com/dashboard/project/zthibjgjsuyovieipddd/functions
2. Select `publish-scheduled-posts`
3. Go to Settings → Environment Variables

## ⏰ Step 3: Setup pg_cron (Already Done)

The `setup-cron.sql` file is already configured. Run it in Supabase SQL Editor:

```sql
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the Edge Function to run every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-posts-job',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

## ✅ Step 4: Verify Deployment

### Check Edge Function:
```bash
curl -X POST https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Check pg_cron Job:
```sql
-- Verify cron job exists
SELECT * FROM cron.job WHERE jobname = 'publish-scheduled-posts-job';

-- Check recent runs
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'publish-scheduled-posts-job')
ORDER BY start_time DESC LIMIT 5;
```

## 🔧 Testing

### Manual Test:
1. Create a TikTok post in the dashboard
2. Schedule it for immediate publishing  
3. Wait 5 minutes (next cron run)
4. Check if status changed to 'published'

### Check Logs:
- **Edge Function Logs**: Supabase Dashboard → Functions → publish-scheduled-posts → Logs
- **Cron Logs**: SQL Editor → `SELECT * FROM cron.job_run_details`

## 📊 Monitoring

### Success Indicators:
- **Posts**: Status changes from 'scheduled' → 'published'
- **Notifications**: Success/failure entries in `notifications` table
- **Cron**: Regular entries in `cron.job_run_details` every 5 minutes

### Key Metrics:
- **Frequency**: Every 5 minutes (vs Vercel's daily)
- **Platforms**: Twitter ✅ LinkedIn ✅ **TikTok ✅**
- **Features**: Retry logic, notifications, media upload

## 🎉 What You Get

### **Publishing Flow:**
1. **Every 5 minutes**: pg_cron triggers Edge Function
2. **Fetch posts**: Where `status='scheduled'` and `scheduled_for <= now()`
3. **For each platform**: 
   - Check/refresh tokens (auto-refresh 5min before expiry)
   - Publish content (with retry logic)
   - Update database (status, post_id, timestamps)
   - Send notifications (success/failure)

### **TikTok Publishing:**
- ✅ Video upload with chunking (10MB chunks)
- ✅ Privacy settings (PUBLIC/FRIENDS/PRIVATE) 
- ✅ Post settings (comments, duet, stitch)
- ✅ Status polling until complete
- ✅ Error handling with detailed messages

### **Advantages Over Vercel:**
| Feature | Supabase Edge | Vercel Cron |
|---------|---------------|-------------|
| Frequency | Every 5 min | Daily |
| TikTok | ✅ Full support | ❌ Basic only |
| Retry Logic | ✅ Exponential backoff | ❌ Simple |
| Notifications | ✅ Auto-created | ❌ None |
| Cost | ✅ Free (1M/month) | ❌ Limited |

## 🚨 Important Notes

1. **Vercel Cron Disabled**: `vercel.json` cron removed to avoid conflicts
2. **Environment Variables**: Set in Supabase (not Vercel)
3. **Logs**: Check Supabase Function logs (not Vercel)
4. **Testing**: Use Supabase URL for manual triggers

## 📈 Next Steps

1. ✅ Deploy Edge Function
2. ✅ Set environment variables  
3. ✅ Verify pg_cron is running
4. ✅ Test with a TikTok post
5. ✅ Monitor logs and notifications

---

**Status**: ✅ Ready to deploy  
**Frequency**: Every 5 minutes  
**Platforms**: Twitter, LinkedIn, **TikTok**  
**Cost**: Free (Supabase tier)