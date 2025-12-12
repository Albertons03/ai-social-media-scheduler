-- COMPLETE FIX: Remove ALL profiles policies and recreate safely
-- Run this in Supabase SQL Editor NOW

-- 1. Drop ALL existing policies (including the problematic "Admins/Agents" one)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins/Agents can view workspace profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- 2. Verify all policies are gone
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';

-- 3. Create ONLY the essential policies (NO subqueries, NO self-references)

-- Allow users to view ONLY their own profile (using auth.uid() directly)
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow users to update ONLY their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow users to insert ONLY their own profile
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- 4. Verify only 3 safe policies exist
SELECT
  policyname,
  cmd,
  qual::text as using_clause,
  with_check::text as check_clause
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;
