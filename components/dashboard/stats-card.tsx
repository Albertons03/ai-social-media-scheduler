"use client";

import * as React from "react";
import { Calendar, TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const iconMap = {
  calendar: Calendar,
  trending: TrendingUp,
  users: Users,
  file: FileText,
};

type IconName = keyof typeof iconMap;

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: IconName;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  index?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  index = 0,
}: StatsCardProps) {
  const Icon = iconMap[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden hover-lift elevation-2",
          "border-2 hover:border-primary/50 transition-all duration-300",
          "bg-gradient-to-br from-card via-card to-card/50",
          className
        )}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Icon className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
            </motion.div>
            {/* Glow effect on icon */}
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <motion.div
            className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            {value}
          </motion.div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend ? (
            <motion.div
              className="flex items-center mt-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                from last week
              </span>
            </motion.div>
          ) : (
            <div className="h-6 mt-2" />
          )}
        </CardContent>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
}
