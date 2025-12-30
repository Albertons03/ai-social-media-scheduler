/**
 * ShareButtons Component
 * Social media share buttons for blog posts
 */

"use client";

import { generateShareUrls } from "@/lib/blog-utils";
import { trackBlogEvents } from "@/lib/analytics";
import { Twitter, Linkedin, Facebook, Link2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  postSlug?: string;
}

export default function ShareButtons({
  url,
  title,
  postSlug,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrls = generateShareUrls(url, title);

  const handleShare = (platform: string) => {
    if (postSlug) {
      trackBlogEvents.sharePost(postSlug, platform);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track link copy event
      if (postSlug) {
        trackBlogEvents.sharePost(postSlug, "copy_link");
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share:
      </span>

      {/* Twitter */}
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>

      {/* Facebook */}
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors relative"
        aria-label="Copy link"
      >
        <Link2 className="w-5 h-5" />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
