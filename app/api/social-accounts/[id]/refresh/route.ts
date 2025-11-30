import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/social-accounts/[id]/refresh - Refresh token for a social account
export async function POST(request: NextRequest, { params }: any) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = id;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Get the social account
    const { data: account, error: fetchError } = await supabase
      .from("social_accounts")
      .select("*")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !account) {
      return NextResponse.json(
        { error: "Social account not found" },
        { status: 404 }
      );
    }

    // Handle refresh based on platform
    if (account.platform === "twitter") {
      return await refreshTwitterToken(account, user.id, supabase);
    } else if (account.platform === "tiktok") {
      return await refreshTikTokToken(account, user.id, supabase);
    } else if (account.platform === "linkedin") {
      // LinkedIn doesn't support token refresh - must reconnect
      return NextResponse.json(
        {
          error:
            "LinkedIn tokens cannot be refreshed. Please reconnect your account.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}

async function refreshTwitterToken(
  account: any,
  userId: string,
  supabase: any
) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Twitter credentials not configured" },
      { status: 500 }
    );
  }

  if (!account.refresh_token) {
    return NextResponse.json(
      { error: "No refresh token available. Please reconnect your account." },
      { status: 400 }
    );
  }

  try {
    // Create Basic Auth header
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
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
      const errorText = await response.text();
      console.error("Twitter token refresh failed:", errorText);
      return NextResponse.json(
        { error: "Token refresh failed. Please reconnect your account." },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Calculate new expiration time
    const expiresAt = new Date(
      Date.now() + (data.expires_in || 7200) * 1000
    ).toISOString();

    // Update the database
    const { error: updateError } = await supabase
      .from("social_accounts")
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token || account.refresh_token,
        token_expires_at: expiresAt,
      })
      .eq("id", account.id)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Failed to update token in database:", updateError);
      return NextResponse.json(
        { error: "Failed to save refreshed token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("Twitter token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh Twitter token" },
      { status: 500 }
    );
  }
}

async function refreshTikTokToken(account: any, userId: string, supabase: any) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    return NextResponse.json(
      { error: "TikTok credentials not configured" },
      { status: 500 }
    );
  }

  if (!account.refresh_token) {
    return NextResponse.json(
      { error: "No refresh token available. Please reconnect your account." },
      { status: 400 }
    );
  }

  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_key: clientKey,
      client_secret: clientSecret,
      refresh_token: account.refresh_token,
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
      const errorText = await response.text();
      console.error("TikTok token refresh failed:", errorText);
      return NextResponse.json(
        { error: "Token refresh failed. Please reconnect your account." },
        { status: 400 }
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      return NextResponse.json(
        { error: "TikTok did not return an access token" },
        { status: 400 }
      );
    }

    // Calculate new expiration time
    const expiresAt = new Date(
      Date.now() + (data.expires_in || 86400) * 1000
    ).toISOString();

    // Update the database
    const { error: updateError } = await supabase
      .from("social_accounts")
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token || account.refresh_token,
        token_expires_at: expiresAt,
      })
      .eq("id", account.id)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Failed to update token in database:", updateError);
      return NextResponse.json(
        { error: "Failed to save refreshed token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("TikTok token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh TikTok token" },
      { status: 500 }
    );
  }
}
