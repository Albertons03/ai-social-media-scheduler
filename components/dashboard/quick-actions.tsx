"use client";

import * as React from "react";
import { Plus, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        <Button
          variant="default"
          className="w-full justify-start"
          onClick={() => router.push("/dashboard?action=create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/schedule")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/dashboard?action=ai")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          AI Generator
        </Button>
      </CardContent>
    </Card>
  );
}
