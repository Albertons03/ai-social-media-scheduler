# Test Edge Function Script
# Try with service role key first
$serviceRoleKey = 'sb_secret_QHfTRh2rAaPi7GgOga2QBw_yzZNisy6'

$headers = @{
    'Authorization' = "Bearer $serviceRoleKey"
    'Content-Type' = 'application/json'
}

$body = '{"scheduled": true}'

$url = 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts'

Write-Host "Testing Edge Function..." -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Content:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $streamReader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}
