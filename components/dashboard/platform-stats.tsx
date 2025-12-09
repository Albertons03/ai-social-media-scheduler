import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlatformStatsProps {
  stats: {
    tiktok: number;
    linkedin: number;
    twitter: number;
  };
}

const platforms = [
  {
    name: "TikTok",
    key: "tiktok" as const,
    color: "bg-[#FE2C55]",
    lightColor: "bg-[#FE2C55]/10",
  },
  {
    name: "LinkedIn",
    key: "linkedin" as const,
    color: "bg-[#0077B5]",
    lightColor: "bg-[#0077B5]/10",
  },
  {
    name: "X (Twitter)",
    key: "twitter" as const,
    color: "bg-black dark:bg-white",
    lightColor: "bg-black/10 dark:bg-white/10",
  },
];

export function PlatformStats({ stats }: PlatformStatsProps) {
  const total = stats.tiktok + stats.linkedin + stats.twitter;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts by Platform</CardTitle>
        <CardDescription>Distribution of your scheduled posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform) => {
            const count = stats[platform.key];
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={platform.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{platform.name}</span>
                  <span className="text-muted-foreground">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className={cn("h-2 rounded-full overflow-hidden", platform.lightColor)}>
                  <div
                    className={cn("h-full transition-all duration-500", platform.color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
