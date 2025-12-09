"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CalendarEvent } from "./calendar-event";
import { motion } from "framer-motion";

interface Post {
  id: string;
  content: string;
  platform: "tiktok" | "linkedin" | "twitter";
  scheduled_for?: string | null;
}

interface CalendarGridProps {
  posts: Post[];
  onReorder: (posts: Post[]) => void;
}

export function CalendarGrid({ posts, onReorder }: CalendarGridProps) {
  const [items, setItems] = React.useState(posts);

  React.useEffect(() => {
    setItems(posts);
  }, [posts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
        return newItems;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No posts scheduled</p>
        <p className="text-sm text-muted-foreground">
          Create your first post to see it here
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {items.map((post) => (
            <CalendarEvent key={post.id} id={post.id} post={post} />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
