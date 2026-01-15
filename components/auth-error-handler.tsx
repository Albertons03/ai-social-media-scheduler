'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, handleAuthError } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AuthErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Only redirect if it wasn't a manual sign out
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/signup') && currentPath !== '/') {
            toast.info('Your session has expired. Please login again.');
            router.push('/login');
          }
        }
      }
    );

    // Handle global auth errors
    const handleGlobalAuthError = (error: any) => {
      if (error?.message?.includes('Invalid Refresh Token') || 
          error?.message?.includes('Refresh Token Not Found')) {
        
        console.log('Handling global auth error:', error.message);
        toast.error('Your session has expired. Please login again.');
        
        // Clear the session and redirect
        supabase.auth.signOut().then(() => {
          router.push('/login');
        });
      }
    };

    // Override console.error to catch Supabase auth errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Invalid Refresh Token') || 
          errorMessage.includes('Refresh Token Not Found')) {
        handleGlobalAuthError({ message: errorMessage });
      }
      originalConsoleError.apply(console, args);
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Invalid Refresh Token') || 
          event.reason?.message?.includes('Refresh Token Not Found')) {
        event.preventDefault();
        handleGlobalAuthError(event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      subscription.unsubscribe();
      console.error = originalConsoleError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [router]);

  return null; // This component doesn't render anything
}