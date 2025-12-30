# Blog System Documentation

Complete MDX-based blog system for Next.js 14+ with SEO optimization, syntax highlighting, and AI-ready features.

## 📁 Project Structure

```
app/
├── blog/
│   ├── page.tsx                    # Blog list page (/blog)
│   ├── [slug]/
│   │   └── page.tsx                # Individual blog post (/blog/[slug])
│   └── _components/
│       ├── BlogCard.tsx            # Blog post preview card
│       ├── BlogHeader.tsx          # Post header with metadata
│       ├── TableOfContents.tsx     # Auto-generated TOC
│       ├── RelatedPosts.tsx        # Related articles section
│       └── ShareButtons.tsx        # Social sharing buttons
├── sitemap.ts                      # Dynamic sitemap generation
└── robots.ts                       # Search engine directives

lib/
├── blog.ts                         # Core blog utilities
├── blog-utils.ts                   # Helper functions
└── types/
    └── blog.types.ts               # TypeScript definitions

content/
└── posts/                          # MDX blog posts
    ├── best-tiktok-schedulers-2025.mdx
    └── social-media-scheduling-best-practices.mdx
```

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install next-mdx-remote gray-matter reading-time rehype-highlight rehype-slug remark-gfm
```

### 2. Add Syntax Highlighting CSS

Add to your global CSS (`app/globals.css`):

```css
/* Syntax Highlighting for Code Blocks */
@import 'highlight.js/styles/github-dark.css';
```

Or choose a different theme from: https://highlightjs.org/demo

### 3. Create Your First Blog Post

Create a new MDX file in `content/posts/`:

```mdx
---
title: "Your Post Title"
description: "A compelling description for SEO"
date: "2025-01-20"
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
coverImage: "/blog/your-image.jpg"
published: true
---

Your content here...

## Heading 2

Your content with **markdown** formatting.

### Heading 3

More content...
```

### 4. Add Cover Images

Place blog cover images in `public/blog/`:

```
public/
└── blog/
    ├── tiktok-schedulers.jpg
    ├── social-media-scheduling.jpg
    └── your-image.jpg
```

Recommended image specs:
- **Resolution**: 1200x630px (optimal for social sharing)
- **Format**: JPG or PNG
- **File size**: < 500KB for fast loading

### 5. Test Your Blog

Run the development server:

```bash
npm run dev
```

Visit:
- Blog list: http://localhost:3000/blog
- Example post: http://localhost:3000/blog/best-tiktok-schedulers-2025

## ✨ Features

### MDX Support

Write blog posts in MDX with full Markdown support plus React components:

```mdx
## Standard Markdown

