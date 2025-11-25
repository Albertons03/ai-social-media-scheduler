import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/auth/tiktok - Initiate TikTok OAuth flow
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok`;

    if (!clientKey) {
      return NextResponse.json(
        { error: 'TikTok client key not configured' },
        { status: 500 }
      );
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // Store state in cookie for verification
    const response = NextResponse.redirect(
      `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.upload,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    );

    response.cookies.set('tiktok_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('TikTok OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate TikTok OAuth' },
      { status: 500 }
    );
  }
}
