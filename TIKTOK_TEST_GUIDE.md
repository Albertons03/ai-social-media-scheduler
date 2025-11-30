# TikTok Connection Test Guide

## Quick Manual Test (Recommended)

### Prerequisites
- Dev server running: `npm run dev`
- TikTok account with developer app set up
- `.env.local` configured with TikTok credentials

### Step-by-Step Manual Test

1. **Start the application**
   ```bash
   npm run dev
   ```
   Visit: `http://localhost:3000`

2. **Sign in**
   - Log in with your test account

3. **Navigate to Settings**
   - Go to: `http://localhost:3000/settings`

4. **Find the TikTok Connection Section**
   - Scroll to "Connected Social Media Accounts"
   - Look for the TikTok section with the pink/purple gradient "T" logo

5. **Click "Connect TikTok"**
   - You should see the button if TikTok is not yet connected
   - Button label: "Connect TikTok" with an external link icon

6. **Expected Behavior**
   - ✓ You'll be redirected to TikTok's authorization page
   - ✓ TikTok will ask for permission (user.info.basic scope)
   - ✓ After authorizing, you return to `/settings?success=tiktok_connected`
   - ✓ The TikTok section now shows:
     - ✓ Status badge: "Connected"
     - ✓ Your TikTok username
     - ✓ Token expiration time
     - ✓ Disconnect option

## API Endpoint Test

### Test the OAuth initiation endpoint directly

```bash
# This should redirect you to TikTok's auth page
curl -i http://localhost:3000/api/auth/tiktok

# Expected: 307 Redirect to https://www.tiktok.com/v2/auth/authorize/?...
```

### Check the OAuth callback is working

```bash
# Simulate a callback (won't work without valid auth code from TikTok)
curl -i "http://localhost:3000/api/auth/callback/tiktok?code=test&state=test"

# Expected: Either error redirect or success redirect depending on auth
```

## Verification Checklist

- [ ] Can navigate to `/settings` without errors
- [ ] "Connect TikTok" button appears when not connected
- [ ] Clicking button redirects to TikTok's authorization page
- [ ] After authorizing, redirected back to settings
- [ ] Settings page shows connected TikTok account
- [ ] Token expiry time is displayed correctly
- [ ] Can disconnect account from settings
- [ ] Error messages appear if:
  - [ ] Missing TikTok client key
  - [ ] Missing TikTok client secret
  - [ ] Invalid authorization code

## Environment Variables to Verify

Make sure `.env.local` has these TikTok settings:

```env
TIKTOK_CLIENT_KEY=awidjo317lw1p5o1
TIKTOK_CLIENT_SECRET=BD3yz7Re3QMoO6R6BsRij7yGDhdI4LdV
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiktok
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Issue: "TikTok client key not configured"
- **Solution**: Check `.env.local` has `TIKTOK_CLIENT_KEY` set
- **File**: `D:\ai-personal-tiktok-scheduler\app\api\auth\tiktok\route.ts` (line 19-24)

### Issue: Redirect loop or invalid state error
- **Solution**: Cookies might be blocked. Check:
  - Browser allows cookies
  - HTTPS in production (localhost OK for development)
  - Same-site cookie policy

### Issue: "The request parameters are malformed"
- **Solution**: This means TikTok is rejecting the OAuth request
- **Check**:
  - Redirect URI matches exactly in TikTok Developer Dashboard
  - Client key and secret are correct
  - Query parameters don't have invalid characters

### Issue: Cannot request video scopes
- **Solution**: TikTok hasn't approved `video.upload` and `video.publish` for your app
- **Current Fix**: Using only `user.info.basic` scope (line 31)
- **To Enable Video**: Request approval in TikTok Developer Dashboard

## What Changed

**File:** `app/api/auth/tiktok/route.ts`

```diff
- scope=user.info.basic,video.upload,video.publish
+ scope=user.info.basic
```

This change restricts to only the approved scope to fix the OAuth error.

## References

- TikTok API Docs: https://developers.tiktok.com/doc/oauth-user-access-token-management
- Code: `app/api/auth/tiktok/route.ts` (OAuth initiation)
- Code: `app/api/auth/callback/tiktok/route.ts` (OAuth callback)
- Settings UI: `app/(dashboard)/settings/page.tsx` (TikTok section: lines 112-180)
