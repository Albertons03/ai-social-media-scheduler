"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/calendar-view";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { PostForm } from "@/components/post/post-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CalendarOff, Clock } from "lucide-react";
import { Post } from "@/lib/types/database.types";
import {
  formatToLocalDateTime,
  getRelativeTime,
  getUserTimezone,
} from "@/lib/utils";
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, startOfToday } from "date-fns";
import { triggerConfetti } from "@/lib/utils/confetti";
import { toast } from "sonner";

export default function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to create post");

      await fetchPosts();
      setIsCreateModalOpen(false);

      // Trigger confetti animation
      triggerConfetti(postData.platform);
      toast.success("Post scheduled successfully! 🎉");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      throw error;
    }
  };

  const handleReorder = async (reorderedPosts: Post[]) => {
    setPosts(reorderedPosts);
    toast.success("Posts reordered successfully");
  };

  const handlePrevious = () => {
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(startOfToday());
  };

  const handleDateClick = (date: Date) => {
    // Open create modal with pre-filled date
    setIsCreateModalOpen(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  // Format scheduled/published time with relative time
  const formatPostTime = (post: Post): string => {
    if (post.scheduled_for && post.status === "scheduled") {
      const localTime = formatToLocalDateTime(post.scheduled_for);
      const relative = getRelativeTime(post.scheduled_for);
      return `Scheduled for ${localTime} (${relative})`;
    }
    if (post.published_at) {
      const localTime = formatToLocalDateTime(post.published_at);
      const relative = getRelativeTime(post.published_at);
      return `Published ${localTime} (${relative})`;
    }
    return "Draft";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  const scheduledPosts = posts.filter((p) => p.scheduled_for);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-2">
            Manage and schedule your social media posts
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Timezone: {getUserTimezone()}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Drag and drop to reschedule posts</CardDescription>
            </div>
          </div>
          <CalendarToolbar
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
        </CardHeader>
        <CardContent>
          {scheduledPosts.length > 0 ? (
            <CalendarGrid posts={scheduledPosts} onReorder={handleReorder} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scheduled posts</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Get started by creating your first social media post. Use AI to generate engaging content!
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legacy Calendar View (Fallback) */}
      <Card>
        <CardHeader>
          <CardTitle>Traditional Calendar</CardTitle>
          <CardDescription>Click on dates to schedule posts</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView
            posts={scheduledPosts}
            onDateClick={handleDateClick}
            onPostClick={handlePostClick}
          />
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogClose onClose={() => setIsCreateModalOpen(false)} />
          </DialogHeader>
          <PostForm onSubmit={handleCreatePost} />
        </DialogContent>
      </Dialog>

      {/* View/Edit Post Modal */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onOpenChange={(open) => !open && setSelectedPost(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post Details</DialogTitle>
              <DialogClose onClose={() => setSelectedPost(null)} />
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <p className="text-gray-700">{selectedPost.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Platform</h3>
                  <p className="text-gray-700 capitalize">
                    {selectedPost.platform}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p className="text-gray-700 capitalize">
                    {selectedPost.status}
                  </p>
                </div>
              </div>
              {/* Scheduled/Published Time */}
              <div>
                <h3 className="font-semibold mb-2">Time</h3>
                <p className="text-gray-700">{formatPostTime(selectedPost)}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Views</h3>
                  <p className="text-gray-700">
                    {selectedPost.views_count.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Likes</h3>
                  <p className="text-gray-700">
                    {selectedPost.likes_count.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comments</h3>
                  <p className="text-gray-700">
                    {selectedPost.comments_count.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedPost.media_url && (
                <div>
                  <h3 className="font-semibold mb-2">Media</h3>
                  {selectedPost.media_type === "video" ? (
                    <video
                      src={selectedPost.media_url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <img
                      src={selectedPost.media_url}
                      alt="Post media"
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
