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
      {/* Cover Image with gradient overlay */}
      <div className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-2xl group">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Title with gradient text */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Description with subtle styling */}
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
        {post.description}
      </p>

      {/* Colorful Metadata Bar */}
      <div className="flex flex-wrap items-center gap-6 pb-8 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 relative">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Author with color */}
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <User className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{post.author}</span>
        </div>

        {/* Date with color */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Calendar className="w-5 h-5 text-green-500" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        {/* Reading Time with color */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Clock className="w-5 h-5 text-orange-500" />
          <span>{post.readingTime}</span>
        </div>
      </div>

      {/* Colorful Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-6">
          {post.tags.map((tag, index) => {
            const colors = [
              "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25",
              "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25", 
              "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
              "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25",
              "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
            ];
            return (
              <span
                key={tag}
                className={`px-4 py-2 text-sm font-semibold rounded-full hover:scale-105 transition-transform duration-200 ${colors[index % colors.length]}`}
              >
                #{tag}
              </span>
            );
          })}
        </div>
      )}
    </header>
  );
}
