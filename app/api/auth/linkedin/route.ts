import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/auth/linkedin - Initiate LinkedIn OAuth flow
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`;

    if (!clientId) {
      return NextResponse.json(
        { error: 'LinkedIn client ID not configured' },
        { status: 500 }
      );
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // LinkedIn OAuth scopes
    const scope = 'openid profile email w_member_social';

    // Store state in cookie for verification
    const response = NextResponse.redirect(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`
    );

    response.cookies.set('linkedin_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate LinkedIn OAuth' },
      { status: 500 }
    );
  }
}
