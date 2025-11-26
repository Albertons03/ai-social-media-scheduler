# TikTok Integration Setup Guide

## Overview

This guide walks through setting up TikTok OAuth 2.0 authentication and Content Posting API integration with the AI Social Media Scheduler.

## Prerequisites

- TikTok Developer Account (https://developer.tiktok.com)
- TikTok Creator Account for testing
- Application already set up and deployed
- Environment variables configured

## Step 1: TikTok Developer Setup

### 1.1 Create Developer Account

1. Go to https://developer.tiktok.com
2. Click "Sign Up" or log in with your account
3. Fill out developer profile information
4. Accept terms and conditions
5. Verify email address

### 1.2 Create an Application

1. Dashboard → Create App
2. Fill in application details:
   - **App Name**: "AI Social Media Scheduler" (or your app name)
   - **Category**: Content Platform
   - **Description**: "Platform for scheduling and publishing social media content across TikTok, LinkedIn, and Twitter"
3. Select **Web App** as platform
4. Accept terms
5. Click "Create Application"

### 1.3 Configure OAuth

In your app dashboard:

1. Go to **Permissions** section
2. Request the following OAuth scopes:

   **User Scopes:**
   - `user.info.basic` - Read basic user information

   **Video Scopes:**
   - `video.upload` - Upload videos to user's account
   - `video.publish` - Publish videos
   - `video.list` - Retrieve user's video list

3. Click "Apply" for each scope
4. Wait for approval (usually instant for basic scopes)

### 1.4 Get Credentials

In **App Information** section:

1. Copy **Client Key** (Application ID)
2. Copy **Client Secret** (Keep this secret!)
3. Note your **App ID**

## Step 2: Configure Redirect URI

### 2.1 Set Redirect URI

In your TikTok Developer Dashboard:

1. Go to **Authorizing Apps**
2. Redirect URL:
   ```
   https://yourdomain.com/api/auth/callback/tiktok
   ```

   For local development:
   ```
   http://localhost:3000/api/auth/callback/tiktok
   ```

3. Add additional redirect URLs (if needed):
   - Production URL
   - Staging URL
   - Local development URL

### 2.2 Whitelist Domain

1. Go to **Domains** settings
2. Add your application domain(s):
   - Example: `yourdomain.com`
   - Keep localhost for testing

## Step 3: Environment Variables

Add to your `.env.local` file:

```env
# TikTok OAuth Configuration
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=https://yourdomain.com/api/auth/callback/tiktok

# For local development, also add:
# TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiktok
```

## Step 4: Test OAuth Integration

### 4.1 Test Locally

1. Start development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/settings`

3. Click "Connect TikTok Account"

4. You should be redirected to TikTok login

5. Log in with your TikTok account

6. Review permissions and click "Authorize"

7. You should be redirected back to your app with success message

### 4.2 Verify Token Storage

After successful OAuth:

1. Check Supabase dashboard
2. Go to `social_accounts` table
3. Verify new row with:
   - `platform: 'tiktok'`
   - `access_token` (filled)
   - `refresh_token` (filled)
   - `token_expires_at` (set)
   - `account_id` (open_id from TikTok)

## Step 5: Test Publishing

### 5.1 Create Test Post

1. Go to Dashboard → Create Post
2. Select platform: **TikTok**
3. Upload a video (MP4, MOV format)
4. Fill in caption
5. Configure TikTok-specific settings:
   - Privacy Level: PUBLIC
   - Allow Comments: ON
   - Allow Duet: ON
   - Allow Stitch: ON
6. Click "Schedule for Later"
7. Set time to next available cron window (5 min intervals)

### 5.2 Verify Publishing

1. Wait for scheduled time OR manually trigger edge function:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/publish-scheduled-posts \
     -H "Authorization: Bearer SERVICE_ROLE_KEY" \
     -d '{"scheduled": true}'
   ```

2. Check notifications - should show success

3. Verify post appeared on your TikTok account

4. Check Supabase `posts` table for:
   - `status: 'published'`
   - `published_at: <timestamp>`
   - `tiktok_post_id: <post_id>`

## Step 6: Handle Token Expiry

### 6.1 Token Refresh (Automatic)

TikTok tokens expire in 30 days. The system automatically refreshes:

1. Edge function checks token expiry before publishing
2. If token expires within 5 minutes, refresh is triggered
3. New tokens stored in database
4. Publishing proceeds with fresh token

### 6.2 Manual Token Refresh (if needed)

If token refresh fails:

1. User receives notification in app
2. User must click "Reconnect TikTok" in Settings
3. Go through OAuth flow again
4. New tokens stored

## Step 7: Error Handling Testing

### 7.1 Test Token Expiration Error

1. Simulate expired token in database:
   ```sql
   UPDATE social_accounts
   SET token_expires_at = NOW() - INTERVAL '1 day'
   WHERE platform = 'tiktok'
   ```

2. Try to publish a post

3. System should:
   - Detect expired token
   - Attempt refresh (success or fail)
   - Notify user accordingly

### 7.2 Test Failed Publishing

1. Create a post with invalid content
2. Schedule for publishing
3. System should:
   - Attempt publishing (5 retries)
   - Fail gracefully
   - Update post status to 'failed'
   - Notify user with error message
   - Store error details in database

## Step 8: Production Deployment

### 8.1 Update Redirect URI

In TikTok Developer Dashboard:

1. Add production domain redirect URI:
   ```
   https://your-production-domain.com/api/auth/callback/tiktok
   ```

2. Update in Settings

### 8.2 Set Production Environment Variables

In your production environment (Vercel, etc.):

```env
TIKTOK_CLIENT_KEY=production_client_key
TIKTOK_CLIENT_SECRET=production_client_secret
TIKTOK_REDIRECT_URI=https://your-production-domain.com/api/auth/callback/tiktok
```

### 8.3 Request App Review (if needed)

If not in sandbox mode:

1. Submit app for review in TikTok Developer Dashboard
2. Provide demo video (use DEMO_SCRIPT.md)
3. Wait for approval (usually 3-5 business days)
4. Once approved, access available to all users

## API Endpoints Reference

### OAuth Endpoints

**Authorization:**
```
GET https://www.tiktok.com/v1/oauth/authorize
```

**Token Exchange:**
```
POST https://open.tiktokapis.com/v2/oauth/token/
Parameters:
  - grant_type: authorization_code
  - client_key: YOUR_CLIENT_KEY
  - client_secret: YOUR_CLIENT_SECRET
  - code: authorization_code
  - redirect_uri: YOUR_REDIRECT_URI
```

**Token Refresh:**
```
POST https://open.tiktokapis.com/v2/oauth/token/
Parameters:
  - grant_type: refresh_token
  - client_key: YOUR_CLIENT_KEY
  - client_secret: YOUR_CLIENT_SECRET
  - refresh_token: REFRESH_TOKEN
```

### Content Posting Endpoints

**Initialize Video Upload:**
```
POST https://open.tiktokapis.com/v2/post/publish/video/init/
Headers:
  Authorization: Bearer ACCESS_TOKEN
Body:
  {
    post_info: { title, privacy_level, disable_comment, disable_duet, disable_stitch },
    source_info: { source, video_size, chunk_size, total_chunk_count }
  }
```

**Upload Video Chunk:**
```
PUT {upload_url}
Headers:
  Content-Range: bytes {start}-{end}/{total}
  Content-Type: video/mp4
Body: Video chunk binary data
```

**Get Upload Status:**
```
POST https://open.tiktokapis.com/v2/post/publish/status/fetch/
Headers:
  Authorization: Bearer ACCESS_TOKEN
Body:
  { publish_id: PUBLISH_ID }
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OAuth redirect fails | Check redirect URI matches in TikTok Dashboard and `.env.local` |
| Token refresh fails | Ensure Client Key/Secret are correct; check token hasn't been revoked |
| Video upload fails | Verify video format (MP4/MOV), size, and bitrate meet TikTok requirements |
| Post not appearing | Check privacy settings; verify account isn't shadowbanned; check notifications for errors |
| Notifications not showing | Refresh page; check database for notification records |

## Security Best Practices

1. **Never commit secrets** - Keep `.env.local` out of version control
2. **Rotate secrets regularly** - Regenerate Client Secret periodically
3. **Use HTTPS** - All OAuth and API calls must use HTTPS
4. **Validate tokens** - Verify token expiry before use
5. **Log errors** - Store detailed error information for debugging (without exposing sensitive data)
6. **Monitor activity** - Track failed authentication attempts
7. **Rate limiting** - Implement rate limiting on OAuth endpoints

## Next Steps

1. ✅ Set up TikTok Developer Account
2. ✅ Create Application
3. ✅ Configure OAuth and scopes
4. ✅ Get Client Key and Secret
5. ✅ Set environment variables
6. ✅ Test OAuth locally
7. ✅ Test publishing
8. ✅ Deploy to production
9. ✅ Submit app review (if needed)
10. ✅ Record demo video for approval

## Support

For TikTok API issues:
- TikTok Developer Forum: https://developers.tiktok.com/community
- API Documentation: https://developers.tiktok.com/doc/
- Status Page: https://status.tiktok.com/

For application issues:
- Check `/supabase/functions/publish-scheduled-posts/index.ts`
- Review error logs in Supabase Functions
- Check `notifications` table for error details
