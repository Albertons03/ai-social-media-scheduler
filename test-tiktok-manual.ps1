# TikTok Publishing Manual Test (PowerShell)
Write-Host "🎬 Testing TikTok Publishing Locally" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta

# Check if dev server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Dev server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server is not running!" -ForegroundColor Red
    Write-Host "Start it with: npm run dev" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$cronSecret = $env:CRON_SECRET
if (-not $cronSecret) {
    Write-Host "❌ CRON_SECRET not set in .env.local" -ForegroundColor Red
    Write-Host "Add: CRON_SECRET=your_secret_key" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔄 Testing publish endpoint..." -ForegroundColor Cyan

# Create headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $cronSecret"
}

try {
    Write-Host "📤 Triggering publish for scheduled posts..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/cron/publish" -Method Post -Headers $headers
    
    Write-Host "✅ Publish endpoint responded:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error calling publish endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Check your results:" -ForegroundColor Yellow
Write-Host "   - Dashboard: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "   - Check post statuses in your database" -ForegroundColor White
Write-Host ""