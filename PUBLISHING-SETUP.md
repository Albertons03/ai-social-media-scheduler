# Automatic Post Publishing Setup

This guide explains how to set up automatic publishing for scheduled posts.

## How It Works

The application uses **Vercel Cron Jobs** to automatically publish scheduled posts every 5 minutes.

### Architecture

1. **Vercel Cron** triggers `/api/cron/publish` every 5 minutes
2. The API endpoint queries the database for posts where:
   - `status = 'scheduled'`
   - `scheduled_for <= current_time`
3. For each post, it:
   - Checks if the social account token is valid
   - Refreshes the token if needed
   - Publishes to the platform (Twitter, LinkedIn, TikTok)
   - Updates the post status to `published` or `failed`

## Setup Instructions

### 1. Environment Variables

Add these to your Vercel environment variables:

```env
# Twitter API Credentials (required for Twitter publishing)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn API Credentials (required for LinkedIn publishing)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Cron Job Security
CRON_SECRET=your_random_secret_string
```

**Generate CRON_SECRET:**

```bash
# Use this command to generate a random secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Vercel Cron Configuration

The `vercel.json` file is already configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes: `*/5 * * * *`

### 3. Deploy to Vercel

```bash
git add .
git commit -m "feat: Add automatic post publishing with Vercel Cron"
git push origin master
```

Vercel will automatically detect the cron configuration and set it up.

### 4. Verify Cron is Running

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Cron Jobs**
3. You should see: `POST /api/cron/publish` running every 5 minutes

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
| TikTok   | ⏳ Planned     | Not yet implemented                     |

## Rate Limits

- **Vercel Cron:** 50 executions per month on Hobby plan, unlimited on Pro
- **Twitter API:** 1,500 tweets per month (Free tier), check your plan
- **Processing:** Max 50 posts per cron run

## Security

- The cron endpoint requires `CRON_SECRET` in the Authorization header
- Only Vercel can trigger the cron job automatically
- Manual triggers require the secret

## Monitoring

### Success Indicators

- Post status changes from `scheduled` → `published`
- `published_at` timestamp is set
- Platform post ID is stored (e.g., `twitter_post_id`)

### Failure Indicators

- Post status changes to `failed`
- `error_message` contains details
- `retry_count` increments

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
