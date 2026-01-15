import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip middleware if environment variables are not available (e.g., during build)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If there's an auth error (like invalid refresh token), clear the session
    if (error && error.message.includes('Invalid Refresh Token')) {
      // Clear all auth cookies
      response.cookies.set({
        name: 'sb-access-token',
        value: '',
        maxAge: 0,
        path: '/',
      });
      response.cookies.set({
        name: 'sb-refresh-token',
        value: '',
        maxAge: 0,
        path: '/',
      });
      
      // Redirect to login for protected routes
      const url = request.nextUrl.clone();
      const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login') && 
                              !request.nextUrl.pathname.startsWith('/signup') &&
                              !request.nextUrl.pathname === '/';
      
      if (isProtectedRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    // Log the error but don't crash
    console.error('Auth middleware error:', error);
  }

  return response;
}
