# Test Edge Function Script (No Authentication)
$headers = @{
    'Content-Type' = 'application/json'
}

$body = '{"scheduled": true}'

$url = 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts'

Write-Host "Testing Edge Function (no auth)..." -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Success! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor White
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $streamReader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}
