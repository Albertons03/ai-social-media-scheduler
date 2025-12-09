"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Notifications() {
  const [unreadCount] = React.useState(3);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
            <div className="font-medium">Post Published Successfully</div>
            <div className="text-sm text-muted-foreground">
              Your TikTok post has been published
            </div>
            <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
            <div className="font-medium">Scheduled Post Reminder</div>
            <div className="text-sm text-muted-foreground">
              You have 3 posts scheduled for tomorrow
            </div>
            <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
            <div className="font-medium">Analytics Update</div>
            <div className="text-sm text-muted-foreground">
              Your engagement increased by 25% this week
            </div>
            <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
