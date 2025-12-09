"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarToolbarProps {
  currentDate: Date;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onToday} className="min-w-[100px]">
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <Select value={view} onValueChange={(v) => onViewChange(v as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
