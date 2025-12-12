import { createClient } from '@/lib/supabase/server';

/**
 * Track a post scheduled by the user
 * Increments posts_this_month counter in profiles table
 */
export async function trackPostScheduled(userId: string, platform: string) {
  const supabase = await createClient();

  try {
    // 1. Log activity in user_activity table
    const { error: activityError } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        action: 'post_scheduled',
        metadata: { platform },
      });

    if (activityError) {
      console.error('Error logging user activity:', activityError);
    }

    // 2. Increment posts_this_month counter in profiles table
    const { error: incrementError } = await supabase.rpc('increment_post_count', {
      p_user_id: userId,
    });

    if (incrementError) {
      console.error('Error incrementing post count:', incrementError);
      throw incrementError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking post scheduled:', error);
    throw error;
  }
}

/**
 * Get user's current usage (posts this month and tier)
 */
export async function getUserUsage(userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('posts_this_month, tier')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user usage:', error);
      throw error;
    }

    return {
      posts_this_month: data?.posts_this_month || 0,
      tier: data?.tier || 'free',
    };
  } catch (error) {
    console.error('Error getting user usage:', error);
    throw error;
  }
}

/**
 * Check if user has reached their tier limit
 * Returns true if user can schedule more posts
 */
export async function canSchedulePost(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  postsThisMonth: number;
  limit: number;
}> {
  try {
    const usage = await getUserUsage(userId);

    // Free tier limit is 10 posts per month
    const limit = usage.tier === 'free' ? 10 : Number.MAX_SAFE_INTEGER;

    if (usage.tier === 'free' && usage.posts_this_month >= limit) {
      return {
        allowed: false,
        reason: 'Free tier limit reached (10 posts/month). Upgrade to Pro for unlimited posts!',
        postsThisMonth: usage.posts_this_month,
        limit,
      };
    }

    return {
      allowed: true,
      postsThisMonth: usage.posts_this_month,
      limit,
    };
  } catch (error) {
    console.error('Error checking if user can schedule post:', error);
    throw error;
  }
}
