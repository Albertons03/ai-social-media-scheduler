import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface TokenRefreshResult {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Checks if a token is expired or about to expire within 5 minutes
 */
export function isTokenExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return true;

  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer

  return now >= expiryTime - bufferMs;
}

/**
 * Refresh TikTok OAuth token
 */
export async function refreshTikTokToken(
  refreshToken: string
): Promise<TokenRefreshResult> {
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY")!;
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET")!;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_key: clientKey,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(
    "https://open.tiktokapis.com/v2/oauth/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `TikTok token refresh failed: ${response.status} - ${error}`
    );
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("TikTok token refresh returned no access token");
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in || 86400, // Default 24 hours
  };
}

/**
 * Refresh Twitter OAuth token using OAuth 2.0 with Basic Auth
 */
export async function refreshTwitterToken(
  refreshToken: string
): Promise<TokenRefreshResult> {
  const clientId = Deno.env.get("TWITTER_CLIENT_ID")!;
  const clientSecret = Deno.env.get("TWITTER_CLIENT_SECRET")!;

  // Create Basic Auth header
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token refresh failed: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Twitter token refresh returned no access token");
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in || 7200, // Default 2 hours
  };
}

/**
 * Handle LinkedIn expired token
 * LinkedIn doesn't support refresh tokens (60-day expiry)
 * User must re-authenticate
 */
export async function handleLinkedInExpiredToken(
  userId: string,
  accountId: string
): Promise<void> {
  // Deactivate the account
  const { error: updateError } = await supabase
    .from("social_accounts")
    .update({ is_active: false })
    .eq("id", accountId)
    .eq("user_id", userId);

  if (updateError) {
    console.error(
      "Failed to deactivate LinkedIn account:",
      updateError
    );
  }

  // Create notification for user
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "warning",
    title: "LinkedIn token expired",
    message:
      "Your LinkedIn authentication has expired. Please reconnect your account in Settings.",
  });
}

/**
 * Update tokens in database
 */
export async function updateTokensInDatabase(
  accountId: string,
  userId: string,
  tokens: TokenData
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + tokens.expiresIn * 1000
  ).toISOString();

  const { error } = await supabase
    .from("social_accounts")
    .update({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_expires_at: expiresAt,
    })
    .eq("id", accountId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      `Failed to update tokens in database: ${error.message}`
    );
  }
}

/**
 * Main token refresh orchestration
 * Handles all platforms and updates database
 */
export async function refreshTokenIfNeeded(
  account: any,
  userId: string
): Promise<boolean> {
  // Check if token is expired
  if (!isTokenExpired(account.token_expires_at)) {
    return true; // Token is still valid
  }

  console.log(
    `Token expired for ${account.platform} account ${account.id}, attempting refresh...`
  );

  try {
    // Handle LinkedIn separately (no refresh token)
    if (account.platform === "linkedin") {
      await handleLinkedInExpiredToken(userId, account.id);
      return false;
    }

    // Refresh token for TikTok or Twitter
    let refreshResult: TokenRefreshResult;

    if (account.platform === "tiktok") {
      if (!account.refresh_token) {
        throw new Error("No refresh token available for TikTok account");
      }
      refreshResult = await refreshTikTokToken(account.refresh_token);
    } else if (account.platform === "twitter") {
      if (!account.refresh_token) {
        throw new Error("No refresh token available for Twitter account");
      }
      refreshResult = await refreshTwitterToken(account.refresh_token);
    } else {
      throw new Error(`Unknown platform: ${account.platform}`);
    }

    // Update database with new tokens
    await updateTokensInDatabase(account.id, userId, {
      accessToken: refreshResult.access_token,
      refreshToken: refreshResult.refresh_token,
      expiresIn: refreshResult.expires_in,
    });

    console.log(
      `Successfully refreshed token for ${account.platform} account ${account.id}`
    );
    return true;
  } catch (error) {
    console.error(
      `Token refresh failed for ${account.platform} account ${account.id}:`,
      error
    );

    // Create error notification for user
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "error",
      title: `${account.platform} authentication failed`,
      message: `Failed to refresh your ${account.platform} token. Please reconnect your account.`,
    });

    return false;
  }
}
