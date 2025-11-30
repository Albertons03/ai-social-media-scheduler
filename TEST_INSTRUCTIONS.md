# TikTok Connection - How to Test the Fix

## Summary
The TikTok connection error has been fixed by reducing OAuth scopes from `user.info.basic,video.upload,video.publish` to just `user.info.basic` (the only approved scope).

---

## Test Option 1: Manual Browser Test (Recommended)

### Prerequisites
- Dev server running: `npm run dev` (should be at `http://localhost:3000`)
- Logged into your test account

### Steps
1. **Open Settings Page**
   - Navigate to: `http://localhost:3000/settings`

2. **Locate TikTok Section**
   - Scroll down to "Connected Social Media Accounts"
   - Look for the TikTok card (pink/purple gradient logo with "T")

3. **Click Connect Button**
   - If TikTok is not connected: click blue "Connect TikTok" button
   - If already connected: click the kebab menu (⋯) to manage

4. **Complete OAuth Flow**
   - You'll be redirected to TikTok's authorization page
   - Choose to authorize the app
   - You'll be returned to settings page

5. **Verify Success**
   - Look for:
     - ✓ Green "Connected" badge
     - ✓ Your TikTok username displayed
     - ✓ Token expiration time shown
     - ✓ Option to disconnect account

---

## Test Option 2: API Endpoint Test

### Check OAuth Initiation
```bash
# This verifies the OAuth endpoint responds correctly
curl -i http://localhost:3000/api/auth/tiktok
```

Expected response:
```
HTTP/1.1 307 Temporary Redirect
location: http://localhost:3000/login  # (if not authenticated)
```

Or if authenticated, it should redirect to TikTok's auth URL with `scope=user.info.basic`.

### Verify the Scope is Correct
```bash
# Check that the correct scope is in the code
grep "scope=user.info.basic" app/api/auth/tiktok/route.ts
```

Expected output:
```
scope=user.info.basic&response_type=code&redirect_uri=
```

---

## Test Option 3: Automated Validation

### Check for the fix
```bash
# Verify the problematic scopes are NO LONGER in the code
if grep -q "video.upload" app/api/auth/tiktok/route.ts; then
  echo "❌ Old scope still present - fix not applied"
else
  echo "✓ Fix confirmed - old scopes removed"
fi
```

### Check that basic scope is present
```bash
grep "scope=user.info.basic" app/api/auth/tiktok/route.ts && \
echo "✓ Correct scope is in place"
```

---

## Expected Test Results

### Success Indicators
- [ ] Settings page loads without errors
- [ ] "Connect TikTok" button is clickable
- [ ] Clicking redirects to TikTok's authorization page
- [ ] TikTok shows the app asking for "user.info.basic" permission
- [ ] After authorizing, page returns to settings
- [ ] Settings page shows connected status
- [ ] Token expiration time is displayed

### Error Cases (Should Handle Gracefully)
- [ ] If user denies permission → redirect to settings with error message
- [ ] If OAuth state is invalid → show error
- [ ] If tokens fail to exchange → show error

---

## Troubleshooting

### Problem: Page stuck at TikTok auth screen
**Solution:**
- Clear browser cookies
- Try incognito/private window
- Check if cookies are enabled in browser settings

### Problem: "Client key not configured" error
**Solution:**
- Check `.env.local` has: `TIKTOK_CLIENT_KEY=awidjo317lw1p5o1`
- Restart dev server: `npm run dev`

### Problem: "Invalid state" error after authorizing
**Solution:**
- Check browser allows third-party cookies
- Try a different browser
- Check firewall/VPN isn't blocking callbacks

### Problem: OAuth URL has wrong parameters
**Solution:**
- Run: `grep -n "scope=" app/api/auth/tiktok/route.ts`
- Should show: `scope=user.info.basic` (NOT video scopes)
- If wrong, restart dev server

### Problem: Cannot see "Connect TikTok" button on settings
**Solution:**
- Make sure you're logged in
- Check you're on `/settings` page
- Scroll to "Connected Social Media Accounts" section
- If TikTok already connected, button will say "Manage" instead

---

## Files to Check

### Main Fix
- `app/api/auth/tiktok/route.ts` (line 31)
  - Should have: `scope=user.info.basic`
  - NOT: `video.upload,video.publish`

### OAuth Callback (No changes needed)
- `app/api/auth/callback/tiktok/route.ts`
- Handles the OAuth callback from TikTok

### Settings UI (No changes needed)
- `app/(dashboard)/settings/page.tsx` (lines 112-180)
- Displays TikTok connection status

---

## Test Checklist

**Pre-Test**
- [ ] Dev server running: `npm run dev`
- [ ] Can access: `http://localhost:3000`
- [ ] Logged in with test account

**During Test**
- [ ] Navigate to settings
- [ ] Find TikTok section
- [ ] Click "Connect TikTok"
- [ ] Authorize on TikTok page
- [ ] Return to settings

**Post-Test**
- [ ] See "Connected" status
- [ ] See your TikTok username
- [ ] See token expiration time
- [ ] Can click kebab menu to manage account

---

## Documentation Files

These files have been created to help with testing:

1. **QUICK_TEST.md** - 3-minute quick test guide
2. **TIKTOK_TEST_GUIDE.md** - Comprehensive testing procedures
3. **FIX_SUMMARY.md** - Technical details of the fix
4. **TEST_INSTRUCTIONS.md** - This file

---

## What Changed (Technical)

**Before (Broken)**
```typescript
scope=user.info.basic,video.upload,video.publish
// ❌ TikTok rejected this because video scopes weren't approved
```

**After (Fixed)**
```typescript
scope=user.info.basic
// ✓ TikTok accepts this - it's an approved scope
```

The fix is a one-line change that removes unapproved scopes from the OAuth request.

---

## Next Steps

### Short term
- [ ] Test the TikTok connection manually
- [ ] Verify all test cases pass

### Medium term
- [ ] Deploy to production
- [ ] Monitor for any OAuth-related errors

### Long term
- [ ] Request TikTok scope approval for video upload/publish features
- [ ] Implement video posting functionality once approved
- [ ] Add tests to prevent regression

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs: `npm run dev` output
3. Check browser console for JavaScript errors
4. Verify `.env.local` has correct TikTok credentials
5. Review the TikTok Developer Dashboard settings

Good luck with your testing! 🚀
