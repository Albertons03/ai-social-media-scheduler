#!/bin/bash

# TikTok Publishing Test Script
# This script tests the TikTok publishing functionality

echo "=== TikTok Publishing Test ==="
echo ""

# Check if environment variables are set
if [ -z "$TIKTOK_CLIENT_KEY" ]; then
  echo "❌ TIKTOK_CLIENT_KEY is not set"
  echo "Add it to your .env.local file"
  exit 1
fi

if [ -z "$TIKTOK_CLIENT_SECRET" ]; then
  echo "❌ TIKTOK_CLIENT_SECRET is not set"
  echo "Add it to your .env.local file"
  exit 1
fi

echo "✅ TikTok environment variables are set"
echo ""

# Check if CRON_SECRET is set for testing
if [ -z "$CRON_SECRET" ]; then
  echo "❌ CRON_SECRET is not set"
  echo "Add it to your .env.local file"
  exit 1
fi

echo "✅ CRON_SECRET is set"
echo ""

# Test the publishing endpoint
echo "Testing publishing endpoint..."
APP_URL=${NEXT_PUBLIC_APP_URL:-"http://localhost:3000"}

curl -X POST "$APP_URL/api/cron/publish" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null

echo ""
echo "=== Test completed ==="
echo ""
echo "Next steps:"
echo "1. Check the response status code above"
echo "2. If 200: Check the logs for any posts that were processed"
echo "3. If 401: Verify CRON_SECRET is correct" 
echo "4. If 500: Check the server logs for errors"
echo ""
echo "To create a test TikTok post:"
echo "1. Go to $APP_URL/dashboard"
echo "2. Create a new post with video"
echo "3. Select TikTok platform"
echo "4. Schedule it for immediate publishing"
echo "5. Run this test script again"