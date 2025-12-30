/**
 * Blog Utilities
 * Helper functions for reading time, TOC extraction, SEO metadata, etc.
 */

import { TocHeading, BlogSeoMetadata, BlogPost } from "./types/blog.types";

/**
 * Extract table of contents from MDX content
 * Parses H2 and H3 headings to create a navigable TOC
 * @param content - Raw MDX content
 * @returns Array of TocHeading objects
 */
export function extractTableOfContents(content: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // 2 for ##, 3 for ###
    const text = match[2].trim();

    // Create slug-friendly ID from heading text
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

/**
 * Format date for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param format - Date format style
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  format: "long" | "short" = "long"
): string {
  const date = new Date(dateString);

  if (format === "long") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate relative time from now
 * @param dateString - ISO date string
 * @returns Relative time string (e.g., "2 days ago", "3 months ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

  return `${Math.floor(diffInDays / 365)} years ago`;
}

/**
 * Generate SEO metadata for a blog post
 * @param post - Blog post object
 * @param baseUrl - Base URL of the site (e.g., "https://landingbits.net")
 * @returns SEO metadata object
 */
export function generateBlogSeoMetadata(
  post: BlogPost,
  baseUrl: string = "https://landingbits.net"
): BlogSeoMetadata {
  const canonical = `${baseUrl}/blog/${post.slug}`;
  const ogImage = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${baseUrl}${post.coverImage}`;

  return {
    title: `${post.title} | LandingBits Blog`,
    description: post.description,
    canonical,
    ogImage,
    publishedTime: new Date(post.date).toISOString(),
    author: post.author,
    tags: post.tags,
  };
}

/**
 * Generate FAQ structured data from content
 * @param content - Blog post content to extract FAQs from
 * @returns FAQ JSON-LD object or null if no FAQs found
 */
export function generateFAQSchema(content: string) {
  // Extract FAQ sections (h3 questions followed by content)
  const faqRegex = /^### (.+\?)\s*\n([^#]+?)(?=\n#|$)/gm;
  const faqs = [];

  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, " ");

    if (question && answer) {
      faqs.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      });
    }
  }

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs,
  };
}

/**
 * Generate breadcrumb structured data
 * @param slug - Blog post slug
 * @param title - Blog post title
 * @param baseUrl - Base URL of the site
 * @returns Breadcrumb JSON-LD object
 */
export function generateBreadcrumbSchema(
  slug: string,
  title: string,
  baseUrl: string = "https://landingbits.net"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };
}

/**
 * Generate JSON-LD structured data for blog posts
 * Enhanced with better schema markup
 * @param post - Blog post object
 * @param baseUrl - Base URL of the site
 * @returns JSON-LD structured data object
 */
export function generateBlogJsonLd(
  post: BlogPost,
  baseUrl: string = "https://landingbits.net"
) {
  const canonical = `${baseUrl}/blog/${post.slug}`;
  const ogImage = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${baseUrl}${post.coverImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Organization",
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "LandingBits",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    keywords: post.tags.join(", "),
    wordCount: getWordCount(post.content),
    articleSection: "Social Media Marketing",
    about: {
      "@type": "Thing",
      name: "Social Media Scheduling",
    },
  };
}

/**
 * Estimate word count from MDX content
 * @param content - Raw MDX content
 * @returns Word count
 */
export function getWordCount(content: string): number {
  // Remove frontmatter, code blocks, and markdown syntax
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Keep link text only
    .replace(/[#*_~]/g, ""); // Remove markdown formatting

  const words = cleanContent.trim().split(/\s+/);
  return words.filter((word) => word.length > 0).length;
}

/**
 * Create excerpt from content
 * @param content - Raw MDX content
 * @param maxLength - Maximum excerpt length (default: 200)
 * @returns Excerpt string
 */
export function createExcerpt(
  content: string,
  maxLength: number = 200
): string {
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/#{1,6}\s/g, "") // Remove headings
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Keep link text only
    .replace(/[*_~`]/g, "") // Remove markdown formatting
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  return cleanContent.slice(0, maxLength).trim() + "...";
}

/**
 * Generate share URLs for social media
 * @param url - Blog post URL
 * @param title - Blog post title
 * @returns Object with social media share URLs
 */
export function generateShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}

/**
 * Sanitize tag for URL use
 * @param tag - Tag string
 * @returns URL-safe tag string
 */
export function sanitizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Parse tag from URL parameter
 * @param tagParam - URL parameter value
 * @returns Original tag string
 */
export function parseTagParam(tagParam: string): string {
  return tagParam.replace(/-/g, " ");
}
