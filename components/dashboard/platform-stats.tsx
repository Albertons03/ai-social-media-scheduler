"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getPlatformClasses } from "@/lib/utils/platform-colors";

interface PlatformStatsProps {
  stats: {
    tiktok: number;
    linkedin: number;
    twitter: number;
  };
}

const platforms = [
  { name: "TikTok", key: "tiktok" as const, emoji: "🎵" },
  { name: "LinkedIn", key: "linkedin" as const, emoji: "💼" },
  { name: "X (Twitter)", key: "twitter" as const, emoji: "🐦" },
];

export function PlatformStats({ stats }: PlatformStatsProps) {
  const total = stats.tiktok + stats.linkedin + stats.twitter;
  const [animatedPercentages, setAnimatedPercentages] = React.useState<Record<string, number>>({
    tiktok: 0,
    linkedin: 0,
    twitter: 0,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentages({
        tiktok: total > 0 ? (stats.tiktok / total) * 100 : 0,
        linkedin: total > 0 ? (stats.linkedin / total) * 100 : 0,
        twitter: total > 0 ? (stats.twitter / total) * 100 : 0,
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [stats, total]);

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Posts by Platform
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            📊
          </motion.div>
        </CardTitle>
        <CardDescription>Distribution of your scheduled posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {platforms.map((platform, index) => {
            const count = stats[platform.key];
            const percentage = animatedPercentages[platform.key];
            const platformClasses = getPlatformClasses(platform.key);

            return (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {platform.emoji}
                    </motion.span>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {platform.name}
                    </span>
                  </div>
                  <motion.span
                    className={cn("text-muted-foreground font-semibold", platformClasses.text)}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {count} ({percentage.toFixed(0)}%)
                  </motion.span>
                </div>

                {/* Progress bar container */}
                <div className="relative">
                  <div
                    className={cn(
                      "h-3 rounded-full overflow-hidden",
                      "border-2 shadow-inner",
                      platformClasses.bgLight,
                      platformClasses.border
                    )}
                  >
                    {/* Animated progress bar */}
                    <motion.div
                      className={cn(
                        "h-full relative overflow-hidden",
                        platformClasses.bg,
                        "shadow-lg"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>

                  {/* Glow effect on hover */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity",
                      platformClasses.bg
                    )}
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
