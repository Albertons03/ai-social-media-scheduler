import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Handle auth state changes and errors
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // Clear any cached auth data
      localStorage.removeItem('supabase.auth.token');
    }
  });

  return client;
}

// Utility function to handle auth errors gracefully
export async function handleAuthError(error: any) {
  if (error?.message?.includes('Invalid Refresh Token') || 
      error?.message?.includes('Refresh Token Not Found')) {
    
    console.log('Invalid refresh token detected, clearing session...');
    const client = createClient();
    await client.auth.signOut();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return true;
  }
  return false;
}
