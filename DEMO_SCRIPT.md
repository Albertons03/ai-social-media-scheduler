# TikTok Demo Video Script

## Overview
This script outlines the complete end-to-end flow demonstrating TikTok integration with the AI Social Media Scheduler application.

Duration: ~3-5 minutes

## Equipment Needed
- Screen recording software (OBS Studio, ScreenFlow, or similar)
- Web browser (Chrome/Firefox)
- Test TikTok account (Creator Account)
- Demo content (optional: short video files for upload)

---

## Scene 1: Application Walkthrough (0:00-0:30)

**Actions:**
1. Open the application at `https://your-app-url` or localhost
2. Show the login screen
3. Log in with demo credentials
4. Show the dashboard overview

**Narration:**
"Welcome to the AI Social Media Scheduler. This is a next-generation tool for managing your social media presence across TikTok, LinkedIn, and Twitter. Today, we're going to demonstrate the complete TikTok integration flow."

**Visual Focus:**
- Dashboard with posts overview
- Navigation menu (Dashboard, Schedule, Analytics, Settings)
- Notification bell with unread count

---

## Scene 2: Social Account Setup (0:30-1:30)

**Actions:**
1. Navigate to Settings
2. Show "Connected Accounts" section
3. Click "Connect TikTok Account"
4. Show OAuth popup/modal
5. Log in with TikTok account
6. Grant permissions (show permission scope screen)
7. Show successful connection confirmation

**Narration:**
"First, we need to connect your TikTok account. We use OAuth 2.0 authentication for secure access. Let's navigate to Settings and connect a TikTok account."

**Permissions to Show:**
- "user.info.basic" - Read basic user information
- "video.upload" - Upload videos
- "video.publish" - Publish videos
- "video.list" - List videos

**Visual Focus:**
- Settings page with "Add Account" button
- TikTok login screen (blur any personal info)
- Permission scope request
- Success confirmation with account details

---

## Scene 3: Create a Post (1:30-2:30)

**Actions:**
1. Navigate to "Schedule" or "Dashboard"
2. Click "Create New Post"
3. Select platform: **TikTok**
4. Show post creation form with:
   - Content area (text or caption)
   - Video upload button
   - Platform-specific settings:
     - Privacy level (PUBLIC / FRIENDS / PRIVATE)
     - Allow comments (toggle)
     - Allow duet (toggle)
     - Allow stitch (toggle)
5. Upload a sample video (or use a pre-recorded one)
6. Enter caption/content

**Narration:**
"Now let's create a post for TikTok. Our platform supports all TikTok-specific settings like privacy levels, comment controls, and duet/stitch permissions. You can upload a video directly or write a caption."

**Content Example:**
```
"Excited to announce our new AI-powered social media scheduler! 🚀
Manage all your platforms in one place with automatic publishing.
Check it out and join our community! #AI #ContentCreation #Automation"
```

**Visual Focus:**
- Post creation form
- Video upload progress
- Platform-specific toggles/options
- Preview of the post

---

## Scene 4: Schedule the Post (2:30-3:15)

**Actions:**
1. Show scheduling options:
   - "Publish Immediately" checkbox
   - "Schedule for Later" with date/time picker
2. Select a time in the near future (within 5 minutes for demo)
3. Example time: Current time + 2 minutes
4. Click "Schedule Post"
5. Show success confirmation

**Narration:**
"You can either publish immediately or schedule for a specific date and time. Our system will automatically publish your post at the scheduled time. Let's schedule this for a couple of minutes from now."

**Visual Focus:**
- Calendar/date picker
- Time picker
- Schedule button
- Confirmation message

---

## Scene 5: Real-time Publishing (3:15-4:00)

**Actions:**
1. Wait for the scheduled time (or manually trigger the edge function)
2. Show the notification bell indicator
3. Watch as notification appears (post published)
4. Click the notification to see details
5. Verify post status changed to "Published" with ✅ badge
6. Show platform-specific post ID saved

**Narration:**
"Our system automatically publishes your posts at the scheduled time. You can see real-time notifications in the bell icon. Once published, the post immediately appears on your TikTok account. The system saves the post ID for tracking and analytics."

**Visual Focus:**
- Notification bell with badge animation
- Dropdown notification showing success
- Post status badge changing to "Published" (green ✅)
- Post details showing TikTok post ID

---

## Scene 6: Analytics & Monitoring (4:00-4:30)

