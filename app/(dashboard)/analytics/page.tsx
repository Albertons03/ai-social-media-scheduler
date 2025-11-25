import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPostAnalytics, getPosts } from '@/lib/db/posts';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, BarChart3 } from 'lucide-react';

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

  // Get recent posts for top performing section
  const publishedPosts = posts
    .filter((p) => p.status === 'published')
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 5);

  // Calculate total engagement
  const totalEngagements = analytics.total_likes + analytics.total_comments + analytics.total_shares;
  const engagementRate = analytics.total_views > 0
    ? ((totalEngagements / analytics.total_views) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Track your social media performance across platforms
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_views.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Across all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_likes.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Total engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_comments.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">Total comments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{engagementRate}%</div>
              <p className="text-xs text-gray-600 mt-1">Overall engagement</p>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Draft</span>
                  <span className="text-2xl font-bold text-gray-700">{analytics.draft}</span>
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
              Top Performing Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publishedPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No published posts yet. Create and publish posts to see analytics.
              </p>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                      <p className="text-sm text-gray-900 truncate">{post.content}</p>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {post.shares_count.toLocaleString()}
                      </div>
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
