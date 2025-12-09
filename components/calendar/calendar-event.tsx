"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { getPlatformClasses } from "@/lib/utils/platform-colors";
import { GripVertical } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Post } from "@/lib/types/database.types";

interface CalendarEventProps {
  id: string;
  post: Post;
}

const platformEmojis = {
  tiktok: "🎵",
  linkedin: "💼",
  twitter: "🐦",
};

export function CalendarEvent({ id, post }: CalendarEventProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const platformClasses = getPlatformClasses(post.platform);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative p-3 rounded-lg border-2 transition-all cursor-move overflow-hidden",
        "hover:shadow-lg hover:scale-[1.02]",
        platformClasses.border,
        platformClasses.bgLight,
        isDragging && "opacity-50 scale-105 shadow-2xl z-50 ring-4 ring-primary/50"
      )}
      {...attributes}
      {...listeners}
    >
      {/* Platform gradient accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          "group-hover:w-2 transition-all duration-300",
          platformClasses.bg
        )}
      />

      {/* Gradient overlay on hover */}
      <motion.div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          post.platform === "tiktok" && "bg-gradient-to-br from-[#FE2C55]/10 via-[#25F4EE]/10 to-transparent",
          post.platform === "linkedin" && "bg-gradient-to-br from-[#0077B5]/10 to-transparent",
          post.platform === "twitter" && "bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent"
        )}
      />

      {/* Glow effect when dragging */}
      {isDragging && (
        <div
          className={cn(
            "absolute -inset-1 blur-xl opacity-50 rounded-lg",
            platformClasses.bg
          )}
        />
      )}

      <div className="flex items-start gap-2 relative z-10">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.2 }}
        >
          <GripVertical
            className={cn(
              "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5",
              platformClasses.text
            )}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {platformEmojis[post.platform]}
            </motion.span>
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                platformClasses.text
              )}
            >
              {post.platform}
            </span>
            {post.scheduled_for && (
              <span className="text-xs text-muted-foreground font-medium">
                {format(new Date(post.scheduled_for), "h:mm a")}
              </span>
            )}
          </div>
          <p className="text-sm line-clamp-2 group-hover:text-foreground/90 transition-colors">
            {post.content}
          </p>
        </div>
      </div>

      {/* Bottom gradient accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          platformClasses.bg
        )}
      />
    </div>
  );
}
