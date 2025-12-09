"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPlatformClasses } from "@/lib/utils/platform-colors";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface PostPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    content: string;
    platform: "tiktok" | "linkedin" | "twitter";
    scheduled_for?: string;
    media_url?: string;
  };
}

export function PostPreview({ open, onOpenChange, post }: PostPreviewProps) {
  const platformClasses = getPlatformClasses(post.platform);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
          <DialogDescription>
            Preview how your post will look on {post.platform}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Platform Badge */}
          <Badge
            variant="outline"
            className={cn("text-xs", platformClasses.text, platformClasses.border)}
          >
            {post.platform.toUpperCase()}
          </Badge>

          {/* Media Preview */}
          {post.media_url && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={post.media_url}
                alt="Post media"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="whitespace-pre-wrap text-sm">{post.content}</p>
          </div>

          {/* Scheduled Time */}
          {post.scheduled_for && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>
                Scheduled for {format(new Date(post.scheduled_for), "PPP 'at' p")}
              </span>
            </div>
          )}

          {/* Platform-Specific Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            {post.platform === "twitter" && (
              <p>Character count: {post.content.length} / 280</p>
            )}
            {post.platform === "tiktok" && (
              <p>Caption length: {post.content.length} / 2200</p>
            )}
            {post.platform === "linkedin" && (
              <p>Character count: {post.content.length} / 3000</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
