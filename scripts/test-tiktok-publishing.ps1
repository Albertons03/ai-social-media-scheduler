# TikTok Publishing Test Script (PowerShell)
# This script tests the TikTok publishing functionality

Write-Host "=== TikTok Publishing Test ===" -ForegroundColor Green
Write-Host ""

# Load .env.local file if it exists
if (Test-Path ".env.local") {
    Write-Host "Loading .env.local file..." -ForegroundColor Yellow
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#][^=]*)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Check if environment variables are set
$tiktokClientKey = $env:TIKTOK_CLIENT_KEY
$tiktokClientSecret = $env:TIKTOK_CLIENT_SECRET
$cronSecret = $env:CRON_SECRET
$appUrl = $env:NEXT_PUBLIC_APP_URL

if (-not $tiktokClientKey) {
    Write-Host "❌ TIKTOK_CLIENT_KEY is not set" -ForegroundColor Red
    Write-Host "Add it to your .env.local file" -ForegroundColor Yellow
    exit 1
}

if (-not $tiktokClientSecret) {
    Write-Host "❌ TIKTOK_CLIENT_SECRET is not set" -ForegroundColor Red
    Write-Host "Add it to your .env.local file" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ TikTok environment variables are set" -ForegroundColor Green
Write-Host ""

# Check if CRON_SECRET is set for testing
if (-not $cronSecret) {
    Write-Host "❌ CRON_SECRET is not set" -ForegroundColor Red
    Write-Host "Add it to your .env.local file" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ CRON_SECRET is set" -ForegroundColor Green
Write-Host ""

# Test the publishing endpoint
Write-Host "Testing publishing endpoint..." -ForegroundColor Cyan
if (-not $appUrl) {
    $appUrl = "http://localhost:3000"
}

$headers = @{
    "Authorization" = "Bearer $cronSecret"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "$appUrl/api/cron/publish" -Method POST -Headers $headers -UseBasicParsing
    Write-Host "✅ HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ HTTP Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test completed ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check the response status code above"
Write-Host "2. If 200: Check the logs for any posts that were processed"
Write-Host "3. If 401: Verify CRON_SECRET is correct" 
Write-Host "4. If 500: Check the server logs for errors"
Write-Host ""
Write-Host "To create a test TikTok post:" -ForegroundColor Cyan
Write-Host "1. Go to $appUrl/dashboard"
Write-Host "2. Create a new post with video"
Write-Host "3. Select TikTok platform" 
Write-Host "4. Schedule it for immediate publishing"
Write-Host "5. Run this test script again"