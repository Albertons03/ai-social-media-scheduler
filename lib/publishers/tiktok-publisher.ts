import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface TikTokPublishResult {
  postId: string;
  tikTokPostId: string;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks (TikTok recommended)

/**
 * Map frontend privacy values to TikTok API values
 */
function mapPrivacyLevel(frontendValue: string | null | undefined): string {
  const mapping: Record<string, string> = {
    "PUBLIC": "PUBLIC_TO_EVERYONE",
    "FRIENDS": "MUTUAL_FOLLOW_FRIENDS", 
    "PRIVATE": "SELF_ONLY",
  };

  return mapping[frontendValue || "PUBLIC"] || "PUBLIC_TO_EVERYONE";
}

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

  const requestBody = {
    post_info: {
      title: post.content.substring(0, 150), // Max 150 chars for title
      privacy_level: mapPrivacyLevel(post.privacy_level),
      disable_comment: post.allow_comments === false,
      disable_duet: post.allow_duet === false,
      disable_stitch: post.allow_stitch === false,
    },
    source_info: {
      source: "FILE_UPLOAD",
      video_size: fileSize,
      chunk_size: actualChunkSize,
      total_chunk_count: totalChunks,
    },
  };

  console.log("TikTok API Request Body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/video/init/",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
  chunkData: ArrayBuffer,
  chunkIndex: number,
  totalChunks: number,
  chunkSize: number,
  totalFileSize: number
): Promise<void> {
  const start = chunkIndex * chunkSize;
  const end = start + chunkData.byteLength - 1;
  const contentRange = `bytes ${start}-${end}/${totalFileSize}`;

  console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks}:`);
  console.log(`  Content-Range: ${contentRange}`);
  console.log(`  Content-Length: ${chunkData.byteLength}`);
  console.log(`  Chunk size: ${chunkSize}, Total file size: ${totalFileSize}`);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Range": contentRange,
      "Content-Length": chunkData.byteLength.toString(),
      "Content-Type": "video/mp4",
    },
    body: chunkData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`TikTok chunk upload failed:`, {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      contentRange,
    });
    throw new Error(
      `TikTok chunk upload error: ${response.status} - ${errorText}`
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
    console.log("Full TikTok status response:", JSON.stringify(data, null, 2));

    if (status === "PUBLISH_COMPLETE") {
      // Try multiple possible field names (TikTok API inconsistency)
      const postIds = data.data.publicly_available_post_id
                   || data.data.publiclt_available_post_id
                   || data.data.post_id
                   || [];

      console.log("Post IDs found:", postIds);

      if (postIds.length > 0) {
        return postIds[0];
      }

      // For private videos in development mode, TikTok doesn't return post ID
      // but the video is still successfully published
      console.log("No post ID returned (likely private video in dev mode). Video published successfully!");
      return publishId; // Use publishId as fallback identifier
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
  // Extract the file path from the full Supabase URL
  const url = new URL(mediaUrl);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/(.+)/);
  
  if (!pathMatch) {
    throw new Error(`Invalid Supabase storage URL: ${mediaUrl}`);
  }

  const [, filePath] = pathMatch;
  const [bucket, ...filePathParts] = filePath.split('/');
  const fileName = filePathParts.join('/');

  console.log(`Downloading from bucket: ${bucket}, file: ${fileName}`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .download(fileName);

  if (error) {
    console.error("Supabase storage download error:", error);
    throw new Error(`Failed to download media: ${error.message}`);
  }

  if (!data) {
    throw new Error("No media data returned from Supabase storage");
  }

  return await data.arrayBuffer();
}

/**
 * Refresh TikTok OAuth token
 */
async function refreshTikTokToken(
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET!;

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
    throw new Error("No access token returned from TikTok token refresh");
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  };
}

/**
 * Main TikTok publisher function
 */
export async function publishToTikTok(
  post: any,
  account: any
): Promise<TikTokPublishResult> {
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

  for (let i = 0; i < chunks; i++) {
    const start = i * actualChunkSize;
    const end = Math.min(start + actualChunkSize, mediaBuffer.byteLength);
    const chunk = mediaBuffer.slice(start, end);

    await uploadTikTokChunk(uploadUrl, chunk, i, chunks, actualChunkSize, mediaBuffer.byteLength);
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