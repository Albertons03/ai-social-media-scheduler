"use client";

import * as React from "react";
import { Plus, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const router = useRouter();
  const [ripple, setRipple] = React.useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);

  const handleCreateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, key: Date.now() });
    setTimeout(() => setRipple(null), 600);
    // Go to schedule page with AI chat open
    router.push("/schedule?openAI=true");
  };

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quick Actions
          <span>⚡</span>
        </CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="default"
            className={cn(
              "w-full justify-start relative overflow-hidden",
              "bg-gradient-to-r from-primary to-primary/80",
              "hover:from-primary/90 hover:to-primary/70",
              "transition-all duration-300 hover:scale-105 hover:shadow-lg"
            )}
            onClick={handleCreateClick}
          >
            {ripple && (
              <motion.span
                key={ripple.key}
                className="absolute rounded-full bg-white/30"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 0,
                  height: 0,
                }}
                animate={{
                  width: 300,
                  height: 300,
                  x: -150,
                  y: -150,
                  opacity: [1, 0],
                }}
                transition={{ duration: 0.6 }}
              />
            )}
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start group relative overflow-hidden",
              "hover:border-primary/50 hover:bg-primary/5",
              "transition-all duration-300 hover:scale-105"
            )}
            onClick={() => router.push("/schedule")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Calendar className="mr-2 h-4 w-4 relative z-10 group-hover:text-primary transition-colors" />
            <span className="relative z-10">View Calendar</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start group relative overflow-hidden",
              "hover:border-primary/50 hover:bg-primary/5",
              "transition-all duration-300 hover:scale-105"
            )}
            onClick={() => router.push("/schedule?openAI=true")} // Fixed: Go to schedule with AI chat open
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="mr-2 h-4 w-4 relative z-10 group-hover:text-purple-500 transition-colors" />
            <span className="relative z-10">AI Generator</span>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
