import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface PublishResult {
  success: boolean;
  postId: string;
  platform: string;
  error?: string;
}

/**
 * Publish a text-only tweet to Twitter
 */
async function publishToTwitter(
  post: any,
  account: any
): Promise<{ tweetId: string }> {
  const content = post.content.substring(0, 280); // Twitter max 280 chars

  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${account.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return { tweetId: data.data.id };
}

/**
 * Publish a post to LinkedIn
 */
async function publishToLinkedIn(
  post: any,
  account: any
): Promise<{ postId: string }> {
  // Get user profile to get person URN
  const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${account.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error(
      `LinkedIn profile error: ${profileResponse.status}`
    );
  }

  const profileData = await profileResponse.json();
  const personUrn = `urn:li:person:${profileData.sub}`;

  // Create post
  const postBody = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: post.content,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${account.access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(postBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `LinkedIn API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return { postId: data.id };
}

/**
 * Refresh Twitter access token if expired
 */
async function refreshTwitterToken(account: any): Promise<string> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
      client_id: clientId!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Twitter token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Refresh LinkedIn access token if expired
 */
async function refreshLinkedInToken(account: any): Promise<string> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh LinkedIn token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Publish a single post
 */
async function publishPost(
  post: any,
  account: any,
  supabase: any
): Promise<PublishResult> {
  const baseResult = {
    postId: post.id,
    platform: post.platform,
  };

  try {
    console.log(`Publishing post ${post.id} to ${post.platform}`);

    // Check if token needs refresh (5 minutes before expiry)
    const tokenExpiresAt = new Date(account.token_expires_at);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    let accessToken = account.access_token;

    if (tokenExpiresAt < fiveMinutesFromNow) {
      console.log("Token expired, refreshing...");

      if (post.platform === "twitter") {
        accessToken = await refreshTwitterToken(account);
      } else if (post.platform === "linkedin") {
        accessToken = await refreshLinkedInToken(account);
      }

      // Update token in database
      await supabase
        .from("social_accounts")
        .update({
          access_token: accessToken,
          token_expires_at: new Date(
            Date.now() + 7200 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", account.id);

      account.access_token = accessToken;
    }

    let result: any;

    switch (post.platform) {
      case "twitter":
        result = await publishToTwitter(post, account);

        // Update post status to published
        await supabase
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            twitter_post_id: result.tweetId,
          })
          .eq("id", post.id);

        return {
          success: true,
          ...baseResult,
        };

      case "linkedin":
        result = await publishToLinkedIn(post, account);

        // Update post status to published
        await supabase
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            linkedin_post_id: result.postId,
          })
          .eq("id", post.id);

        return {
          success: true,
          ...baseResult,
        };

      case "tiktok":
        // Not implemented yet
        throw new Error(`${post.platform} publishing not yet implemented`);

      default:
        throw new Error(`Unknown platform: ${post.platform}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to publish post ${post.id}:`, errorMessage);

    // Update post status to failed
    await supabase
      .from("posts")
      .update({
        status: "failed",
        error_message: errorMessage,
        retry_count: (post.retry_count || 0) + 1,
        last_retry_at: new Date().toISOString(),
      })
      .eq("id", post.id);

    return {
      success: false,
      error: errorMessage,
      ...baseResult,
    };
  }
}

/**
 * Vercel Cron handler - runs every 5 minutes
 * POST /api/cron/publish
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("=== Starting scheduled posts publishing ===");
    console.log(`Time: ${new Date().toISOString()}`);

    const supabase = await createClient();

    // Fetch scheduled posts due for publishing
    const { data: postsToPublish, error: fetchError } = await supabase
      .from("posts")
      .select(
        `
        *,
        social_accounts:social_account_id (
          id,
          platform,
          account_id,
          access_token,
          refresh_token,
          token_expires_at,
          is_active
        )
      `
      )
      .eq("status", "scheduled")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    if (!postsToPublish || postsToPublish.length === 0) {
      console.log("No scheduled posts to publish");
      return NextResponse.json({
        success: true,
        message: "No posts to publish",
        totalProcessed: 0,
        published: 0,
        failed: 0,
      });
    }

    console.log(`Found ${postsToPublish.length} posts to publish`);

    const results: PublishResult[] = [];

    // Process each post
    for (const post of postsToPublish) {
      // Safety check: verify post is still scheduled (prevent race conditions)
      const { data: currentPost } = await supabase
        .from("posts")
        .select("status")
        .eq("id", post.id)
        .single();

      if (currentPost?.status !== "scheduled") {
        console.log(
          `Skipping post ${post.id} - status changed to ${currentPost?.status}`
        );
        continue;
      }

      if (!post.social_accounts) {
        console.warn(`Post ${post.id} has no associated social account`);
        results.push({
          success: false,
          postId: post.id,
          platform: post.platform,
          error: "No associated social account",
        });
        continue;
      }

      if (!post.social_accounts.is_active) {
        console.warn(`Social account is not active for post ${post.id}`);
        results.push({
          success: false,
          postId: post.id,
          platform: post.platform,
          error: "Social account is not active",
        });
        continue;
      }

      const result = await publishPost(post, post.social_accounts, supabase);
      results.push(result);
    }

    const publishedCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    console.log("=== Publishing Complete ===");
    console.log(`Total processed: ${results.length}`);
    console.log(`Published: ${publishedCount}`);
    console.log(`Failed: ${failedCount}`);

    return NextResponse.json({
      success: true,
      totalProcessed: results.length,
      published: publishedCount,
      failed: failedCount,
      results,
    });
  } catch (error) {
    console.error("Error in cron publish handler:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing (remove in production)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Cron endpoint is working. Use POST to trigger publishing.",
    timestamp: new Date().toISOString(),
  });
}
