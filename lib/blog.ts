/**
 * Blog System Core Utilities
 * Handles MDX file processing, post retrieval, and content parsing
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost, BlogPostPreview, BlogFrontmatter } from './types/blog.types';

// Directory where blog posts are stored
const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

/**
 * Ensure posts directory exists
 */
function ensurePostsDirectory(): void {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
  }
}

/**
 * Get all blog post slugs (filenames without .mdx extension)
 */
export function getAllPostSlugs(): string[] {
  ensurePostsDirectory();

  const files = fs.readdirSync(POSTS_DIRECTORY);

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get a single blog post by slug
 * @param slug - URL-friendly post identifier
 * @returns BlogPost with full content and metadata
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    ensurePostsDirectory();

    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Calculate reading time
    const stats = readingTime(content);

    // Validate frontmatter
    const frontmatter = data as BlogFrontmatter;

    if (!frontmatter.title || !frontmatter.description || !frontmatter.date) {
      console.warn(`Invalid frontmatter for post: ${slug}`);
      return null;
    }

    // Skip unpublished posts in production
    if (process.env.NODE_ENV === 'production' && frontmatter.published === false) {
      return null;
    }

    return {
      slug,
      ...frontmatter,
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 * @returns Array of BlogPost objects
 */
export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      // Sort by date descending (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

/**
 * Get blog post previews (without full content) for list pages
 * @param limit - Optional limit on number of posts
 * @returns Array of BlogPostPreview objects
 */
export function getAllPostPreviews(limit?: number): BlogPostPreview[] {
  const posts = getAllPosts();

  const previews = posts.map((post) => {
    // Create excerpt from first 200 characters of content
    const excerpt = post.content
      .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
      .replace(/#{1,6}\s/g, '') // Remove markdown headings
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .replace(/[*_~`]/g, '') // Remove markdown formatting
      .trim()
      .slice(0, 200) + '...';

    const { content, ...preview } = post;

    return {
      ...preview,
      excerpt,
    };
  });

  return limit ? previews.slice(0, limit) : previews;
}

/**
 * Get posts filtered by tag
 * @param tag - Tag to filter by
 * @returns Array of BlogPost objects with matching tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();

  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags from all posts
 * @returns Array of unique tags sorted alphabetically
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();

  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get related posts based on shared tags
 * @param currentSlug - Slug of current post (to exclude from results)
 * @param tags - Tags to match against
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related BlogPost objects
 */
export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit: number = 3
): BlogPost[] {
  const allPosts = getAllPosts();

  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

  // Calculate relevance score for each post based on shared tags
  const postsWithScore = otherPosts.map((post) => {
    const sharedTags = post.tags.filter((tag) =>
      tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );

    return {
      post,
      score: sharedTags.length,
    };
  });

  // Sort by score (most shared tags first), then by date
  const sortedPosts = postsWithScore
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .filter((item) => item.score > 0) // Only include posts with at least 1 shared tag
    .map((item) => item.post);

  return sortedPosts.slice(0, limit);
}

/**
 * Get the next and previous posts for navigation
 * @param currentSlug - Slug of current post
 * @returns Object with next and previous posts (or null)
 */
export function getAdjacentPosts(currentSlug: string): {
  previous: BlogPost | null;
  next: BlogPost | null;
} {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}
