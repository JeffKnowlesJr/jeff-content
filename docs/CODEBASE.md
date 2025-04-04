# JKJR Digital Development Codebase

## Architecture Overview

This is a Next.js-based portfolio and blog website using a modern, component-based architecture. The project follows a multi-site architecture approach where this repository contains the Server-Side Rendered (SSR) portion, focusing on marketing, blog content, and public-facing pages.

## Key Technologies

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Content Rendering**: React Markdown with remark-gfm
- **Image Optimization**: Sharp + Next/Image
- **Content Management**: Local MDX/Markdown with future CMS integration planned

## Directory Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── blog/         # Blog pages and dynamic routes
│   ├── projects/     # Project pages and dynamic routes
│   └── ...           # Other app pages
├── components/        # React components
│   ├── blog/         # Blog-specific components
│   ├── common/       # Reusable UI components
│   ├── home/         # Home page components
│   ├── layout/       # Layout components
│   └── navigation/   # Navigation components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── services/         # API services
├── styles/          # Global styles
└── utils/           # Utility functions
    └── content-loader.ts  # Content management utilities

public/
├── content/         # Content assets
├── images/          # Optimized images
│   ├── blog/       # Blog post images
│   │   └── featured/  # Featured blog images
│   └── projects/   # Project images
└── JKJR3.{png,webp} # Logo files

content/             # Markdown content files
├── blog/           # Blog posts
└── projects/       # Project documentation

scripts/            # Build and utility scripts
```

## Content Management System

### Content Structure

The website uses a flexible content management system with Markdown files:

- **Blog Posts**: Stored as Markdown files in `content/blog/`
- **Projects**: Stored as Markdown files in `content/projects/`

### Content Interfaces

Content types are defined in `src/utils/content-loader.ts`:

```typescript
// Base content interface
interface BaseContent {
  slug: string
  title: string
  excerpt: string
  content: string
  status: string
  datePublished: string
  dateModified: string
}

// Blog post interface
export interface BlogPost extends BaseContent {
  id: string
  author: string
  tags: string[]
  readingTime: number | string
  featuredImage: string
  image?: string
  publishDate?: string
}

