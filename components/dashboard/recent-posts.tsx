import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  platform: "tiktok" | "linkedin" | "twitter";
  status: "draft" | "scheduled" | "published" | "failed";
  scheduled_for?: string;
  created_at: string;
}

interface RecentPostsProps {
  posts: Post[];
}

const platformColors = {
  tiktok: "bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/20",
  linkedin: "bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/20",
  twitter: "bg-black/10 text-black dark:bg-white/10 dark:text-white border-black/20 dark:border-white/20",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
        <CardDescription>Your latest activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No posts yet. Create your first post to get started!
            </div>
          ) : (
            posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", platformColors[post.platform])}
                    >
                      {post.platform}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", statusColors[post.status])}
                    >
                      {post.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.scheduled_for
                        ? `Scheduled for ${formatDistanceToNow(new Date(post.scheduled_for), { addSuffix: true })}`
                        : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
