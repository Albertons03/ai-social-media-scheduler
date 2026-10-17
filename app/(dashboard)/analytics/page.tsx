import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPostAnalytics, getPosts } from '@/lib/db/posts';
import { TrendingUp, Eye, Heart, MessageCircle, BarChart3 } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch analytics and posts
  const analytics = await getPostAnalytics(user.id);
  const posts = await getPosts(user.id);

  // Most recent published posts (engagement metrics are not synced from platforms)
  const publishedPosts = posts
    .filter((p) => p.status === 'published')
    .slice(0, 5);

  const unavailableNote = 'Platform analytics sync not available yet';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your social media performance across platforms
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground mt-1">{unavailableNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground mt-1">{unavailableNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground mt-1">{unavailableNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground mt-1">{unavailableNote}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Platform Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Posts by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-pink-500" />
                    <span className="font-medium">TikTok</span>
                  </div>
                  <span className="text-2xl font-bold">{analytics.by_platform.tiktok}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full"
                    style={{
                      width: `${(analytics.by_platform.tiktok / analytics.total_posts) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-600" />
                    <span className="font-medium">LinkedIn</span>
                  </div>
                  <span className="text-2xl font-bold">{analytics.by_platform.linkedin}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(analytics.by_platform.linkedin / analytics.total_posts) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-sky-500" />
                    <span className="font-medium">Twitter</span>
                  </div>
                  <span className="text-2xl font-bold">{analytics.by_platform.twitter}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{
                      width: `${(analytics.by_platform.twitter / analytics.total_posts) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Status */}
          <Card>
            <CardHeader>
              <CardTitle>Post Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-700">Published</span>
                  <span className="text-2xl font-bold text-green-700">{analytics.published}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-700">Scheduled</span>
                  <span className="text-2xl font-bold text-blue-700">{analytics.scheduled}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="font-medium text-muted-foreground">Draft</span>
                  <span className="text-2xl font-bold text-muted-foreground">{analytics.draft}</span>
                </div>
                {analytics.failed > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-700">Failed</span>
                    <span className="text-2xl font-bold text-red-700">{analytics.failed}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Published Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publishedPosts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No published posts yet. Create and publish posts to see analytics.
              </p>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            post.platform === 'tiktok'
                              ? 'bg-pink-100 text-pink-700'
                              : post.platform === 'linkedin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {post.platform}
                        </span>
                      </div>
                      <p className="text-sm text-foreground truncate">{post.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      Metrics not available
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
