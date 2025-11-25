import { createClient } from '@/lib/supabase/server';
import { Post, PostFormData, PostStatus, Platform } from '@/lib/types/database.types';

export async function getPosts(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getPostById(postId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getPostsByStatus(userId: string, status: PostStatus) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getPostsByPlatform(userId: string, platform: Platform) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getScheduledPosts(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'scheduled')
    .not('scheduled_for', 'is', null)
    .order('scheduled_for', { ascending: true });

  if (error) throw error;
  return data as Post[];
}

export async function createPost(userId: string, postData: Partial<Post>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        ...postData,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function updatePost(postId: string, userId: string, updates: Partial<Post>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(postId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

export async function updatePostStatus(postId: string, userId: string, status: PostStatus) {
  const supabase = await createClient();

  const updates: Partial<Post> = { status };

  // If published, set published_at timestamp
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getPostAnalytics(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('platform, status, views_count, likes_count, comments_count, shares_count')
    .eq('user_id', userId);

  if (error) throw error;

  // Calculate aggregated analytics
  const analytics = {
    total_posts: data.length,
    published: data.filter(p => p.status === 'published').length,
    scheduled: data.filter(p => p.status === 'scheduled').length,
    draft: data.filter(p => p.status === 'draft').length,
    failed: data.filter(p => p.status === 'failed').length,
    total_views: data.reduce((sum, p) => sum + (p.views_count || 0), 0),
    total_likes: data.reduce((sum, p) => sum + (p.likes_count || 0), 0),
    total_comments: data.reduce((sum, p) => sum + (p.comments_count || 0), 0),
    total_shares: data.reduce((sum, p) => sum + (p.shares_count || 0), 0),
    by_platform: {
      tiktok: data.filter(p => p.platform === 'tiktok').length,
      linkedin: data.filter(p => p.platform === 'linkedin').length,
      twitter: data.filter(p => p.platform === 'twitter').length,
    },
  };

  return analytics;
}
