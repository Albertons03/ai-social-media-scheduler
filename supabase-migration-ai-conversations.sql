-- ============================================================================
-- AI CONVERSATIONS TABLE MIGRATION
-- ============================================================================
-- Purpose: Store AI-powered conversation threads for content generation
-- Each conversation maintains message history with user/assistant roles
-- Platform-specific context for TikTok, LinkedIn, and Twitter content
--
-- Run this file in Supabase SQL Editor to add AI conversation storage
-- ============================================================================

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

-- AI Conversations table for storing conversation threads
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  -- Primary identifier
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User relationship (cascade delete when user is removed)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conversation identifier (used for grouping related messages)
  conversation_id TEXT NOT NULL,

  -- Platform context for content generation
  platform TEXT CHECK (platform IN ('twitter', 'linkedin', 'tiktok')),

  -- Message history stored as JSONB array
  -- Format: [{"role": "user"|"assistant", "content": "...", "timestamp": "..."}]
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Optional title for the conversation (derived from first message)
  title TEXT,

  -- AI model used
  model TEXT DEFAULT 'claude-sonnet-4-20250514',

  -- Token usage tracking
  total_tokens_used INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Ensure unique conversation_id per user (allows same ID across users)
  UNIQUE(user_id, conversation_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite index for user queries sorted by most recent activity
-- This is the most common query pattern: "show me my conversations, newest first"
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated
  ON public.ai_conversations(user_id, updated_at DESC);

-- Index for conversation_id lookups (finding specific conversation)
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_id
  ON public.ai_conversations(conversation_id);

-- Index for platform filtering (finding all TikTok conversations, etc.)
CREATE INDEX IF NOT EXISTS idx_conversations_platform
  ON public.ai_conversations(platform) WHERE platform IS NOT NULL;

-- GIN index for JSONB messages field (enables efficient queries on message content)
CREATE INDEX IF NOT EXISTS idx_conversations_messages
  ON public.ai_conversations USING gin(messages);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to rerun migration)
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.ai_conversations;

-- RLS Policy: SELECT - Users can only view their own conversations
CREATE POLICY "Users can view their own conversations"
  ON public.ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: INSERT - Users can only create conversations for themselves
CREATE POLICY "Users can insert their own conversations"
  ON public.ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: UPDATE - Users can only update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON public.ai_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: DELETE - Users can only delete their own conversations
CREATE POLICY "Users can delete their own conversations"
  ON public.ai_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to automatically update updated_at timestamp
-- Reuses the existing handle_updated_at() function from main schema
DROP TRIGGER IF EXISTS set_updated_at_ai_conversations ON public.ai_conversations;

CREATE TRIGGER set_updated_at_ai_conversations
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ADD MISSING COLUMNS (if table already exists without them)
-- ============================================================================

-- Add title column if it doesn't exist (safe to run multiple times)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ai_conversations'
      AND column_name = 'title'
  ) THEN
    ALTER TABLE public.ai_conversations ADD COLUMN title TEXT;
  END IF;
END $$;

-- ============================================================================
-- COMMENTS (DOCUMENTATION)
-- ============================================================================

COMMENT ON TABLE public.ai_conversations IS
  'Stores AI conversation threads for content generation with platform-specific context';

COMMENT ON COLUMN public.ai_conversations.conversation_id IS
  'Client-generated conversation identifier for grouping related messages';

COMMENT ON COLUMN public.ai_conversations.messages IS
  'JSONB array of message objects with role (user/assistant), content, and timestamp';

COMMENT ON COLUMN public.ai_conversations.platform IS
  'Optional platform context (twitter, linkedin, tiktok) for content generation';

COMMENT ON COLUMN public.ai_conversations.model IS
  'AI model used for generating responses (e.g., claude-sonnet-4-20250514)';

COMMENT ON COLUMN public.ai_conversations.total_tokens_used IS
  'Total number of tokens consumed by this conversation across all messages';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verification query (uncomment to test after running migration)
-- SELECT
--   'ai_conversations table created' as status,
--   COUNT(*) as row_count
-- FROM public.ai_conversations;
