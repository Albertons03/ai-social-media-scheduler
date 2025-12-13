export type Platform = 'tiktok' | 'linkedin' | 'twitter';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type MediaType = 'video' | 'image' | 'none';

export type PrivacyLevel = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  tier?: string;
  posts_this_month?: number;
  billing_cycle_start?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  account_id: string;
  account_name?: string;
  account_handle?: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  social_account_id?: string;
  platform: Platform;
  status: PostStatus;
  content: string;
  media_url?: string;
  media_type?: MediaType;
  thumbnail_url?: string;

  // TikTok specific
  privacy_level?: PrivacyLevel;
  allow_comments?: boolean;
  allow_duet?: boolean;
  allow_stitch?: boolean;

  // Scheduling
  scheduled_for?: string;
  published_at?: string;

  // Analytics
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  engagement_rate: number;

  // Platform IDs
  tiktok_post_id?: string;
  linkedin_post_id?: string;
  twitter_post_id?: string;

  // AI metadata
  ai_generated: boolean;
  ai_prompt?: string;

  // Error tracking
  error_message?: string;
  error_details?: any;
  retry_count: number;
  last_retry_at?: string;

  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  prompt: string;
  generated_content: string;
  model: string;
  tokens_used?: number;
  created_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  post_id: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  snapshot_at: string;
  created_at: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  post_id?: string;
  is_read: boolean;
  created_at: string;
}

// Form types
export interface PostFormData {
  platform: Platform;
  content: string;
  media?: File | null;
  thumbnail?: File | null;
  scheduled_for?: Date | null;
  privacy_level?: PrivacyLevel;
  allow_comments?: boolean;
  allow_duet?: boolean;
  allow_stitch?: boolean;
}

export interface AIGenerationRequest {
  prompt: string;
  platform?: Platform;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}

// AI Conversation types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  conversation_id: string;
  platform?: Platform;
  messages: ChatMessage[];
  model: string;
  total_tokens_used: number;
  created_at: string;
  updated_at: string;
}
