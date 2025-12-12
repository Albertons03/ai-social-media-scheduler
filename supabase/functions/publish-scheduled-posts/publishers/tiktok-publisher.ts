import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withRetryAndTimeout } from "../retry-handler.ts";
import { createSuccessNotification, createErrorNotification } from "../notification-service.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface TikTokPublishResult {
  postId: string;
  tikTokPostId: string;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks (TikTok recommended)

/**
 * Initialize TikTok video upload
 */
async function initializeTikTokUpload(
  post: any,
  accessToken: string,
  fileSize: number
): Promise<{ publishId: string; uploadUrl: string }> {
  // Ensure chunk_size <= video_size (TikTok requirement)
  const actualChunkSize = Math.min(CHUNK_SIZE, fileSize);
  const totalChunks = Math.ceil(fileSize / actualChunkSize);

  const body = JSON.stringify({
    post_info: {
      title: post.content.substring(0, 150), // Max 150 chars for title
      privacy_level: post.privacy_level || "PUBLIC",
      disable_comment: !post.allow_comments,
      disable_duet: !post.allow_duet,
      disable_stitch: !post.allow_stitch,
    },
    source_info: {
      source: "FILE_UPLOAD",
      video_size: fileSize,
      chunk_size: actualChunkSize,
      total_chunk_count: totalChunks,
    },
  });

  const response = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/video/init/",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `TikTok upload init error: ${response.status} - ${errorData}`
    );
  }

  const data = await response.json();
  return {
    publishId: data.data.publish_id,
    uploadUrl: data.data.upload_url,
  };
}

/**
 * Upload a single chunk to TikTok
 */
async function uploadTikTokChunk(
  uploadUrl: string,
  chunkData: Uint8Array,
  chunkIndex: number,
  totalChunks: number,
  chunkSize: number
): Promise<void> {
  const start = chunkIndex * chunkSize;
  const end = start + chunkData.length - 1;
  const contentRange = `bytes ${start}-${end}/*`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Range": contentRange,
      "Content-Length": chunkData.length.toString(),
      "Content-Type": "video/mp4",
    },
    body: chunkData,
  });

  if (!response.ok) {
    throw new Error(
      `TikTok chunk upload error: ${response.status}`
    );
  }

  console.log(
    `Uploaded TikTok chunk ${chunkIndex + 1}/${totalChunks}`
  );
}

/**
 * Poll for TikTok upload completion
 */
async function pollTikTokUploadStatus(
  publishId: string,
  accessToken: string,
  maxAttempts: number = 10
): Promise<string> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const body = JSON.stringify({
      publish_id: publishId,
    });

    const response = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error(
        `TikTok status check error: ${response.status}`
      );
    }

    const data = await response.json();
    const status = data.data.status;

    console.log(
      `TikTok upload status check ${attempt}/${maxAttempts}: ${status}`
    );

    if (status === "PUBLISH_COMPLETE") {
      const postIds = data.data.publiclt_available_post_id || [];
      if (postIds.length > 0) {
        return postIds[0];
      }
      throw new Error("TikTok published but no post ID returned");
    }

    if (status === "FAILED") {
      throw new Error(
        `TikTok upload failed: ${data.data.fail_reason || "Unknown error"}`
      );
    }

    // Wait before next poll (3 seconds)
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error(
    `TikTok upload timed out after ${maxAttempts * 3} seconds`
  );
}

/**
 * Download media from Supabase Storage
 */
async function downloadMediaFromStorage(
  mediaUrl: string
): Promise<ArrayBuffer> {
  if (!mediaUrl) {
    throw new Error("No media URL provided");
  }

  // Extract storage path from media_url
  // Assuming format: supabase-project.supabase.co/storage/v1/object/public/posts/uuid
  const response = await fetch(mediaUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download media: ${response.status}`
    );
  }

  return await response.arrayBuffer();
}

/**
 * Main TikTok publisher function
 */
export async function publishToTikTok(
  post: any,
  account: any
): Promise<TikTokPublishResult> {
  const operation = async () => {
    console.log(
      `Publishing to TikTok - Post: ${post.id}, Account: ${account.account_id}`
    );

    if (!post.media_url || post.media_type !== "video") {
      throw new Error(
        "TikTok requires video media. Text-only posts cannot be published to TikTok."
      );
    }

    // Download media from Supabase Storage
    console.log(`Downloading media from Supabase: ${post.media_url}`);
    const mediaBuffer = await downloadMediaFromStorage(post.media_url);
    console.log(
      `Downloaded media: ${mediaBuffer.byteLength} bytes`
    );

    // Initialize upload
    const { publishId, uploadUrl } = await initializeTikTokUpload(
      post,
      account.access_token,
      mediaBuffer.byteLength
    );

    console.log(`TikTok upload initialized - Publish ID: ${publishId}`);

    // Upload in chunks (ensure chunk_size <= video_size)
    const actualChunkSize = Math.min(CHUNK_SIZE, mediaBuffer.byteLength);
    const chunks = Math.ceil(mediaBuffer.byteLength / actualChunkSize);
    const uint8Array = new Uint8Array(mediaBuffer);

    for (let i = 0; i < chunks; i++) {
      const start = i * actualChunkSize;
      const end = Math.min(start + actualChunkSize, mediaBuffer.byteLength);
      const chunk = uint8Array.slice(start, end);

      await uploadTikTokChunk(uploadUrl, chunk, i, chunks, actualChunkSize);
    }

    console.log(`All ${chunks} chunks uploaded to TikTok`);

    // Poll for completion
    const tikTokPostId = await pollTikTokUploadStatus(
      publishId,
      account.access_token
    );

    console.log(
      `Successfully published to TikTok - Post ID: ${tikTokPostId}`
    );

    return {
      postId: post.id,
      tikTokPostId,
    };
  };

  try {
    return await withRetryAndTimeout(
      operation,
      {
        postId: post.id,
        userId: post.user_id,
        platform: "tiktok",
      },
      120000 // 2 minute timeout for video upload
    );
  } catch (error) {
    console.error(`Failed to publish to TikTok - Post: ${post.id}`, error);

    // Create error notification
    await createErrorNotification(
      post.user_id,
      post.id,
      "TikTok",
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
}

/**
 * Check TikTok API availability
 */
export async function checkTikTokHealth(
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/user/info/",
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}
