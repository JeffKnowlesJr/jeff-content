---
title: 'Debugging Project Links: A Technical Investigation'
slug: debug-project-links
datePublished: 2025-08-02
excerpt: 'A detailed investigation into project link routing issues and their resolution'
author: 'Compiled with assistance from AI'
sourceImageAsset: 'blog-debug-project-links.jpg'
tags: ['debugging', 'links', 'projects']
status: published
readingTime: 5
---

# Project Links Debug Investigation

## Issue

When clicking on project links (e.g., Project Omega), users are redirected to the projects list page (/projects) instead of the specific project detail page (/projects/project-omega-documentation).

## Project Structure Investigation

### 1. Content Files

- Project content files exist at: `content/projects/`
- Found files:
  - `project-omega-documentation.md`
  - `project-zero-documentation.md`
- The slug is properly defined in frontmatter: `slug: 'project-omega-documentation'`

### 2. Routing Architecture

- Next.js uses file-based routing at `src/app/projects/[slug]/page.tsx`
- Some components use React Router's `Link` from `react-router-dom`
- Components using router:
  - `src/components/projects/ProjectCard.tsx` - now uses Next.js `Link` (updated)
  - `src/components/projects/ProjectList.tsx` - uses React Router `Link`
  - `src/components/layout/ProjectSidebar.tsx` - uses React Router `Link`

### 3. Content Loading

- Content is loaded via `getContentBySlug` in `src/utils/content-loader.ts`
- Files are expected at `content/projects/[slug].md`
- The function looks correctly implemented:

  ```typescript
  export async function getContentBySlug<T>(
    type: ContentType,
    slug: string
  ): Promise<T | null> {
    const contentDir = path.join(process.cwd(), 'content', type)
    const filePath = path.join(contentDir, `${slug}.md`)

    try {
      if (!fs.existsSync(filePath)) {
        return null
      }

      // Read and parse content
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      // Return parsed content with slug
      return {
        ...data,
        content,
        slug
      } as T
    } catch (error) {
      console.error(`Error reading content: ${error}`)
      return null
    }
  }
  ```

## Dynamic Route Implementation

The dynamic route at `src/app/projects/[slug]/page.tsx` looks correct:

```typescript
export default async function ProjectDetailPage({ params }: PageProps) {
  // Get project from the slug
  const project = await getContentBySlug<Project>('projects', params.slug)

  // If not found, show 404
  if (!project) {
    notFound()
  }

  // Render project detail page
  // ...
}
```

Key observations:

1. The code correctly gets the slug from params
2. It calls getContentBySlug with 'projects' and the slug
3. It properly handles the not-found case

## Middleware Analysis

The application has a middleware file at `src/middleware.ts`, but it only affects admin routes:

```typescript
export const config = {
  matcher: ['/admin/:path*']
}
```

The middleware doesn't appear to affect project routes.

## Inconsistent Routing Libraries

The main issue appears to be the inconsistent use of routing libraries:

1. Some components use Next.js routing:

   ```typescript
   import Link from 'next/link'
   ;<Link href={`/projects/${slug}`}>...</Link>
   ```

2. Some components use React Router:
   ```typescript
   import { Link } from 'react-router-dom'
   ;<Link to={`/projects/${slug}`}>...</Link>
   ```

The dynamic routes are handled by Next.js, but some navigation components are using React Router, which isn't configured properly in this Next.js app.

## ROOT CAUSE FOUND: Next.js Dynamic Route Params Handling

After examining error logs, the root cause has been identified. In all dynamic routes, there's a Next.js specific error:

```
Error: Route "/projects/[slug]" used `params.slug`. `params` should be awaited before using its properties.
```

This appears in:

- `/projects/[slug]`