// Project interface
export interface Project extends BaseContent {
  id: string
  author: string
  tags: string[]
  readingTime: number | string
  featuredImage: string
  thumbnailImage: string
  contentImage: string
  projectType: string
  projectStatus: string
  githubUrl: string
  liveUrl: string
  techStack: string[]
}
```

### Content Loading

Content is loaded using utility functions in `src/utils/content-loader.ts`:

1. `getContentList<T>` - Loads all content items of a specific type
2. `getContentBySlug<T>` - Loads a specific content item by its slug
3. `importLegacyContent` - Imports content from legacy app (for migration)

These functions handle file system operations, Markdown parsing with front matter, and content filtering.

### Fallback Content

For both blog posts and projects, the application includes fallback content if no content files exist. This ensures the site always has content to display during development or before content is added.

## Page Structure

### Blog Pages

- **Blog List Page** (`src/app/blog/page.tsx`): Displays a grid of blog posts with featured images, excerpts, and metadata.
- **Blog Post Page** (`src/app/blog/[slug]/page.tsx`): Renders individual blog posts with full content, metadata, and sharing options.
- **Blog Sidebar**: Provides navigation and filtering options for blog posts.

### Project Pages

- **Project List Page** (`src/app/projects/page.tsx`): Displays a grid of projects with featured images, descriptions, and technology tags.
- **Project Detail Page** (`src/app/projects/[slug]/page.tsx`): Renders individual project details with full content, images, and technology information.

### Common Features

Both blog posts and projects share these features:

- Responsive card layouts
- Featured images with hover effects
- Tag display
- Metadata rendering (author, date, etc.)
- Markdown content rendering with ReactMarkdown
- Social sharing options

## Layout System

### Global Layout Coordination

The project implements a coordinated layout system with specific padding requirements that must be maintained across components:

- Header uses `px-6` padding
- Content areas use `px-4` padding
- This distinction provides visual hierarchy

Key files that must maintain padding coordination:

1. src/app/layout.tsx (px-4)
2. src/app/projects/layout.tsx (px-4)
3. src/app/blog/layout.tsx (px-4)

### Responsive Design

- Mobile-first approach
- Breakpoints:
  - md: 768px (Tablet)
  - lg: 1024px (Desktop)
  - xl: 1280px (Large Desktop)
- Max content width: max-w-7xl (1280px)
- Responsive grid layouts:
  - Blog: 1 column (mobile) → 2 columns (tablet+)
  - Projects: 1 column (mobile) → 2 columns (tablet+)

### Component Standards

1. **Documentation**:

   - Each component must include a documentation block
   - Cross-reference related components
   - Document padding/margin requirements

2. **Naming Conventions**:

   - PascalCase for component files and names
   - camelCase for utilities and hooks
   - kebab-case for CSS classes

3. **File Organization**:
   - One component per file
   - Group related components in feature directories
   - Shared components go in common/

## Image System

### Image Processing

- Automatic WebP conversion
- Responsive image sizes
- Lazy loading by default
- Priority loading for above-the-fold images

### Image Standards

- Blog featured images: 1200px wide
- Project images: 1200px wide
- Logo: 120x40px
- All images must have WebP format with fallback
- Required image paths:
  - Blog: `/images/blog/featured/{filename}.jpg`
  - Projects: `/images/projects/{filename}.jpg`

## Theme System

- Light/Dark mode support
- System preference detection
- Theme persistence
- Coordinated color palette:
  - Primary: Teal (teal-500)
  - Text: Gray scale
  - Backgrounds: White/Gray-900

## Development Workflow

1. **Local Development**:

   ```bash
   npm run dev
   ```

2. **Image Processing**:

   ```bash
   npm run process-images
   ```

3. **Build**:

   ```bash
   npm run build
   ```

4. **Content Creation**:

   ```bash
   # Create a new blog post
   npm run new:blog "My Blog Post Title"

   # Create a new project
   npm run new:project "My Project Title"
   ```

## Code Style

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Import ordering:
  1. React/Next.js imports
  2. Third-party libraries
  3. Internal modules
  4. Types/interfaces
  5. Styles

## Performance Considerations

1. **Image Optimization**:

   - WebP format with PNG/JPG fallbacks
   - Responsive sizes
   - Lazy loading

2. **Code Splitting**:

   - Route-based code splitting
   - Dynamic imports for heavy components
   - Prefetching for likely navigation

3. **Caching**:
   - Static page generation where possible
   - Revalidation strategies
   - Browser caching headers

## SEO Optimization

1. **Metadata**:

   - Each page has proper title and description
   - OpenGraph tags for social sharing
   - Structured data for blog posts and projects

2. **URL Structure**:

   - Clean, semantic URLs
   - Blog posts: `/blog/{slug}`
   - Projects: `/projects/{slug}`

3. **Performance Metrics**:
   - Core Web Vitals optimization
   - Fast load times
   - Minimal layout shift

## Security

1. **Content Security**:

   - Strict CSP headers
   - XSS prevention
   - CORS policies

2. **External Links**:
   - `rel="noopener noreferrer"`
   - `target="_blank"` handling
   - External URL validation

## Accessibility

1. **Standards**:

   - WCAG 2.1 compliance
   - Semantic HTML
   - ARIA labels where needed

2. **Features**:
   - Keyboard navigation
   - Screen reader support
   - Focus management
   - Color contrast compliance

## Future Considerations

1. **CMS Integration**:

   - Headless CMS planned
   - Content migration strategy
   - API integration

2. **Analytics**:

   - Performance monitoring
   - User behavior tracking
   - Error reporting

3. **Internationalization**:
   - i18n support structure
   - RTL layout support
   - Content translation workflow

## Contributing

1. Follow the established directory structure
2. Maintain padding coordination
3. Document all components
4. Process images using the provided script
5. Ensure accessibility compliance
6. Test in both light and dark modes
