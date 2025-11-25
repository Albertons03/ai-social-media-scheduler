import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSocialAccount } from '@/lib/db/social-accounts';

// GET /api/auth/callback/linkedin - Handle LinkedIn OAuth callback
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verify state for CSRF protection
    const storedState = request.cookies.get('linkedin_oauth_state')?.value;

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state || state !== storedState) {
      return NextResponse.redirect(
        new URL('/settings?error=invalid_state', request.url)
      );
    }

    // Exchange code for access token
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`;

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange error:', errorData);
      return NextResponse.redirect(
        new URL('/settings?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let accountName = 'LinkedIn User';
    let accountId = '';

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      accountName = profileData.name || accountName;
      accountId = profileData.sub || '';
    }

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Save to database
    await createSocialAccount(user.id, {
      platform: 'linkedin',
      account_id: accountId,
      account_name: accountName,
      account_handle: '',
      access_token,
      refresh_token: null,
      token_expires_at: expiresAt,
      is_active: true,
    });

    // Clear the state cookie
    const response = NextResponse.redirect(
      new URL('/settings?success=linkedin_connected', request.url)
    );
    response.cookies.delete('linkedin_oauth_state');

    return response;
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=connection_failed', request.url)
    );
  }
}
