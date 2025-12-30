/**
 * RelatedPosts Component
 * Displays 3 related blog posts based on shared tags
 */

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types/blog.types';
import { formatDate } from '@/lib/blog-utils';
import { Clock } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
      {/* Section Header */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Related Articles
      </h2>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Cover Image */}
            <Link
              href={`/blog/${post.slug}`}
              className="block relative aspect-video overflow-hidden"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>

            {/* Content */}
            <div className="p-5">
              {/* Title */}
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {post.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
