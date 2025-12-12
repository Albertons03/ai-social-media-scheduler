-- Email Capture & Usage Tracking Migration
-- Run this in Supabase SQL Editor

-- 1. Waitlist table (email capture from landing page)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- 'landing_hero', 'landing_pricing', 'landing_footer', 'landing_final_cta'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User activity tracking (FREE tier usage)
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'post_scheduled', 'ai_chat_used', 'login'
  metadata JSONB, -- {platform: 'twitter', post_count: 1}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add tier tracking columns to profiles table
-- (Using profiles table instead of auth.users for better access control)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_this_month INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMPTZ DEFAULT NOW();

-- 4. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- 5. RLS Policies for waitlist (public insert only)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert into waitlist"
  ON waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view waitlist"
  ON waitlist FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE tier = 'admin'
  ));

-- 6. RLS Policies for user_activity (users can only see their own)
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 7. Function to increment post count
CREATE OR REPLACE FUNCTION increment_post_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET posts_this_month = posts_this_month + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function to reset monthly post counts (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_post_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET
    posts_this_month = 0,
    billing_cycle_start = NOW()
  WHERE
    billing_cycle_start < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_post_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_monthly_post_counts() TO service_role;
