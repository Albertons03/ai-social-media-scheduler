"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { getPlatformClasses } from "@/lib/utils/platform-colors";
import { GripVertical } from "lucide-react";
import { format } from "date-fns";

interface CalendarEventProps {
  id: string;
  post: {
    id: string;
    content: string;
    platform: "tiktok" | "linkedin" | "twitter";
    scheduled_for?: string | null;
  };
}

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
        "group relative p-3 rounded-lg border-2 transition-all cursor-move",
        "hover:shadow-md hover:scale-[1.02]",
        platformClasses.border,
        platformClasses.bgLight,
        isDragging && "opacity-50 scale-105 shadow-lg z-50"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-semibold uppercase", platformClasses.text)}>
              {post.platform}
            </span>
            {post.scheduled_for && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(post.scheduled_for), "h:mm a")}
              </span>
            )}
          </div>
          <p className="text-sm line-clamp-2">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
