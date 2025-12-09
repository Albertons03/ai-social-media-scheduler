"use client";

import { useState, useCallback } from "react";

interface Post {
  id: string;
  content: string;
  platform: "tiktok" | "linkedin" | "twitter";
  scheduled_for: string;
}

export function useCalendarDnd(initialPosts: Post[]) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isDragging, setIsDragging] = useState(false);

  const handleReorder = useCallback(async (reorderedPosts: Post[]) => {
    setPosts(reorderedPosts);

    // TODO: Send update to API
    try {
      // await fetch('/api/posts/reorder', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ posts: reorderedPosts }),
      // });
    } catch (error) {
      console.error("Failed to reorder posts:", error);
      // Revert on error
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    posts,
    isDragging,
    handleReorder,
    handleDragStart,
    handleDragEnd,
  };
}
