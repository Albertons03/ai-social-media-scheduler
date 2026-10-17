"use client";

import * as React from "react";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getOptimalTimes,
  getNextOptimalTime,
  formatOptimalTime,
} from "@/lib/utils/optimal-posting-times";
import { useRouter } from "next/navigation";
import { buildScheduleHref } from "@/lib/utils/schedule-prefill";

interface BestPostingTimesProps {
  className?: string;
}

export function BestPostingTimes({ className }: BestPostingTimesProps) {
  const router = useRouter();

  const platforms = ["twitter", "linkedin", "tiktok"] as const;
  const nextOptimalTimes = platforms.map((platform) => ({
    platform,
    nextTime: getNextOptimalTime(platform),
    color:
      platform === "twitter"
        ? "text-blue-600 dark:text-blue-400"
        : platform === "linkedin"
        ? "text-blue-700 dark:text-blue-300"
        : "text-pink-600 dark:text-pink-400",
  }));

  const handleScheduleForTime = (platform: string, date: Date) => {
    router.push(buildScheduleHref(platform, date, { openAI: "true" }));
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Best Times to Post
        </CardTitle>
        <CardDescription>
          General suggestions based on commonly cited posting windows — not
          personalized or predicted for your audience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextOptimalTimes.map(({ platform, nextTime, color }) => (
          <div
            key={platform}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-background shadow-sm ${color}`}>
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium capitalize">{platform}</p>
                <p className="text-sm text-muted-foreground">
                  {formatOptimalTime(nextTime)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleScheduleForTime(platform, nextTime)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          </div>
        ))}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Times shown in your local timezone. Static general suggestions, not data-driven predictions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
