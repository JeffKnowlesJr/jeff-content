# JKJR Digital Development Routes Map

This document outlines the routing structure of the website, showing how URLs map to file paths and which components are used in each route.

## Next.js App Router Structure

The application uses Next.js App Router, where routes are defined by folder structure in the `src/app` directory. Each folder represents a route segment, and a `page.tsx` file inside a folder creates a UI for that route.

## Main Routes

| URL Path                    | File Path                                   | Description            | Key Components                    |
| --------------------------- | ------------------------------------------- | ---------------------- | --------------------------------- |
| `/`                         | `src/app/page.tsx`                          | Home page              | Hero, EnhancedBackgroundAnimation |
| `/blog`                     | `src/app/blog/page.tsx`                     | Blog listing page      | BlogLayout, BlogPostList          |
| `/blog/[slug]`              | `src/app/blog/[slug]/page.tsx`              | Individual blog post   | BlogLayout, SocialShare           |
| `/blog/category/[category]` | `src/app/blog/category/[category]/page.tsx` | Blog posts by category | BlogLayout, BlogPostList          |
| `/projects`                 | `src/app/projects/page.tsx`                 | Projects listing page  | ProjectList, ProjectCard          |
| `/projects/[slug]`          | `src/app/projects/[slug]/page.tsx`          | Individual project     | ProjectLayout                     |
| `/contact`                  | `src/app/contact/page.tsx`                  | Contact page           | ContactForm                       |
| `/dev-log`                  | `src/app/dev-log/page.tsx`                  | Development log        | BlogLayout                        |
| `/resources`                | `src/app/resources/page.tsx`                | Resources page         | ResourceList                      |
| `/sitemap`                  | `src/app/sitemap/page.tsx`                  | Sitemap page           | -                                 |

## Layout Structure

Next.js uses nested layouts that apply to specific route segments:

| Layout          | File Path                     | Applies To           | Description               |
| --------------- | ----------------------------- | -------------------- | ------------------------- |
| Root Layout     | `src/app/layout.tsx`          | All routes           | Header, Footer, ThemedApp |
| Blog Layout     | `src/app/blog/layout.tsx`     | `/blog/*` routes     | BlogSidebar               |
| Projects Layout | `src/app/projects/layout.tsx` | `/projects/*` routes | ProjectSidebar            |

## Component Relationships

### Page Components

- `page.tsx` - The main component that renders at each route
- `layout.tsx` - Wraps pages with shared UI
- `loading.tsx` - Shown during page loading
- `not-found.tsx` - Shown when content isn't found

### Project Components

- `src/components/projects/ProjectCard.tsx` - Card component for project listings
- `src/components/projects/ProjectList.tsx` - Grid of project cards
- `src/components/projects/ExternalLink.tsx` - External link with proper attributes
- `src/components/projects/SocialShare.tsx` - Social sharing buttons

### Layout Components

- `src/components/layout/ProjectLayout.tsx` - Layout for project detail pages
- `src/components/layouts/ProjectLayout.tsx` - Layout for project listing pages (legacy)

## File to URL Mapping

Each route in Next.js App Router maps directly to a URL path:

```
src/app/                     → /
src/app/blog/                → /blog
src/app/blog/[slug]/         → /blog/{post-slug}
src/app/projects/            → /projects
src/app/projects/[slug]/     → /projects/{project-slug}
src/app/contact/             → /contact
```

## Dynamic Routes

The application uses dynamic routes for content:

- `/blog/[slug]` - Each blog post uses its slug in the URL
- `/projects/[slug]` - Each project uses its slug in the URL
- `/blog/category/[category]` - Blog category pages

## Legacy vs Current Routes

It appears your application has a mix of Next.js and a legacy React application structure. Here's how they relate:

- **Next.js App Router** (current): Uses file-system based routing in `src/app/`
- **Legacy App Structure**: Uses explicit route definitions in router configuration

## Important Notes for Development

1. **Component Location**: There are components in `src/components/layout/ProjectLayout.tsx` and in `src/components/layouts/ProjectLayout.tsx` - these may cause confusion.

2. **Route Parameters**: Dynamic segments (like `[slug]`) are accessible as props in page components.

3. **Layout Nesting**: Layouts are automatically nested in the App Router - the root layout applies to all pages, then specific layouts apply to their route segments.

4. **Width Issues**: If you're having issues with the project page width, make sure you're editing the correct layout component:

   - Check if `src/app/projects/layout.tsx` exists (this would be the primary layout to modify)
   - Otherwise, check which layout component is imported in `src/app/projects/page.tsx`

5. **Authentication**: Any protected routes would require additional authentication middleware.

6. **Shared Components**: Common components like Header and Footer are included in the root layout and applied to all pages.
