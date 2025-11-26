import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  postId?: string;
}

/**
 * Create a success notification when post is published
 */
export async function createSuccessNotification(
  userId: string,
  postId: string,
  platform: string
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type: "success",
    title: `Post published on ${platform}`,
    message: `Your scheduled post has been successfully published to ${platform}.`,
    post_id: postId,
  });

  if (error) {
    console.error("Failed to create success notification:", error);
  } else {
    console.log(
      `Success notification created for post ${postId} on ${platform}`
    );
  }
}

/**
 * Create an error notification when publishing fails
 */
export async function createErrorNotification(
  userId: string,
  postId: string,
  platform: string,
  errorMessage: string
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type: "error",
    title: `Failed to publish on ${platform}`,
    message: `Your scheduled post could not be published to ${platform}: ${errorMessage.substring(0, 200)}`,
    post_id: postId,
  });

  if (error) {
    console.error("Failed to create error notification:", error);
  } else {
    console.log(`Error notification created for post ${postId} on ${platform}`);
  }
}

/**
 * Create a warning notification for token expiry
 */
export async function createTokenExpiryNotification(
  userId: string,
  platform: string
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type: "warning",
    title: `${platform} authentication expired`,
    message: `Your ${platform} authentication has expired. Please reconnect your account in Settings to continue posting.`,
  });

  if (error) {
    console.error("Failed to create token expiry notification:", error);
  } else {
    console.log(`Token expiry notification created for ${platform}`);
  }
}

/**
 * Create an info notification
 */
export async function createInfoNotification(
  userId: string,
  title: string,
  message: string,
  postId?: string
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type: "info",
    title,
    message,
    post_id: postId,
  });

  if (error) {
    console.error("Failed to create info notification:", error);
  }
}

/**
 * Generic notification creation
 */
export async function createNotification(
  data: NotificationData
): Promise<void> {
  const { error } = await supabase.from("notifications").insert({
    user_id: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    post_id: data.postId,
  });

  if (error) {
    console.error(
      `Failed to create ${data.type} notification for user ${data.userId}:`,
      error
    );
  } else {
    console.log(
      `${data.type.toUpperCase()} notification created: ${data.title}`
    );
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

/**
 * Get recent notifications for user
 */
export async function getRecentNotifications(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }

  return data || [];
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to get unread count:", error);
    return 0;
  }

  return count || 0;
}
