-- Hotfix: Remove infinite recursion RLS policy on waitlist table
-- Run this in Supabase SQL Editor immediately

-- 1. Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can view waitlist" ON waitlist;

-- 2. Confirm waitlist RLS is still enabled (public insert only)
-- Anyone can insert into waitlist (for email capture)
-- But only service_role can SELECT from waitlist (for admin dashboard)
-- This prevents infinite recursion with profiles table

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'waitlist';
