import { createClient } from "@/lib/supabase/server";
import { Notification } from "@/lib/types/database.types";

/**
 * Fetch notifications for a user
 */
export async function getNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Notification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }

  return (data as Notification[]) || [];
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to get unread count:", error);
    throw error;
  }

  return count || 0;
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
}

/**
 * Get notifications for a specific post
 */
export async function getPostNotifications(
  userId: string,
  postId: string
): Promise<Notification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch post notifications:", error);
    throw error;
  }

  return (data as Notification[]) || [];
}

/**
 * Get recent unread notifications
 */
export async function getRecentUnreadNotifications(
  userId: string,
  limit: number = 10
): Promise<Notification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch recent unread notifications:", error);
    throw error;
  }

  return (data as Notification[]) || [];
}

/**
 * Delete all read notifications for a user
 */
export async function deleteReadNotifications(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .eq("is_read", true);

  if (error) {
    console.error("Failed to delete read notifications:", error);
    throw error;
  }
}

/**
 * Delete notifications older than N days
 */
export async function deleteOldNotifications(
  userId: string,
  daysOld: number = 30
): Promise<void> {
  const supabase = await createClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .lt("created_at", cutoffDate.toISOString());

  if (error) {
    console.error("Failed to delete old notifications:", error);
    throw error;
  }
}
