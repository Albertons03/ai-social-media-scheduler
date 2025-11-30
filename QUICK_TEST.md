# Quick Test - TikTok Connection Fix

## 3-Minute Manual Test

### Step 1: Start the app
```bash
npm run dev
```

### Step 2: Open the settings page
- Open browser: `http://localhost:3000`
- Login with your test account
- Navigate to **Settings** (top navigation or `/settings`)

### Step 3: Try to connect TikTok
- Scroll to **"Connected Social Media Accounts"** section
- Find the TikTok card (pink/purple gradient with "T" logo)
- Click the blue **"Connect TikTok"** button

### Step 4: Verify the OAuth flow
You should see:
1. Redirect to TikTok's authorization page
2. TikTok asks you to authorize the app
3. After authorizing, redirect back to settings page
4. Settings page shows your TikTok account as **Connected**

---

## What We Fixed

**Before:** OAuth request had unapproved scopes → TikTok rejected it
```
scope=user.info.basic,video.upload,video.publish  ❌ FAILED
```

**After:** OAuth request uses only approved scope → TikTok accepts it
```
scope=user.info.basic  ✓ WORKING
```

---

## Success Indicators

When working correctly, you'll see on the settings page:

```
✓ Connected
@ your_tiktok_username
Token expires in: X hours
```

Plus action buttons to manage the account.

---

## If Something Goes Wrong

**Error: Redirect loop**
- Check browser cookies are enabled
- Try incognito/private window

**Error: "Invalid state"**
- Cookies might be blocked
- Check browser privacy settings

**Error: "Client key not configured"**
- `.env.local` might be missing `TIKTOK_CLIENT_KEY`
- Restart `npm run dev` after fixing env

**Error: "The request parameters are malformed"**
- Check redirect URI matches TikTok Developer Dashboard
- Make sure client key/secret are correct

---

## File Changed

- **`app/api/auth/tiktok/route.ts`** (line 31)
  - Changed scope from `user.info.basic,video.upload,video.publish`
  - To: `user.info.basic`

That's it! The fix is simple but critical.

---

## Full Testing Guide

See `TIKTOK_TEST_GUIDE.md` for comprehensive testing procedures.
