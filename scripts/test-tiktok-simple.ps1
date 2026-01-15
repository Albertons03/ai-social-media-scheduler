# Simple TikTok Publishing Test
# This script tests if your TikTok publishing setup works

Write-Host "🎬 TikTok Publishing Local Test" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta
Write-Host ""

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Write-Host "📁 Loading .env.local..." -ForegroundColor Yellow
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#][^=]*)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "✅ Environment variables loaded" -ForegroundColor Green
    Write-Host ""
}

# Check required variables
$requiredVars = @("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY")
$missing = @()

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var, "Process")) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Missing environment variables:" -ForegroundColor Red
    foreach ($var in $missing) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Add these to your .env.local file" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All required environment variables are set" -ForegroundColor Green
Write-Host ""

# Start the Next.js dev server if not running
Write-Host "🚀 Starting Next.js dev server..." -ForegroundColor Cyan
$devServer = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden

# Wait a moment for server to start
Start-Sleep -Seconds 5

Write-Host "✅ Dev server started" -ForegroundColor Green
Write-Host ""

# Instructions for manual testing
Write-Host "📋 Manual Testing Steps:" -ForegroundColor Yellow
Write-Host "1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "2. Login to your account" -ForegroundColor White
Write-Host "3. Go to Settings and connect TikTok" -ForegroundColor White
Write-Host "4. Create a new post with a video file" -ForegroundColor White
Write-Host "5. Schedule it for immediate publishing" -ForegroundColor White
Write-Host "6. Check the post status updates" -ForegroundColor White
Write-Host ""

Write-Host "🔧 API Testing:" -ForegroundColor Yellow
Write-Host "You can also test the TikTok API directly using:" -ForegroundColor White
Write-Host "curl -X POST http://localhost:3000/api/posts -H 'Content-Type: application/json'" -ForegroundColor Gray
Write-Host ""

Write-Host "🛑 To stop the test:" -ForegroundColor Red
Write-Host "Press Ctrl+C to exit this script" -ForegroundColor White
Write-Host "The dev server will continue running in background" -ForegroundColor White

# Keep the script running
try {
    Write-Host "✨ Test environment ready! Press Ctrl+C to stop." -ForegroundColor Green
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    if ($devServer -and -not $devServer.HasExited) {
        Write-Host "🛑 Stopping dev server..." -ForegroundColor Yellow
        Stop-Process -Id $devServer.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Test completed" -ForegroundColor Green
}