import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  tier: string;
  posts_this_month: number;
  created_at: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  source?: string;
  created_at: string;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  try {
    // Fetch all metrics in parallel
    const [
      { count: totalUsers },
      { count: freeUsers },
      { count: waitlistCount },
      { data: recentUsers },
      { data: topUsers },
    ] = await Promise.all([
      // Total users count
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),

      // Free tier users count
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('tier', 'free'),

      // Waitlist count
      supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true }),

      // Recent signups (last 10 users)
      supabase
        .from('profiles')
        .select('id, email, full_name, tier, posts_this_month, created_at')
        .order('created_at', { ascending: false })
        .limit(10),

      // Most active users (top 10 by posts_this_month)
      supabase
        .from('profiles')
        .select('id, email, full_name, tier, posts_this_month, created_at')
        .order('posts_this_month', { ascending: false })
        .limit(10),
    ]);

    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor user activity and system metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={totalUsers || 0}
            color="text-primary"
            icon="👥"
            description="Registered accounts"
          />
          <StatCard
            title="Free Tier Users"
            value={freeUsers || 0}
            color="text-green-500"
            icon="🆓"
            description="Active free tier"
          />
          <StatCard
            title="Waitlist Signups"
            value={waitlistCount || 0}
            color="text-yellow-500"
            icon="📧"
            description="Landing page emails"
          />
        </div>

        {/* Recent Users Section */}
        <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🆕</span>
            <h2 className="text-xl font-bold text-foreground">Recent Signups</h2>
          </div>

          {!recentUsers || recentUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No users yet
            </p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((user: Profile) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between text-sm py-3 px-4 rounded-lg hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-medium">
                      {user.email}
                    </span>
                    {user.full_name && (
                      <span className="text-muted-foreground text-xs">
                        {user.full_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <TierBadge tier={user.tier} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Users by Activity Section */}
        <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-foreground">Most Active Users</h2>
          </div>

          {!topUsers || topUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No activity yet
            </p>
          ) : (
            <div className="space-y-2">
              {topUsers.map((user: Profile) => {
                const isAtLimit = user.tier === 'free' && user.posts_this_month >= 10;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between text-sm py-3 px-4 rounded-lg hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground font-medium">
                        {user.email}
                      </span>
                      {user.full_name && (
                        <span className="text-muted-foreground text-xs">
                          {user.full_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-base">
                        {user.posts_this_month} posts
                      </span>
                      {isAtLimit && (
                        <span className="flex items-center gap-1 text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full">
                          ⚠️ At limit
                        </span>
                      )}
                      <TierBadge tier={user.tier} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold">Error loading dashboard</p>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
}

// Stat Card Component
function StatCard({
  title,
  value,
  color,
  icon,
  description,
}: {
  title: string;
  value: number;
  color: string;
  icon: string;
  description: string;
}) {
  return (
    <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{icon}</span>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-medium">
            {title}
          </span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </div>
      <div className={`text-5xl font-bold ${color}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

// Tier Badge Component
function TierBadge({ tier }: { tier: string }) {
  const tierColors: Record<string, { bg: string; text: string }> = {
    free: { bg: 'bg-green-500/10', text: 'text-green-500' },
    pro: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    admin: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  };

  const colors = tierColors[tier] || { bg: 'bg-muted', text: 'text-muted-foreground' };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.bg} ${colors.text}`}
    >
      {tier}
    </span>
  );
}
