import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { refreshTokenIfNeeded } from "./token-manager.ts";
import { createSuccessNotification, createErrorNotification } from "./notification-service.ts";
import { publishToTwitter } from "./publishers/twitter-publisher.ts";
import { publishToLinkedIn } from "./publishers/linkedin-publisher.ts";
import { publishToTikTok } from "./publishers/tiktok-publisher.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface PublishingResult {
  success: boolean;
  postId: string;
  platform: string;
  postIdOnPlatform?: string;
  error?: string;
}

interface FunctionResponse {
  scheduled: boolean;
  timestamp: string;
  totalPostsProcessed: number;
  publishedCount: number;
  failedCount: number;
  results: PublishingResult[];
}

/**
 * Fetch media buffer from Supabase Storage or URL
 */
async function getMediaBuffer(mediaUrl: string): Promise<ArrayBuffer | undefined> {
  if (!mediaUrl) return undefined;

  try {
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      console.error(`Failed to fetch media: ${response.status}`);
      return undefined;
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching media:", error);
    return undefined;
  }
}

/**
 * Publish a single post to its platform
 */
async function publishPost(
  post: any,
  account: any
): Promise<PublishingResult> {
  const baseResult = {
    postId: post.id,
    platform: post.platform,
  };

  try {
    console.log(`\n=== Publishing Post ${post.id} to ${post.platform} ===`);

    // Check and refresh token if needed
    const tokenValid = await refreshTokenIfNeeded(account, post.user_id);
    if (!tokenValid) {
      throw new Error("Token refresh failed or account deactivated");
    }

    let result: any;

    switch (post.platform) {
      case "twitter":
        {
          const mediaBuffer = await getMediaBuffer(post.media_url);
          result = await publishToTwitter(post, account, mediaBuffer);

          // Update post with Twitter post ID
          await supabase
            .from("posts")
            .update({
              status: "published",
              published_at: new Date().toISOString(),
              twitter_post_id: result.tweetId,
            })
            .eq("id", post.id)
            .eq("user_id", post.user_id);

          // Create success notification
          await createSuccessNotification(post.user_id, post.id, "Twitter");

          return {
            success: true,
            postIdOnPlatform: result.tweetId,
            ...baseResult,
          };
        }

      case "linkedin":
        {
          const mediaBuffer = await getMediaBuffer(post.media_url);
          result = await publishToLinkedIn(post, account, mediaBuffer);

          // Update post with LinkedIn post ID
          await supabase
            .from("posts")
            .update({
              status: "published",
              published_at: new Date().toISOString(),
              linkedin_post_id: result.postUrn,
            })
            .eq("id", post.id)
            .eq("user_id", post.user_id);

          // Create success notification
          await createSuccessNotification(post.user_id, post.id, "LinkedIn");

          return {
            success: true,
            postIdOnPlatform: result.postUrn,
            ...baseResult,
          };
        }

      case "tiktok":
        {
          result = await publishToTikTok(post, account);

          // Update post with TikTok post ID
          await supabase
            .from("posts")
            .update({
              status: "published",
              published_at: new Date().toISOString(),
              tiktok_post_id: result.tikTokPostId,
            })
            .eq("id", post.id)
            .eq("user_id", post.user_id);

          // Create success notification
          await createSuccessNotification(post.user_id, post.id, "TikTok");

          return {
            success: true,
            postIdOnPlatform: result.tikTokPostId,
            ...baseResult,
          };
        }

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
      .eq("id", post.id)
      .eq("user_id", post.user_id);

    // Create error notification
    await createErrorNotification(post.user_id, post.id, post.platform, errorMessage);

    return {
      success: false,
      error: errorMessage,
      ...baseResult,
    };
  }
}

/**
 * Main handler: Fetch and publish scheduled posts
 */
async function publishScheduledPosts(): Promise<FunctionResponse> {
  const startTime = new Date();
  const results: PublishingResult[] = [];

  try {
    console.log("=== Starting scheduled posts publishing ===");
    console.log(`Time: ${startTime.toISOString()}`);

    // Fetch scheduled posts
    console.log("Fetching scheduled posts...");
    const { data: postsToPublish, error: fetchError } = await supabase
      .from("posts")
      .select(
        `
        *,
        social_accounts:social_account_id (
          id,
          platform,
          account_id,
          account_name,
          account_handle,
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
      .limit(50); // Max 50 per run

    if (fetchError) {
      throw new Error(`Failed to fetch scheduled posts: ${fetchError.message}`);
    }

    if (!postsToPublish || postsToPublish.length === 0) {
      console.log("No scheduled posts to publish");
      return {
        scheduled: true,
        timestamp: startTime.toISOString(),
        totalPostsProcessed: 0,
        publishedCount: 0,
        failedCount: 0,
        results: [],
      };
    }

    console.log(`Found ${postsToPublish.length} posts to publish`);

    // Process each post
    for (const post of postsToPublish) {
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

      // Verify social account is active
      if (!post.social_accounts.is_active) {
        console.warn(
          `Social account ${post.social_accounts.id} is not active`
        );
        results.push({
          success: false,
          postId: post.id,
          platform: post.platform,
          error: "Social account is not active",
        });
        continue;
      }

      const result = await publishPost(post, post.social_accounts);
      results.push(result);
    }

    const publishedCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    console.log(
      `\n=== Publishing Complete ===`
    );
    console.log(`Total processed: ${results.length}`);
    console.log(`Published: ${publishedCount}`);
    console.log(`Failed: ${failedCount}`);

    return {
      scheduled: true,
      timestamp: startTime.toISOString(),
      totalPostsProcessed: results.length,
      publishedCount,
      failedCount,
      results,
    };
  } catch (error) {
    console.error("Fatal error in publishScheduledPosts:", error);
    throw error;
  }
}

/**
 * HTTP handler for the edge function
 */
serve(async (req: Request) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    console.log("Received publishing request");

    const result = await publishScheduledPosts();

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in edge function:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
