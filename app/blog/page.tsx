/**
 * Blog List Page
 * Displays all blog posts in a grid layout with filtering
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostPreviews, getAllTags } from '@/lib/blog';
import BlogCard from './_components/BlogCard';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | LandingBits - Social Media Marketing Tips & Guides',
  description:
    'Expert insights on social media marketing, TikTok scheduling, content strategy, and automation. Learn how to grow your social media presence.',
  openGraph: {
    title: 'Blog | LandingBits',
    description:
      'Expert insights on social media marketing, TikTok scheduling, content strategy, and automation.',
    url: 'https://landingbits.net/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = getAllPostPreviews();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-5xl md:text-6xl font-bold">Blog</h1>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
            Expert insights on social media marketing, scheduling strategies, and
            content automation to grow your online presence.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Tags Filter (Optional - can be enhanced with client-side filtering) */}
        {tags.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Browse by topic:
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for fresh content!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination placeholder - can be enhanced with actual pagination */}
            {posts.length > 12 && (
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Load More Posts
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 mt-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to automate your social media?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators using LandingBits to schedule and optimize
            their content.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
