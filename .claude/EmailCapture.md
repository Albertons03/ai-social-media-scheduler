@ProjectManager - Építs be email capture és usage tracking-et a landing page-be.

## Feladat: Email Waitlist + Basic Analytics

### 1. Supabase Table Setup

Hozd létre ezt a táblát (Supabase SQL Editor):

```sql
-- Waitlist table (email capture a landing page-ről)
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- 'landing_hero', 'landing_pricing', 'landing_footer'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity tracking (FREE tier usage)
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'post_scheduled', 'ai_chat_used', 'login'
  metadata JSONB, -- {platform: 'twitter', post_count: 1}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User tier tracking
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS posts_this_month INT DEFAULT 0;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS signup_date TIMESTAMPTZ DEFAULT NOW();

-- Index a gyors query-khez
CREATE INDEX idx_user_activity_user ON user_activity(user_id, created_at DESC);
CREATE INDEX idx_users_tier ON auth.users(tier);
```

### 2. Waitlist API Endpoint (Landing page email capture)

Hozd létre: `app/api/waitlist/route.ts`

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, source } = await req.json();

  // Basic email validation
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  // Insert to waitlist
  const { data, error } = await supabase
    .from("waitlist")
    .insert({ email, source })
    .select();

  if (error) {
    // Duplicate email esetén is success (ne adjunk info)
    if (error.code === "23505") {
      return NextResponse.json({
        success: true,
        message: "Already subscribed!",
      });
    }

    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  // TODO: Send welcome email (később Resend/SendGrid)

  return NextResponse.json({
    success: true,
    message: "Successfully joined waitlist!",
  });
}

// GET endpoint: Admin számára (hány waitlist user van)
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { count } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({ count });
}
```

### 3. Landing Page Email Capture Form (Hero Section-ban)

Módosítsd a `Hero.tsx` komponenst:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "landing_hero" }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    setLoading(false);

    if (data.success) {
      setEmail(""); // Clear input
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ... existing background code ... */}

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          AI Social Media
          <br />
          <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
            On Autopilot
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Stop wasting 10 hours/week on content. Let AI generate, optimize, and
          schedule posts for Twitter, LinkedIn & TikTok—while you sleep.
        </p>

        {/* EMAIL CAPTURE FORM */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary-light hover:bg-cyan-400 text-black font-semibold rounded-full transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Joining..." : "Start Free →"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-3 text-sm ${
                message.includes("success") || message.includes("Already")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 justify-center text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            10 posts/month free forever
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>

      {/* ... existing scroll indicator ... */}
    </section>
  );
}
```

### 4. Usage Tracking (Dashboard-ban)

Módosítsd a meglévő post scheduling logic-ot hogy trackelje a usage-t:

```typescript
// app/api/schedule/route.ts (vagy ahol a post scheduling történik)

// Amikor user scheduled egy postot:
async function trackPostScheduled(userId: string, platform: string) {
  const supabase = createRouteHandlerClient({ cookies })

  // 1. Log activity
  await supabase.from('user_activity').insert({
    user_id: userId,
    action: 'post_scheduled',
    metadata: { platform }
  })

  // 2. Increment posts_this_month counter
  await supabase.rpc('increment_post_count', { user_id: userId })
}

// Supabase Function (SQL Editor-ban hozd létre):
CREATE OR REPLACE FUNCTION increment_post_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET posts_this_month = posts_this_month + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. FREE Tier Limit Enforcement (10 posts/month)

```typescript
// app/api/schedule/route.ts

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check user tier and usage
  const { data: user } = await supabase
    .from("auth.users")
    .select("tier, posts_this_month")
    .eq("id", session.user.id)
    .single();

  // FREE tier limit: 10 posts/month
  if (user.tier === "free" && user.posts_this_month >= 10) {
    return NextResponse.json(
      {
        error:
          "Free tier limit reached (10 posts/month). Upgrade to Pro for unlimited posts!",
        upgrade_required: true,
      },
      { status: 403 }
    );
  }

  // ... rest of scheduling logic ...

  // Track the scheduled post
  await trackPostScheduled(session.user.id, platform);

  return NextResponse.json({ success: true });
}
```

### 6. Dashboard Usage Display

Hozz létre egy usage counter komponenst a dashboard-ra:

```tsx
// app/components/UsageCounter.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UsageCounter() {
  const [usage, setUsage] = useState({ current: 0, limit: 10 });
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadUsage() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("auth.users")
        .select("posts_this_month, tier")
        .eq("id", user.id)
        .single();

      setUsage({
        current: data.posts_this_month || 0,
        limit: data.tier === "free" ? 10 : 9999,
      });
    }

    loadUsage();
  }, []);

  const percentage = (usage.current / usage.limit) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">Posts This Month</span>
        <span
          className={`text-sm font-medium ${
            isNearLimit ? "text-yellow-400" : "text-slate-400"
          }`}
        >
          {usage.current} / {usage.limit === 9999 ? "∞" : usage.limit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            isNearLimit ? "bg-yellow-400" : "bg-primary-light"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isNearLimit && usage.limit !== 9999 && (
        <p className="mt-3 text-xs text-yellow-400">
          ⚠️ You're close to your limit.{" "}
          <a href="#" className="underline">
            Upgrade to Pro
          </a>{" "}
          for unlimited posts.
        </p>
      )}
    </div>
  );
}
```

## Success Criteria:

- ✅ Email capture működik landing page-en
- ✅ Waitlist emails mentődnek Supabase-be
- ✅ User registration automatikusan tier='free' lesz
- ✅ Post scheduling számlálja a posts_this_month-ot
- ✅ 11. post után error: "Upgrade required"
- ✅ Dashboard mutatja usage counter-t

Ellenőrizd:

1. Submit email a landing page-en → Check Supabase `waitlist` table
2. Új user signup → Check `auth.users` hogy `tier='free'`
3. Schedule 10 post → 11. post rejected
