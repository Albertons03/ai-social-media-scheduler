# Clear Auth Session Script
# Use this if you're having authentication issues

Write-Host "🔧 Clearing Supabase auth session..." -ForegroundColor Yellow

Write-Host ""
Write-Host "📝 Quick Fix Steps:" -ForegroundColor Yellow
Write-Host "1. Open your browser at http://localhost:3000" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Go to Application tab (Chrome) or Storage tab (Firefox)" -ForegroundColor White
Write-Host "4. Clear these items:" -ForegroundColor White
Write-Host "   - Local Storage: Delete all 'sb-*' entries" -ForegroundColor Gray
Write-Host "   - Session Storage: Delete all 'sb-*' entries" -ForegroundColor Gray
Write-Host "   - Cookies: Delete all Supabase related cookies" -ForegroundColor Gray
Write-Host "5. Refresh the page and try logging in again" -ForegroundColor White

Write-Host ""
Write-Host "🔄 Alternative Solutions:" -ForegroundColor Green
Write-Host "• Use Incognito/Private browsing window" -ForegroundColor White
Write-Host "• Clear all browser data for localhost:3000" -ForegroundColor White

Write-Host ""
Write-Host "✅ After clearing, the auth error should be resolved" -ForegroundColor Green

Write-Host ""