-- ============================================================================
-- MIGRATION: Add missing columns to posts table
-- ============================================================================
-- This script adds error tracking columns to the existing posts table

-- Add error tracking columns if they don't exist
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS error_details JSONB,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_retry_at TIMESTAMP WITH TIME ZONE;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name IN ('error_message', 'error_details', 'retry_count', 'last_retry_at');
