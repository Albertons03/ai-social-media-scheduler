-- ============================================================================
-- QUICK FIX: Add missing 'title' column to ai_conversations table
-- ============================================================================
-- Run this if you already ran the migration but it didn't include the title column
-- This is safe to run multiple times - it won't error if the column already exists
-- ============================================================================

DO $$
BEGIN
  -- Check if title column exists, if not, add it
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ai_conversations'
      AND column_name = 'title'
  ) THEN
    ALTER TABLE public.ai_conversations
    ADD COLUMN title TEXT;

    RAISE NOTICE 'Added title column to ai_conversations table';
  ELSE
    RAISE NOTICE 'Title column already exists, skipping';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ai_conversations'
ORDER BY ordinal_position;
