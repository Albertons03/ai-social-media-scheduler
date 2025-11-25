import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Calendar, TrendingUp, Users, FileText } from 'lucide-react';
import { getPostAnalytics } from '@/lib/db/posts';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch analytics
  const analytics = await getPostAnalytics(user.id);

  // Calculate engagement rate
  const totalEngagements = analytics.total_likes + analytics.total_comments + analytics.total_shares;
  const engagementRate = analytics.total_views > 0
    ? ((totalEngagements / analytics.total_views) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SocialScheduler</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || user.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">
              Here&apos;s what&apos;s happening with your social media accounts
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                  <p className="text-2xl font-bold mt-1">{analytics.scheduled}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold mt-1">{analytics.total_views.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold mt-1">{engagementRate}%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold mt-1">{analytics.published}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/schedule" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <h3 className="font-medium mb-1">Create New Post</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule a post across platforms
                </p>
              </Link>
              <Link href="/schedule" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <h3 className="font-medium mb-1">View Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  See your scheduled posts
                </p>
              </Link>
              <Link href="/settings" className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <h3 className="font-medium mb-1">Connect Account</h3>
                <p className="text-sm text-muted-foreground">
                  Link your social media accounts
                </p>
              </Link>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Posts by Platform</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">TikTok</p>
                <p className="text-2xl font-bold text-pink-600">{analytics.by_platform.tiktok}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">LinkedIn</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.by_platform.linkedin}</p>
              </div>
              <div className="text-center p-4 bg-sky-50 rounded-lg">
                <p className="text-sm text-gray-600">Twitter</p>
                <p className="text-2xl font-bold text-sky-600">{analytics.by_platform.twitter}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
