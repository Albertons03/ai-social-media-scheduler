# Twitter API Limitations

## Current Implementation Status

### OAuth 2.0 (Currently Implemented)

The application currently uses **Twitter OAuth 2.0** for authentication, which has the following capabilities:

✅ **Supported:**
- Text-only tweets (up to 280 characters)
- Read tweet permissions
- User profile information
- Offline access (refresh tokens)

❌ **NOT Supported:**
- **Media upload** (images, videos, GIFs)
- Tweet with media attachments
- Poll creation
- Scheduled tweets (native Twitter scheduling)

### Why Media Upload Doesn't Work

Twitter API v2 with OAuth 2.0 does **NOT** support media uploads. The media upload endpoint (`https://upload.twitter.com/1.1/media/upload.json`) requires:
- **OAuth 1.0a** authentication (not OAuth 2.0)
- Different authentication headers (HMAC-SHA1 signatures)
- Consumer key/secret pair
- Access token/secret pair

## Current Behavior

When you try to post a tweet with media:
1. The system will **ignore the media** and post only the text
2. A warning is logged: `⚠️ Twitter API v2 with OAuth 2.0 does not support media upload`
3. The post will be marked as "published" but **without the image/video**

## Solutions

### Option 1: Text-Only Tweets (Current Implementation)
- ✅ **Simple** - already working
- ✅ No additional setup required
- ❌ Cannot post images or videos

### Option 2: Implement OAuth 1.0a for Media
To support media uploads, you need to:

1. **Update Twitter Developer Portal:**
   - Enable OAuth 1.0a in your Twitter App settings
   - Generate Consumer Key and Consumer Secret
   - Keep both OAuth 1.0a and OAuth 2.0 enabled

2. **Add Environment Variables:**
   ```env
   TWITTER_CONSUMER_KEY=your_consumer_key
   TWITTER_CONSUMER_SECRET=your_consumer_secret
   ```

3. **Implement OAuth 1.0a signing:**
   - Install `oauth-1.0a` npm package
   - Generate HMAC-SHA1 signatures
   - Use both OAuth methods (2.0 for tweets, 1.0a for media)

4. **Update Code:**
   - Modify `twitter-publisher.ts` to use OAuth 1.0a for media upload
   - Keep OAuth 2.0 for tweet posting
   - Use both tokens together

### Option 3: Use Third-Party Service
- Use services like Cloudinary, Imgix, or similar
- Upload media to third-party
- Include media URL in tweet text
- ❌ Twitter won't show inline media preview

## Recommended Solution

For a complete Twitter integration with media support, **Option 2** (OAuth 1.0a) is recommended. This requires:
- Additional development work (~4-6 hours)
- More complex authentication flow
- Better user experience (full feature support)

## Alternative: Post Without Media

For now, if you want to post to Twitter:
1. ✅ Create posts **without media** (text-only)
2. ✅ Use the scheduler for text-only tweets
3. ⏰ Plan to add OAuth 1.0a support later

## Testing

To test text-only tweets:
1. Create a post without uploading any image/video
2. Schedule it for 2-3 minutes from now
3. Wait for the Supabase Edge Function to publish it (runs every 5 minutes)
4. Check your Twitter profile to see the published tweet

---

**Last Updated:** 2025-12-06
**API Version:** Twitter API v2 with OAuth 2.0
**Status:** Text-only tweets supported, media upload not supported
