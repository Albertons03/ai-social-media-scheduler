/**
 * Blog Post Types
 * TypeScript type definitions for the blog system
 */

/**
 * Blog post frontmatter metadata from MDX files
 */
export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  author: string;
  tags: string[];
  coverImage: string; // Path to cover image
  published?: boolean; // Optional: hide draft posts
}

/**
 * Complete blog post with content and metadata
 */
export interface BlogPost extends BlogFrontmatter {
  slug: string; // URL-friendly identifier
  content: string; // Raw MDX content
  readingTime: string; // Calculated reading time (e.g., "5 min read")
}

/**
 * Blog post preview for list pages (without full content)
 */
export interface BlogPostPreview extends Omit<BlogPost, 'content'> {
  excerpt: string; // First 200 characters or custom excerpt
}

/**
 * Table of contents heading item
 */
export interface TocHeading {
  id: string; // Heading anchor ID
  text: string; // Heading text content
  level: number; // Heading level (2 for h2, 3 for h3)
}

/**
 * Related post metadata (minimal info for related posts section)
 */
export interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  readingTime: string;
}

/**
 * SEO metadata for blog posts
 */
export interface BlogSeoMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags: string[];
}
