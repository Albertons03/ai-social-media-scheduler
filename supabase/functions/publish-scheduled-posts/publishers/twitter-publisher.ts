import { withRetryAndTimeout } from "../retry-handler.ts";
import { createSuccessNotification, createErrorNotification } from "../notification-service.ts";

export interface TwitterPublishResult {
  postId: string;
  tweetId: string;
  text: string;
}

/**
 * Publish a text tweet to Twitter
 */
async function publishTextTweet(
  content: string,
  accessToken: string
): Promise<{ id: string; text: string }> {
  const body = JSON.stringify({
    text: content.substring(0, 280), // Twitter max 280 characters
  });

  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.data;
}

/**
 * Upload media to Twitter
 */
async function uploadTwitterMedia(
  mediaBuffer: ArrayBuffer,
  mediaType: "image" | "video",
  accessToken: string
): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([mediaBuffer], {
    type: mediaType === "image" ? "image/jpeg" : "video/mp4",
  });
  formData.append("media_data", blob);

  const response = await fetch(
    "https://upload.twitter.com/1.1/media/upload.json",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Twitter media upload error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.media_id_string;
}

/**
 * Publish tweet with media
 */
async function publishTweetWithMedia(
  content: string,
  mediaIds: string[],
  accessToken: string
): Promise<{ id: string; text: string }> {
  const body = JSON.stringify({
    text: content.substring(0, 280),
    media: {
      media_ids: mediaIds,
    },
  });

  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.data;
}

/**
 * Main Twitter publisher function
 */
export async function publishToTwitter(
  post: any,
  account: any,
  mediaBuffer?: ArrayBuffer
): Promise<TwitterPublishResult> {
  const operation = async () => {
    console.log(
      `Publishing to Twitter - Post: ${post.id}, Account: ${account.account_id}`
    );

    // Validate content length (Twitter max 280 chars)
    if (post.content.length > 280) {
      console.warn(
        `Post content is ${post.content.length} characters, will be truncated to 280 for Twitter`
      );
    }

    let tweetData: { id: string; text: string };

    // Publish with or without media
    if (mediaBuffer && post.media_type) {
      console.log(
        `Publishing with ${post.media_type} media to Twitter (size: ${mediaBuffer.byteLength} bytes)`
      );

      // Upload media
      const mediaId = await uploadTwitterMedia(
        mediaBuffer,
        post.media_type as "image" | "video",
        account.access_token
      );

      // Publish tweet with media
      tweetData = await publishTweetWithMedia(
        post.content,
        [mediaId],
        account.access_token
      );
    } else {
      // Publish text-only tweet
      tweetData = await publishTextTweet(
        post.content,
        account.access_token
      );
    }

    console.log(
      `Successfully published to Twitter - Tweet ID: ${tweetData.id}`
    );

    return {
      postId: post.id,
      tweetId: tweetData.id,
      text: tweetData.text,
    };
  };

  try {
    return await withRetryAndTimeout(
      operation,
      {
        postId: post.id,
        userId: post.user_id,
        platform: "twitter",
      },
      30000 // 30 second timeout
    );
  } catch (error) {
    console.error(`Failed to publish to Twitter - Post: ${post.id}`, error);

    // Create error notification
    await createErrorNotification(
      post.user_id,
      post.id,
      "Twitter",
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
}

/**
 * Check Twitter API availability (health check)
 */
export async function checkTwitterHealth(
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch("https://api.twitter.com/2/tweets/search/recent?query=test&max_results=10", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    return response.ok || response.status === 429; // 429 is rate limit, API still works
  } catch {
    return false;
  }
}
