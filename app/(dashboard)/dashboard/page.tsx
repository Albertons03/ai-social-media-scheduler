import { createClient } from "@/lib/supabase/server";
import { getPostAnalytics } from "@/lib/db/posts";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import PiePlatformStats from "@/components/dashboard/pie-platform-stats";
import { BestPostingTimes } from "@/components/dashboard/best-posting-times";
import UsageCounter from "@/app/components/UsageCounter";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout handles redirect
  }

  // Fetch analytics
  const analytics = await getPostAnalytics(user.id);

  // Calculate engagement rate
  const totalEngagements =
    analytics.total_likes + analytics.total_comments + analytics.total_shares;
  const engagementRate =
    analytics.total_views > 0
      ? ((totalEngagements / analytics.total_views) * 100).toFixed(2)
      : "0.00";

  // Fetch recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your social media accounts
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Scheduled Posts"
          value={analytics.scheduled}
          description="Posts ready to publish"
          icon="calendar"
          trend={{ value: 12, isPositive: true }}
          index={0}
        />
        <StatsCard
          title="Total Views"
          value={analytics.total_views.toLocaleString()}
          description="Across all platforms"
          icon="trending"
          trend={{ value: 8, isPositive: true }}
          index={1}
        />
        <StatsCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          description="Average engagement"
          icon="users"
          trend={{ value: 3, isPositive: true }}
          index={2}
        />
        <StatsCard
          title="Published"
          value={analytics.published}
          description="Successfully posted"
          icon="file"
          index={3}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Best Posting Times */}
      <BestPostingTimes />

      {/* Usage Counter */}
      <UsageCounter />

      {/* Grid for Recent Posts and Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentPosts posts={recentPosts || []} />
        <PiePlatformStats
          stats={{
            tiktok: analytics.by_platform.tiktok,
            linkedin: analytics.by_platform.linkedin,
            twitter: analytics.by_platform.twitter,
          }}
        />
      </div>
    </div>
  );
}
