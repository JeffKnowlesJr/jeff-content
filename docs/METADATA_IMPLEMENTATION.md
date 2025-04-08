# Metadata Implementation

This document outlines the implementation of metadata across the website, including OpenGraph, Twitter cards, and canonical URLs.

## Overview

Proper metadata is crucial for SEO, social sharing, and establishing the website's identity across the web. Our implementation uses Next.js 13's Metadata API with custom utilities for consistency across all pages.

## Implementation Architecture

### Core Utilities

The metadata system is built around the `src/utils/metadata.ts` file, which contains utility functions for generating consistent metadata across the site:

- `generateBaseMetadata()`: Creates base metadata for the entire site
- `generateBlogPostMetadata()`: Creates metadata for individual blog posts
- `generateBlogIndexMetadata()`: Creates metadata for the main blog listing page
- `generateProjectMetadata()`: Creates metadata for individual projects
- `generateProjectsIndexMetadata()`: Creates metadata for the projects listing page
- `generateCategoryMetadata()`: Creates metadata for blog category pages
- `generateTagMetadata()`: Creates metadata for blog tag pages

### Integration Points

Metadata is applied at multiple levels throughout the application:

1. **Root Level**

   - Location: `src/app/layout.tsx`
   - Purpose: Establishes base site-wide metadata
   - Implementation: Uses `generateBaseMetadata()`

2. **Blog Pages**

   - Individual Posts: `src/app/blog/[slug]/page.tsx`
   - Blog Index: `src/app/blog/page.tsx`
   - Categories: `src/app/blog/category/[category]/page.tsx`
   - Tags: `src/app/blog/tag/[tag]/page.tsx`
   - Search: `src/app/blog/search/page.tsx`

3. **Project Pages**
   - Individual Projects: `src/app/projects/[slug]/page.tsx`
   - Projects Index: `src/app/projects/page.tsx`

### Metadata Types Included

All pages include the following metadata:

- **Basic Metadata**

  - Title
  - Description
  - Keywords (where applicable)
  - Authors

- **OpenGraph Metadata**

  - Title
  - Description
  - Image
  - Type (article/website)
  - URL
  - Published/Modified times (for content)

- **Twitter Card Metadata**

  - Card type
  - Title
  - Description
  - Image
  - Creator/Site handles

- **Canonical URLs**
  - Proper canonical URL for each page to avoid duplicate content issues

## Example Implementation

Here's an example of how metadata is implemented in a blog post page:

```typescript
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const post = await getContentBySlug<BlogPost>('blog', params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return generateBlogPostMetadata(post)
}
```

The utility function handles all the complex metadata generation:

```typescript
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const postUrl = `${BASE_URL}/blog/${post.slug}`
  const imageUrl = post.featuredImage || post.image || '/images/og-default.jpg'
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${BASE_URL}${imageUrl}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.datePublished || post.publishDate,
      modifiedTime: post.dateModified || post.datePublished || post.publishDate,
      authors: [
        typeof post.author === 'string' ? post.author : 'Jeff Knowles Jr'
      ],
      tags: post.tags,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: post.title,
      description: post.excerpt,
      images: [fullImageUrl]
    },
    alternates: {
      canonical: postUrl
    }
  }
}
```

## Fallback Strategies

Our implementation includes fallback strategies for images and other content:

1. **Images**: We attempt to use content-specific images, then fallback to default images
2. **Dates**: We check multiple date fields (datePublished, publishDate) to ensure consistency
3. **Authors**: Uses specific post author if available, otherwise defaults to site author

## Best Practices Implemented

The metadata implementation follows these best practices:

1. **Consistency**: Common structure and formatting across all pages
2. **Completeness**: All required metadata fields are included for each page type
3. **Specificity**: Each page has unique, descriptive metadata
4. **Fallbacks**: Graceful degradation when specific fields are missing
5. **Canonical URLs**: Properly formed canonical URLs to prevent duplicate content issues
6. **Image Sizing**: Optimized image dimensions for social sharing

## Testing the Implementation

To test the metadata implementation:

1. **Validation Tools**:

   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Rich Results Test](https://search.google.com/test/rich-results)

2. **Manual Inspection**:
   - View page source to check metadata
   - Use browser dev tools to inspect metadata
   - Test social media sharing

## Relationship to Structured Data

The metadata system complements our JSON-LD structured data implementation (see `docs/SEO_STRUCTURED_DATA.md`). While metadata focuses on page identification and social sharing, structured data provides deeper semantic meaning for search engines.
