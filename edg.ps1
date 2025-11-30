  $headers = @{
    'Authorization' = 'Bearer sb_secret_QHfTRh2rAaPi7GgOga2QBw_yzZNisy6'
    'Content-Type' = 'application/json'
  }
  $body = '{"scheduled": true}'
  $response = Invoke-WebRequest -Uri
  'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts' -Method POST -Headers        
  $headers -Body $body -UseBasicParsing
  $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10