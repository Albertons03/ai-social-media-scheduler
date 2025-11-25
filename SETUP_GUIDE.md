# Setup Guide - Social Media Scheduler

This guide will walk you through setting up all the necessary API keys and integrations for the Social Media Scheduler application.

## Table of Contents
1. [Supabase Setup](#1-supabase-setup)
2. [OpenAI API Key](#2-openai-api-key)
3. [TikTok API Setup](#3-tiktok-api-setup)
4. [LinkedIn API Setup](#4-linkedin-api-setup)
5. [Twitter/X API Setup](#5-twitterx-api-setup)

---

## 1. Supabase Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Fill in:
   - **Project name**: social-scheduler (or your preferred name)
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### Step 2: Get API Keys
1. In your Supabase dashboard, click "Project Settings" (gear icon)
2. Click "API" in the sidebar
3. Copy these values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (click to reveal): `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Run Database Schema
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open `supabase-schema.sql` from your project
4. Copy all contents and paste into the SQL Editor
5. Click "Run" to execute the schema
6. You should see success messages

### Step 4: Configure Authentication
1. Go to "Authentication" → "Providers"
2. Enable "Email" provider
3. Optionally enable other providers (Google, GitHub, etc.)

### Step 5: Set up Storage
1. Go to "Storage" in the sidebar
2. Create a new bucket called "media"
3. Set it to "Public" bucket
4. Add policy to allow authenticated users to upload

---

## 2. OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or sign in
3. Click your profile icon → "View API Keys"

### Step 2: Generate API Key
1. Click "Create new secret key"
2. Name it "Social Scheduler"
3. Copy the key immediately (you won't see it again!)
4. Save it as `OPENAI_API_KEY`

### Step 3: Add Credits
1. Go to "Billing" → "Add payment method"
2. Add a credit card
3. Set spending limits if desired

**Note**: GPT-4 API costs approximately $0.03 per 1K input tokens and $0.06 per 1K output tokens.

---

## 3. TikTok API Setup

### Step 1: Register as a Developer
1. Go to [developers.tiktok.com](https://developers.tiktok.com)
2. Sign in with your TikTok account
3. Complete developer registration

### Step 2: Create an App
1. Go to "My Apps" → "Create an App"
2. Fill in:
   - **App name**: Social Scheduler
   - **Category**: Social Media Tools
   - **Description**: AI-powered social media scheduling tool
3. Submit for review (may take 1-2 days)

### Step 3: Get Credentials
Once approved:
1. Go to your app dashboard
2. Copy:
   - **Client Key**: `TIKTOK_CLIENT_KEY`
   - **Client Secret**: `TIKTOK_CLIENT_SECRET`

### Step 4: Configure Redirect URI
1. In app settings, add redirect URI:
   ```
   http://localhost:3000/api/auth/callback/tiktok
   ```
2. For production, also add:
   ```
   https://yourdomain.com/api/auth/callback/tiktok
   ```

### Step 5: Request Permissions
Request these scopes:
- `user.info.basic`
- `video.upload`
- `video.publish`
- `video.list`

---

## 4. LinkedIn API Setup

### Step 1: Create LinkedIn App
1. Go to [linkedin.com/developers](https://www.linkedin.com/developers)
2. Click "Create App"
3. Fill in:
   - **App name**: Social Scheduler
   - **LinkedIn Page**: Create or select a page
   - **Privacy policy URL**: Your privacy policy
   - **App logo**: Upload a logo

### Step 2: Get Credentials
1. Go to "Auth" tab
2. Copy:
   - **Client ID**: `LINKEDIN_CLIENT_ID`
   - **Client Secret**: `LINKEDIN_CLIENT_SECRET`

### Step 3: Configure Redirect URLs
1. In "Auth" tab, add redirect URLs:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://yourdomain.com/api/auth/callback/linkedin
   ```

### Step 4: Request Products
1. Go to "Products" tab
2. Request access to:
   - **Share on LinkedIn** (required)
   - **Sign In with LinkedIn** (required)
3. Wait for approval (usually instant)

---

## 5. Twitter/X API Setup

### Step 1: Apply for Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your Twitter/X account
3. Click "Apply for a developer account"
4. Fill in application details:
   - **Use case**: Social media management tool
   - **Description**: Tool for scheduling and managing tweets
5. Wait for approval (1-2 days)

### Step 2: Create Project and App
Once approved:
1. Go to Developer Portal
2. Create a new Project
3. Create an App within that project

### Step 3: Get API Keys
1. In your app dashboard, go to "Keys and tokens"
2. Generate and copy:
   - **API Key**: `TWITTER_CLIENT_ID`
   - **API Secret Key**: `TWITTER_CLIENT_SECRET`
   - **Bearer Token**: `TWITTER_BEARER_TOKEN`

### Step 4: Configure OAuth 2.0
1. Go to app settings
2. Enable OAuth 2.0
3. Add callback URLs:
   ```
   http://localhost:3000/api/auth/callback/twitter
   https://yourdomain.com/api/auth/callback/twitter
   ```

### Step 5: Set App Permissions
1. Go to "User authentication settings"
2. Enable:
   - Read and write tweets
   - Read and write direct messages (optional)
3. Save settings

---

## Environment Variables Summary

After completing all setups, your `.env.local` should look like this:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# TikTok
TIKTOK_CLIENT_KEY=aw_xxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxx
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiktok

# LinkedIn
LINKEDIN_CLIENT_ID=xxxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxx
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/callback/linkedin

# Twitter/X
TWITTER_CLIENT_ID=xxxxxxxxxxxxx
TWITTER_CLIENT_SECRET=xxxxxxxxxxxxx
TWITTER_REDIRECT_URI=http://localhost:3000/api/auth/callback/twitter
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAxxxxxxxxxxxxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Testing Your Setup

### Test Supabase Connection
```bash
npm run dev
```
- Navigate to http://localhost:3000
- Try signing up for an account
- If successful, Supabase is working!

### Test OpenAI (once implemented)
- Go to the post creation page
- Click "Generate with AI"
- Should receive AI-generated content

### Test Social Media Integrations (once implemented)
- Go to settings/integrations
- Click "Connect" for each platform
- Should redirect to OAuth flow
- After authorization, should show "Connected"

---

## Troubleshooting

### Supabase Issues
- **Can't connect**: Check URL and keys are correct
- **Auth not working**: Verify Email provider is enabled
- **Database errors**: Ensure schema was run successfully

### OpenAI Issues
- **API errors**: Check key is valid and has credits
- **Rate limits**: Add payment method to increase limits

### Social Media API Issues
- **TikTok**: Ensure app is approved and scopes are correct
- **LinkedIn**: Products must be approved for API access
- **Twitter**: Elevated access may be needed for some features

---

## Next Steps

Once all APIs are configured:
1. Restart your development server
2. Test each integration
3. Start building custom features
4. Deploy to production when ready

## Cost Estimates

### API Costs (Monthly for moderate use)
- **Supabase**: Free tier (up to 500MB database)
- **OpenAI GPT-4**: ~$10-50 (depending on usage)
- **TikTok**: Free
- **LinkedIn**: Free (within rate limits)
- **Twitter**: Free (Basic tier) or $100/month (Pro tier for advanced features)

### Recommended: Start with Free Tiers
- Test your application thoroughly
- Monitor usage and costs
- Upgrade as needed

---

## Support Resources

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **TikTok Developer**: [developers.tiktok.com/doc](https://developers.tiktok.com/doc)
- **LinkedIn API**: [docs.microsoft.com/linkedin](https://docs.microsoft.com/en-us/linkedin/)
- **Twitter API**: [developer.twitter.com/en/docs](https://developer.twitter.com/en/docs)

---

Good luck with your Social Media Scheduler! 🚀
