// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Public routes (nem kell auth)
const publicRoutes = ['/', '/en', '/de', '/hu', '/login', '/signup', '/pricing', '/terms', '/policy', '/api/webhook'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ha public route → NEM hívjuk az updateSession-t (bypass auth check)
  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return NextResponse.next();
  }

  // Minden más route (pl. /app/*) → auth check
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
