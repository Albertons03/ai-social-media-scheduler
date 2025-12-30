/**
 * BlogHeader Component
 * Displays blog post header with title, metadata, and cover image
 */

import Image from 'next/image';
import { BlogPost } from '@/lib/types/blog.types';
import { formatDate } from '@/lib/blog-utils';
import { Clock, Calendar, User } from 'lucide-react';

interface BlogHeaderProps {
  post: BlogPost;
}

export default function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <header className="mb-12">
      {/* Cover Image */}
      <div className="relative w-full aspect-[21/9] mb-8 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        {post.description}
      </p>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
        {/* Author */}
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <User className="w-5 h-5" />
          <span className="font-medium">{post.author}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-5 h-5" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-5 h-5" />
          <span>{post.readingTime}</span>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
