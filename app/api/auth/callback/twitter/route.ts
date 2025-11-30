import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSocialAccount } from "@/lib/db/social-accounts";

// GET /api/auth/callback/twitter - Handle Twitter OAuth callback
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Verify state for CSRF protection
    const storedState = request.cookies.get("twitter_oauth_state")?.value;
    const codeVerifier = request.cookies.get("twitter_code_verifier")?.value;

    if (error) {
      console.error("Twitter OAuth error:", error);
      // FIXED: Added missing parenthesis after "new URL("
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state || state !== storedState || !codeVerifier) {
      return NextResponse.redirect(
        new URL("/settings?error=invalid_state", request.url)
      );
    }

    // Exchange code for access token
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const redirectUri =
      process.env.TWITTER_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter`;

    // FIXED: Added missing parenthesis after "Buffer.from("
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const tokenResponse = await fetch(
      "https://api.twitter.com/2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: clientId!,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Twitter token exchange error:", errorData);
      return NextResponse.redirect(
        new URL("/settings?error=token_exchange_failed", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user profile
    const profileResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let accountName = "Twitter User";
    let accountHandle = "";
    let accountId = "";

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      accountName = profileData.data?.name || accountName;
      accountHandle = profileData.data?.username || "";
      accountId = profileData.data?.id || "";
    }

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Save to database
    await createSocialAccount(user.id, {
      platform: "twitter",
      account_id: accountId,
      account_name: accountName,
      account_handle: accountHandle,
      access_token,
      refresh_token,
      token_expires_at: expiresAt,
      is_active: true,
    });

    // Clear the cookies
    const response = NextResponse.redirect(
      new URL("/settings?success=twitter_connected", request.url)
    );
    response.cookies.delete("twitter_oauth_state");
    response.cookies.delete("twitter_code_verifier");

    return response;
  } catch (error) {
    console.error("Twitter callback error:", error);
    return NextResponse.redirect(
      new URL("/settings?error=connection_failed", request.url)
    );
  }
}