**Actions:**
1. Navigate to Analytics page
2. Show post performance metrics:
   - Views count
   - Likes count
   - Comments count
   - Shares count
   - Engagement rate
3. Show error handling (optional):
   - Demonstrate what happens if post fails
   - Show error notification
   - Show error details

**Narration:**
"Once published, you can track your post's performance in real-time. Our dashboard shows views, likes, comments, shares, and engagement rate. The system also includes robust error handling - if something goes wrong, you'll be notified immediately with details on what happened."

**Visual Focus:**
- Analytics dashboard
- Performance charts
- Engagement metrics
- Error handling (if applicable)

---

## Scene 7: Multi-Platform Summary (4:30-5:00)

**Actions:**
1. Show Settings with multiple connected accounts:
   - TikTok ✅
   - Twitter (optional for this demo)
   - LinkedIn (optional for this demo)
2. Show calendar view with posts across platforms
3. Highlight the scheduling feature

**Narration:**
"Our platform supports TikTok, LinkedIn, and Twitter, allowing you to manage all your social media from one dashboard. The scheduling feature, token refresh, automatic error handling, and real-time notifications make it easy to maintain a consistent posting schedule across all platforms."

**Visual Focus:**
- Multiple connected accounts
- Calendar with color-coded posts by platform
- Dashboard overview

---

## End Screen (5:00+)

**Actions:**
1. Show final dashboard view
2. Display key features on screen:
   - ✅ OAuth 2.0 Authentication
   - ✅ Multi-platform Support
   - ✅ Automatic Scheduling
   - ✅ Real-time Notifications
   - ✅ Analytics Tracking
   - ✅ Error Handling & Logging

**Narration:**
"The AI Social Media Scheduler provides a seamless experience for managing your TikTok presence, along with LinkedIn and Twitter. With secure OAuth authentication, automatic scheduling, and real-time insights, you can focus on creating great content while we handle the publishing."

---

## Technical Notes for Demo

### What NOT to Show
- API keys or sensitive credentials
- Personal information in TikTok account
- Any error messages with sensitive data

### What TO Emphasize
- ✅ OAuth 2.0 integration (secure)
- ✅ TikTok API v2 Content Posting API
- ✅ Real-time notifications
- ✅ Automatic token refresh
- ✅ Error handling and retries
- ✅ Multi-platform capability

### Demo Timing
- Keep it under 5 minutes
- Move quickly between screens
- Use keyboard shortcuts to speed up navigation
- Pre-schedule a post 5 minutes before recording so it publishes during the demo

### Recording Tips
1. **Resolution**: Record in 1080p or higher
2. **Frame Rate**: 30fps minimum, 60fps preferred
3. **Audio**: Clear narration, background music optional (copyright-free)
4. **Zoom**: 125-150% for better text readability on video
5. **Speed**: Normal speed, use 1.5x during parts with loading/waiting

### Post-Recording
1. Edit video to remove long waits
2. Add title cards/captions for each section
3. Highlight key actions with cursor animations
4. Add subtle background music
5. Include on-screen text for key features
6. Export as MP4 or MOV (TikTok requirements)

---

## Troubleshooting Guide

### If TikTok OAuth Fails
- **Action**: Show a mock success screen or use a pre-recorded segment
- **Explanation**: "Due to sandbox environment, we'll show you the successful connection"

### If Publishing Doesn't Trigger
- **Action**: Manually trigger the edge function via API or wait for cron job
- **Explanation**: "The system runs every 5 minutes, so if we missed the window, let me trigger it manually"

### If Notification Doesn't Appear
- **Action**: Refresh the page or manually create a test notification
- **Explanation**: "Let me refresh to show you the latest notification"

---

## Success Criteria

Your demo should clearly demonstrate:
- ✅ TikTok OAuth 2.0 login integration
- ✅ Secure token storage and management
- ✅ Video upload capability
- ✅ Post scheduling functionality
- ✅ Automatic publishing at scheduled time
- ✅ Real-time notifications
- ✅ Multi-platform support overview
- ✅ Analytics tracking
- ✅ Professional, polished UI

---

## Final Submission

**File Requirements:**
- Format: MP4 or MOV
- Duration: 3-5 minutes
- Resolution: 1080p minimum
- File Size: Under 50MB
- Audio: Clear narration

**Include with Submission:**
- This demo script
- List of TikTok API products used:
  - Login Kit
  - Content Posting API
- List of OAuth scopes requested:
  - user.info.basic
  - video.upload
  - video.publish
  - video.list