- Bullet lists
- **Bold** and *italic* text
- [Links](https://example.com)
- `inline code`

### Code Blocks with Syntax Highlighting

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Tables

| Feature | Supported |
|---------|-----------|
| Tables  | ✅        |
| Images  | ✅        |
```

### SEO Optimization

Automatic SEO features:
- ✅ Dynamic meta tags (title, description, OG tags)
- ✅ JSON-LD structured data (BlogPosting schema)
- ✅ Canonical URLs
- ✅ Automatic sitemap generation
- ✅ robots.txt configuration
- ✅ Social media preview cards

### Reading Time

Automatically calculated from word count (average reading speed: 200 words/minute).

### Table of Contents

Auto-generated from H2 and H3 headings with:
- Active section highlighting
- Smooth scrolling
- Sticky positioning on desktop

### Related Posts

Algorithm finds related articles based on:
1. Shared tags (highest priority)
2. Publish date (secondary sort)
3. Displays top 3 related posts

### Social Sharing

One-click sharing to:
- Twitter/X
- LinkedIn
- Facebook
- Copy link to clipboard

## 📝 Writing Guide

### Frontmatter Fields

Required fields:
- `title`: Post title (50-60 characters ideal for SEO)
- `description`: Meta description (150-160 characters)
- `date`: Publication date (YYYY-MM-DD format)
- `author`: Author name
- `tags`: Array of tags (3-5 tags recommended)
- `coverImage`: Path to cover image

Optional fields:
- `published`: Set to `false` to hide drafts (defaults to `true`)

### Markdown Formatting

#### Headings

```mdx
# H1 - Only use in frontmatter title
## H2 - Main sections (appear in TOC)
### H3 - Subsections (appear in TOC)
#### H4 - Minor sections
```

#### Code Blocks

Specify language for syntax highlighting:

\`\`\`javascript
// JavaScript code
const example = true;
\`\`\`

\`\`\`python
# Python code
def hello_world():
    print("Hello!")
\`\`\`

\`\`\`bash
# Bash commands
npm install package-name
\`\`\`

#### Images

```mdx
![Alt text](/blog/image.jpg)
```

#### Links

```mdx
[Link text](https://example.com)
```

#### Lists

```mdx
- Unordered list
- Another item
  - Nested item

1. Ordered list
2. Second item
3. Third item
```

#### Blockquotes

```mdx
> This is a blockquote
> Multiple lines work too
```

#### Tables

```mdx
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |
```

## 🎨 Customization

### Styling

Blog components use Tailwind CSS. Customize in:
- `app/blog/_components/*.tsx` - Individual components
- `app/blog/[slug]/page.tsx` - MDX component styling

### MDX Components

Customize how MDX elements render in `app/blog/[slug]/page.tsx`:

```typescript
const mdxComponents = {
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  // Add more custom components...
};
```

### Color Scheme

Blog supports dark mode automatically. Customize colors with Tailwind:

```typescript
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

## 📊 Analytics Integration

### Track Blog Performance

Add analytics tracking in `app/blog/[slug]/page.tsx`:

```typescript
// Example: Google Analytics
useEffect(() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: `/blog/${post.slug}`,
      page_title: post.title,
    });
  }
}, [post.slug, post.title]);
```

### Measure Reading Time

Reading time is automatically calculated and displayed. Track actual read time:

```typescript
useEffect(() => {
  const startTime = Date.now();

  return () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    // Send to analytics
  };
}, []);
```

## 🔧 Advanced Configuration

### Custom Post Sorting

Modify in `lib/blog.ts`:

```typescript
export function getAllPosts(): BlogPost[] {
  // Custom sorting logic
  return posts.sort((a, b) => {
    // Example: Sort by views instead of date
    return b.views - a.views;
  });
}
```

### Tag Filtering

Implement client-side tag filtering:

```typescript
// app/blog/page.tsx
const [selectedTag, setSelectedTag] = useState<string | null>(null);

const filteredPosts = selectedTag
  ? posts.filter(post => post.tags.includes(selectedTag))
  : posts;
```

### Pagination

Add pagination to blog list:

```typescript
const POSTS_PER_PAGE = 12;
const [page, setPage] = useState(1);

const paginatedPosts = posts.slice(
  (page - 1) * POSTS_PER_PAGE,
  page * POSTS_PER_PAGE
);
```

### Search Functionality

Add search with simple filtering:

```typescript
const [searchQuery, setSearchQuery] = useState('');

const searchedPosts = posts.filter(post =>
  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.description.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Verify Sitemap

After deployment, check:
- https://landingbits.net/sitemap.xml
- https://landingbits.net/robots.txt

### Submit to Search Engines

1. **Google Search Console**
   - Submit sitemap: https://landingbits.net/sitemap.xml
   - Request indexing for key blog posts

2. **Bing Webmaster Tools**
   - Submit sitemap
   - Enable URL inspection

## 📈 SEO Best Practices

### Content Guidelines

- **Title**: 50-60 characters, include target keyword
- **Description**: 150-160 characters, compelling preview
- **Headings**: Use H2/H3 hierarchy, include keywords
- **Word Count**: Aim for 1500+ words for comprehensive posts
- **Images**: Always include alt text
- **Internal Links**: Link to related posts
- **External Links**: Link to authoritative sources

### Technical SEO

- ✅ Mobile-responsive design
- ✅ Fast page load times (< 3 seconds)
- ✅ Semantic HTML structure
- ✅ Structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ XML sitemap

### Performance

- Images auto-optimized with Next.js Image component
- MDX content statically generated at build time
- Lazy loading for images
- Code splitting for components

## 🐛 Troubleshooting

### Posts Not Appearing

1. Check file is in `content/posts/` directory
2. Verify `.mdx` file extension
3. Ensure frontmatter is valid YAML
4. Check `published: true` in frontmatter
5. Restart dev server

### Syntax Highlighting Not Working

1. Verify `highlight.js` CSS is imported in `globals.css`
2. Check code block has language specified:
   ```
   \`\`\`javascript
   // code here
   \`\`\`
   ```

### Table of Contents Empty

1. Ensure headings use `##` or `###` (not `#`)
2. Check headings have actual text content
3. Verify content is being parsed correctly

### Images Not Loading

1. Check image path starts with `/blog/`
2. Verify file exists in `public/blog/` directory
3. Check file name matches exactly (case-sensitive)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Highlight.js Themes](https://highlightjs.org/demo)

## 🤝 Contributing

To add features to the blog system:

1. Create new components in `app/blog/_components/`
2. Add utilities in `lib/blog-utils.ts`
3. Update types in `lib/types/blog.types.ts`
4. Document changes in this file

## 📄 License

This blog system is part of the LandingBits project.
