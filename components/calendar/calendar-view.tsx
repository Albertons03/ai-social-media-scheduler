'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/lib/types/database.types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarViewProps {
  posts: Post[];
  onDateClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
}

export function CalendarView({ posts, onDateClick, onPostClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array of day cells including empty cells for alignment
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (!post.scheduled_for) return false;
      return isSameDay(new Date(post.scheduled_for), date);
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-pink-500';
      case 'linkedin':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      default:
        return 'bg-background0';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-24" />;
          }

          const postsOnDay = getPostsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              className={`
                h-24 border border-border rounded-lg p-2 cursor-pointer transition-colors
                ${isCurrentMonth ? 'bg-white hover:bg-background' : 'bg-background text-muted-foreground'}
                ${isToday ? 'ring-2 ring-blue-600' : ''}
              `}
              onClick={() => onDateClick?.(day)}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`
                    text-sm font-medium mb-1
                    ${isToday ? 'text-blue-600 font-bold' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {/* Posts on this day */}
                <div className="flex-1 overflow-y-auto space-y-1">
                  {postsOnDay.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPostClick?.(post);
                      }}
                      className={`
                        text-xs px-2 py-1 rounded truncate cursor-pointer
                        ${getPlatformColor(post.platform)} text-white
                        hover:opacity-80
                      `}
                    >
                      {post.content.substring(0, 20)}...
                    </div>
                  ))}
                  {postsOnDay.length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{postsOnDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded" />
          <span>TikTok</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span>LinkedIn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sky-500 rounded" />
          <span>Twitter</span>
        </div>
      </div>
    </div>
  );
}
