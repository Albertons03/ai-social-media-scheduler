// Clear Supabase Auth Session
// Copy and paste this into your browser console at http://localhost:3000

console.log('🔧 Clearing Supabase auth session...');

// Clear localStorage
let clearedCount = 0;
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
        console.log('✅ Cleared localStorage:', key);
        clearedCount++;
    }
});

// Clear sessionStorage
Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('sb-') || key.includes('supabase')) {
        sessionStorage.removeItem(key);
        console.log('✅ Cleared sessionStorage:', key);
        clearedCount++;
    }
});

// Clear auth cookies
document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    if (name.trim().startsWith('sb-')) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        console.log('✅ Cleared cookie:', name.trim());
        clearedCount++;
    }
});

console.log(`🎉 Cleared ${clearedCount} auth items`);
console.log('🔄 Please refresh the page and try logging in again');

// Auto refresh after 2 seconds
setTimeout(() => {
    console.log('🔄 Auto-refreshing page...');
    window.location.reload();
}, 2000);