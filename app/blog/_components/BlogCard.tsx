/**
 * BlogCard Component
 * Displays a blog post preview card with image, title, excerpt, and metadata
 */

import Link from 'next/link';
import Image from 'next/image';
import { BlogPostPreview } from '@/lib/types/blog.types';
import { formatDate } from '@/lib/blog-utils';
import { Clock, Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPostPreview;
}

export default function BlogCard({ post }: BlogCardProps) {
  // Colorful tag variations
  const tagColors = [
    "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    "bg-gradient-to-r from-blue-500 to-cyan-500 text-white", 
    "bg-gradient-to-r from-green-500 to-teal-500 text-white",
    "bg-gradient-to-r from-orange-500 to-red-500 text-white",
    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
  ];

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-blue-500/50 transform hover:-translate-y-2">
      {/* Cover Image with Gradient Overlay */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Content with subtle gradient background */}
      <div className="p-6 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        {/* Colorful Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${tagColors[index % tagColors.length]} transform hover:scale-105 transition-transform duration-200`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title with gradient hover */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Metadata & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          {/* Read More Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1 group/link"
          >
            Read more
            <svg
              className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
