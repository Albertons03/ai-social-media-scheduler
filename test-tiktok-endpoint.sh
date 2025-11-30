#!/bin/bash

echo "=== TikTok OAuth Endpoint Test ==="
echo ""

# Test 1: Check if the OAuth endpoint exists and returns a redirect
echo "Test 1: OAuth Initiation Endpoint"
echo "URL: http://localhost:3000/api/auth/tiktok"
echo ""

response=$(curl -s -w "\n%{http_code}" -i http://localhost:3000/api/auth/tiktok 2>&1 | tail -5)
echo "$response"
echo ""

# Test 2: Verify the authorization URL uses correct scope
echo "Test 2: Checking OAuth URL for correct scope"
echo "Expected scope: user.info.basic"
echo ""

# Extract the location header if it exists
location=$(curl -s -i http://localhost:3000/api/auth/tiktok 2>&1 | grep -i "location:" | head -1)
if echo "$location" | grep -q "scope=user.info.basic"; then
    echo "✓ Correct scope found in authorization URL"
    echo "✓ OAuth endpoint is working correctly"
else
    echo "✗ Scope not found or incorrect"
fi

echo ""
echo "Location header:"
echo "$location"
