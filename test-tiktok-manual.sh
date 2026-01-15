#!/bin/bash
# Simple TikTok Publishing Test

echo "🎬 Testing TikTok Publishing Locally"
echo "====================================="

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Dev server is not running!"
    echo "Start it with: npm run dev"
    exit 1
fi

echo "✅ Dev server is running"

# Test the cron publish endpoint
echo "🔄 Testing publish endpoint..."

# Load CRON_SECRET from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

if [ -z "$CRON_SECRET" ]; then
    echo "❌ CRON_SECRET not set in .env.local"
    exit 1
fi

# Call the publish endpoint
echo "📤 Triggering publish for scheduled posts..."
curl -X POST "http://localhost:3000/api/cron/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -v

echo ""
echo "✅ Test completed!"
echo ""
echo "🔍 Check your database to see if posts were published:"
echo "   - Go to: http://localhost:3000/dashboard"
echo "   - Check post statuses"
echo ""