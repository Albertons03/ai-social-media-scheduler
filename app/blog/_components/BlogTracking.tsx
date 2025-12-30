"use client";

import { useEffect } from "react";
import { trackBlogEvents } from "@/lib/analytics";

interface BlogTrackingProps {
  postSlug: string;
  postTitle: string;
}

export default function BlogTracking({
  postSlug,
  postTitle,
}: BlogTrackingProps) {
  useEffect(() => {
    // Track blog post view
    trackBlogEvents.viewPost(postSlug, postTitle);

    // Track scroll progress
    let maxScroll = 0;
    const trackScrollProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Only track significant milestones and prevent spam
      if (
        scrollPercentage > maxScroll &&
        scrollPercentage >= 25 &&
        scrollPercentage % 25 === 0
      ) {
        maxScroll = scrollPercentage;
        trackBlogEvents.readProgress(postSlug, scrollPercentage);
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      if (timeSpent > 30) {
        // Only track if user spent more than 30 seconds
        trackBlogEvents.readProgress(postSlug, -1); // Use -1 to indicate time-based tracking
      }
    };

    window.addEventListener("scroll", trackScrollProgress);
    window.addEventListener("beforeunload", trackTimeOnPage);

    return () => {
      window.removeEventListener("scroll", trackScrollProgress);
      window.removeEventListener("beforeunload", trackTimeOnPage);
    };
  }, [postSlug, postTitle]);

  return null; // This component doesn't render anything
}
