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
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CalendarEvent } from "./calendar-event";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeId, setActiveId] = React.useState<string | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

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

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activePost = activeId ? items.find((post) => post.id === activeId) : null;

  if (items.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          📅
        </motion.div>
        <p className="text-muted-foreground mb-2 font-medium">No posts scheduled</p>
        <p className="text-sm text-muted-foreground">
          Create your first post to see it here
        </p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence>
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <CalendarEvent id={post.id} post={post} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </SortableContext>

      {/* Drag Overlay with enhanced styling */}
      <DragOverlay dropAnimation={null}>
        {activePost ? (
          <motion.div
            initial={{ scale: 1.05, rotate: 2 }}
            animate={{ scale: 1.08, rotate: -2 }}
            transition={{ duration: 0.2 }}
            className="cursor-grabbing"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-primary/30 blur-2xl rounded-lg" />
              {/* Content */}
              <div className="relative">
                <CalendarEvent id={activePost.id} post={activePost} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
