# Supabase Edge Functions Local Test Script
# Ez a script elindítja a lokális Supabase környezetet és teszteli az Edge Functions-t

Write-Host "🚀 Supabase Edge Functions lokális teszt" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI telepítve: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI nincs telepítve!" -ForegroundColor Red
    Write-Host "Telepítsd: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker info >$null 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "✅ Docker fut" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker nincs elindítva!" -ForegroundColor Red
    Write-Host "Indítsd el a Docker Desktop-ot" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Indítjuk a lokális Supabase környezetet..." -ForegroundColor Cyan

# Start Supabase locally
try {
    Write-Host "Supabase start folyamatban..." -ForegroundColor Yellow
    supabase start
    
    if ($LASTEXITCODE -ne 0) {
        throw "Supabase start failed"
    }
    
    Write-Host "✅ Supabase lokálisan fut!" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase start sikertelen" -ForegroundColor Red
    Write-Host "Próbáld: supabase stop, majd újra start" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Edge Function serve indítása..." -ForegroundColor Cyan

# Start Edge Functions locally (in background)
Start-Process -FilePath "supabase" -ArgumentList "functions","serve","publish-scheduled-posts","--debug" -WindowStyle Minimized

# Wait a bit for the function to start
Start-Sleep -Seconds 3

Write-Host "✅ Edge Functions szervereze fut!" -ForegroundColor Green
Write-Host ""

# Display local URLs
Write-Host "📍 Lokális URL-ek:" -ForegroundColor Yellow
Write-Host "• Supabase Studio: http://localhost:54323"
Write-Host "• API: http://localhost:54321"
Write-Host "• Edge Functions: http://localhost:54321/functions/v1/publish-scheduled-posts"
Write-Host ""

# Test the Edge Function
Write-Host "🧪 Edge Function teszt..." -ForegroundColor Cyan

$testUrl = "http://localhost:54321/functions/v1/publish-scheduled-posts"
$headers = @{
    "Authorization" = "Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6"
    "Content-Type" = "application/json"
}

try {
    Write-Host "Test request küldése: $testUrl" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri $testUrl -Method POST -Headers $headers -Body '{}' -UseBasicParsing -TimeoutSec 30
    
    Write-Host "✅ Edge Function teszt sikeres!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host $response.Content -ForegroundColor Gray
} catch {
    Write-Host "⚠️ Edge Function teszt response:" -ForegroundColor Yellow
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseContent = $reader.ReadToEnd()
        Write-Host "Response: $responseContent" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎯 Következő lépések:" -ForegroundColor Yellow
Write-Host "1. Nyisd meg: http://localhost:54323 (Supabase Studio)"
Write-Host "2. Hozz létre egy teszt postot a dashboardon"
Write-Host "3. Állítsd be schedule time-ot következő 5 percre" 
Write-Host "4. Figyeld a lokális edge function logokat"
Write-Host "5. Ellenőrizd, hogy a post status 'published'-ra változik"
Write-Host ""
Write-Host "📊 Logok megtekintése:" -ForegroundColor Cyan
Write-Host "• Edge Function logok: A háttér-terminálban"
Write-Host "• Supabase Studio logok: http://localhost:54323"
Write-Host "• SQL queries: Supabase Studio → SQL Editor"
Write-Host ""
Write-Host "⚠️ Leállításhoz:" -ForegroundColor Red
Write-Host "• supabase stop (lokális DB leállítása)"
Write-Host "• Ctrl+C az Edge Function terminálban"

Write-Host ""
Write-Host "🚀 Lokális teszt környezet kész! Happy testing! 🎉" -ForegroundColor Green