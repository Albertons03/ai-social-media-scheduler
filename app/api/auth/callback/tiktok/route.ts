import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSocialAccount } from '@/lib/db/social-accounts';

// GET /api/auth/callback/tiktok - Handle TikTok OAuth callback
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
    const storedState = request.cookies.get('tiktok_oauth_state')?.value;
    const codeVerifier = request.cookies.get('tiktok_code_verifier')?.value;

    if (error) {
      console.error('TikTok OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state || state !== storedState) {
      return NextResponse.redirect(
        new URL('/settings?error=invalid_state', request.url)
      );
    }

    if (!codeVerifier) {
      console.error('TikTok OAuth error: code_verifier not found');
      return NextResponse.redirect(
        new URL('/settings?error=missing_code_verifier', request.url)
      );
    }

    // Exchange code for access token
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok`;

    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('TikTok token exchange error:', errorData);
      return NextResponse.redirect(
        new URL('/settings?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, open_id } = tokenData;

    // Get user info
    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let accountName = 'TikTok User';
    let accountHandle = '';

    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json();
      accountName = userInfo.data?.user?.display_name || accountName;
      accountHandle = userInfo.data?.user?.username || '';
    }

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Save to database
    await createSocialAccount(user.id, {
      platform: 'tiktok',
      account_id: open_id,
      account_name: accountName,
      account_handle: accountHandle,
      access_token,
      refresh_token,
      token_expires_at: expiresAt,
      is_active: true,
    });

    // Clear the state and code_verifier cookies
    const response = NextResponse.redirect(
      new URL('/settings?success=tiktok_connected', request.url)
    );
    response.cookies.delete('tiktok_oauth_state');
    response.cookies.delete('tiktok_code_verifier');

    return response;
  } catch (error) {
    console.error('TikTok callback error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=connection_failed', request.url)
    );
  }
}
