"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getPlatformClasses } from "@/lib/utils/platform-colors";

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

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Posts
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            📝
          </motion.div>
        </CardTitle>
        <CardDescription>Your latest activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              No posts yet. Create your first post to get started!
            </motion.div>
          ) : (
            posts.slice(0, 5).map((post, index) => {
              const platformClasses = getPlatformClasses(post.platform);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={cn(
                    "group relative flex items-start gap-3 p-3 rounded-lg border-2",
                    "hover:shadow-md transition-all duration-300 overflow-hidden",
                    platformClasses.bgLight
                  )}
                >
                  {/* Platform gradient indicator */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      "group-hover:w-2 transition-all duration-300",
                      platformClasses.bg
                    )}
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold uppercase",
                          platformClasses.text,
                          platformClasses.border,
                          platformClasses.bgLight
                        )}
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
                          ? `Scheduled ${formatDistanceToNow(new Date(post.scheduled_for), { addSuffix: true })}`
                          : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
