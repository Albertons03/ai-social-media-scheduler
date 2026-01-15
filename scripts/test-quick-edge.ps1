# Gyors Edge Function teszt (ha már fut a lokális Supabase)
param(
    [string]$TestType = "simple"
)

Write-Host "🧪 Supabase Edge Function gyors teszt" -ForegroundColor Green
Write-Host ""

$localUrl = "http://localhost:54321/functions/v1/publish-scheduled-posts"
$headers = @{
    "Authorization" = "Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6"
    "Content-Type" = "application/json"
}

if ($TestType -eq "simple") {
    Write-Host "📍 Alapvető Edge Function teszt..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $localUrl -Method POST -Headers $headers -Body '{}' -UseBasicParsing -TimeoutSec 10
        
        Write-Host "✅ Sikeres!" -ForegroundColor Green
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response:"
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Hiba: $($_.Exception.Message)" -ForegroundColor Red
    }

} elseif ($TestType -eq "detailed") {
    Write-Host "🔍 Részletes Edge Function teszt..." -ForegroundColor Cyan
    
    # Test with actual data structure
    $testBody = @{
        scheduled = $true
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        test_mode = $true
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri $localUrl -Method POST -Headers $headers -Body $testBody -UseBasicParsing -TimeoutSec 30
        
        Write-Host "✅ Részletes teszt sikeres!" -ForegroundColor Green
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response:"
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 4
    } catch {
        Write-Host "❌ Hiba: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Response Status: $($_.Exception.Response.StatusCode)"
        }
    }
}

Write-Host ""
Write-Host "💡 Hasznos parancsok:" -ForegroundColor Yellow
Write-Host "• .\scripts\test-quick-edge.ps1 simple    - Alapvető teszt"
Write-Host "• .\scripts\test-quick-edge.ps1 detailed  - Részletes teszt"
Write-Host "• supabase functions serve --debug       - Edge Function debug módban"
Write-Host "• supabase status                        - Lokális szolgáltatások státusza"