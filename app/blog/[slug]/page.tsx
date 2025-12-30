/**
 * Individual Blog Post Page
 * Dynamic route for rendering individual blog posts with MDX content
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import {
  extractTableOfContents,
  generateBlogSeoMetadata,
  generateBlogJsonLd,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/blog-utils";
import BlogHeader from "../_components/BlogHeader";
import TableOfContents from "../_components/TableOfContents";
import RelatedPosts from "../_components/RelatedPosts";
import ShareButtons from "../_components/ShareButtons";
import { ArrowLeft } from "lucide-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// MDX Components - Customize how MDX elements render
const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"
      {...props}
    />
  ),
  img: (props: any) => (
    <img className="rounded-lg my-6 w-full" alt={props.alt || ""} {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      />
    </div>
  ),
  th: (props: any) => (
    <th
      className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
};

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | LandingBits",
    };
  }

  const seoMetadata = generateBlogSeoMetadata(post);

  return {
    title: seoMetadata.title,
    description: seoMetadata.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: seoMetadata.publishedTime,
      authors: [post.author],
      images: [
        {
          url: seoMetadata.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [seoMetadata.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Extract table of contents from content
  const tableOfContents = extractTableOfContents(post.content);

  // Get related posts
  const relatedPosts = getRelatedPosts(post.slug, post.tags);

  // Generate JSON-LD structured data
  const jsonLd = generateBlogJsonLd(post);
  const faqSchema = generateFAQSchema(post.content);
  const breadcrumbSchema = generateBreadcrumbSchema(post.slug, post.title);

  // Full URL for sharing
  const postUrl = `https://landingbits.com/blog/${post.slug}`;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* FAQ Schema if available */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Back to Blog Button */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <article className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Article Content */}
            <div className="min-w-0">
              {/* Blog Header */}
              <BlogHeader post={post} />

              {/* Share Buttons */}
              <div className="my-8">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* MDX Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20">
                <MDXRemote
                  source={post.content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeHighlight, rehypeSlug],
                    },
                  }}
                />
              </div>

              {/* Share Buttons Bottom */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Did you find this article helpful? Share it with your network!
                </p>
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="lg:block hidden">
              <TableOfContents headings={tableOfContents} />
            </aside>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to schedule your content?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start using LandingBits to automate your social media posting.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
