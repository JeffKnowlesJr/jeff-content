# Jeff Knowles Jr Website Architecture

This document provides an overview of the application architecture for jeffknowlesjr.com, focusing on how content is delivered for the three main sections: Blog, Projects, and Contact.

## Table of Contents

1. [Overall Architecture](#overall-architecture)
2. [Content Delivery System](#content-delivery-system)
3. [Blog System](#blog-system)
4. [Projects System](#projects-system)
5. [Contact System](#contact-system)
6. [Deployment & Infrastructure](#deployment--infrastructure)

## Overall Architecture

The website is built using:

- **Next.js**: React framework with App Router for server components and routing
- **TypeScript**: For type safety and better developer experience
- **TailwindCSS**: For styling
- **AWS**: For hosting and backend services

The architecture follows a modern JAMstack approach with:

- Static generation for content-heavy pages
- Server components for dynamic content
- Markdown-based content management
- Serverless functions for dynamic operations (contact form)

## Content Delivery System

### Content Management

Content is managed in two distinct ways:

1. **DynamoDB (Source of Truth):** All blog posts and projects are stored in AWS DynamoDB tables. This is the **only** source of content used by the production application.

2. **Content Directory (Upload Source Only):** The `/content` directory exists strictly as a staging area for content to be uploaded to DynamoDB:

```
/content
  /blog
    blog-post-1.md
    blog-post-2.md
    ...
  /projects
    project-1.md
    project-2.md
    ...
```

**Important:** The content directory is NOT referenced directly by any application code. It's only accessed by build scripts that process and upload content to DynamoDB.

### Content Processing Pipeline

1. **Content Creation**: Authors create content as markdown files in the `/content` directory (solely as a staging area)
2. **Build Time Processing**:
   - Pre-build scripts process markdown files during CI/CD
   - `blog-to-json.js` temporarily converts markdown to JSON format
   - `import-all-blogs` script uploads JSON content to DynamoDB
3. **Content Delivery**:
   - Application exclusively serves content from DynamoDB via AppSync GraphQL API
   - No application code accesses the content directory directly

The content directory is completely isolated from the application code and serves purely as a content staging area. It is only accessed by build scripts during the deployment process.

### Content Access

Content is accessed exclusively through GraphQL queries to the AWS AppSync API, which retrieves data from DynamoDB:

```graphql
type BlogPost @model {
  id: ID!
  title: String!
  slug: String! @index(name: "bySlug", queryField: "getBlogPostBySlug")
  content: String!
  excerpt: String
  author: String
  tags: [String]
  category: String
  readingTime: Int
  featuredImage: String
  ogImage: String
  status: ContentStatus!
  datePublished: AWSDateTime
  dateModified: AWSDateTime
  comments: [Comment] @hasMany
}
```

The application never reads directly from the content directory in production or development environments - it always uses the GraphQL API to access data.

## Blog System

### Content Structure

Each blog post is a markdown file with frontmatter:

```md
---
title: 'Blog Post Title'
slug: 'blog-post-slug'
excerpt: 'Brief description of the blog post.'
datePublished: '2024-04-01'
author: 'Compiled with assistance from AI'
tags: ['Tag1', 'Tag2']
readingTime: 5
featuredImage: '/path/to/image.jpg'
status: 'published'
---

Blog post content in markdown...
```

### Content Delivery Flow

1. **Blog List Page** (`src/app/blog/page.tsx`):

   - Server component fetches published blog posts from DynamoDB via GraphQL query
   - Sorts posts by publication date
   - Renders a grid of `BlogCard` components
   - Handles empty states and errors gracefully

2. **Blog Detail Page** (`src/app/blog/[slug]/page.tsx`):

   - Dynamic route based on post slug
   - Fetches the specific blog post from DynamoDB using `getBlogPostBySlug` GraphQL query
   - Renders the full blog post with title, author, date, content, etc.
   - Generates metadata for SEO

3. **Blog Categories/Tags** (`src/app/blog/category/[category]/page.tsx`, `src/app/blog/tag/[tag]/page.tsx`):

   - Filter posts by category or tag using GraphQL filters
   - Dynamically generated pages for each category/tag

4. **Recent Posts API** (`src/app/api/blog/recent-posts/route.ts`):
   - API endpoint that queries DynamoDB via GraphQL for recent posts
   - Used by various components like the sidebar

All content flows exclusively from DynamoDB through GraphQL queries. At no point does the application code read directly from markdown files in the content directory.

### Components

- `BlogCard`: Card component for blog post preview
- `BlogPostList`: List of blog posts with grid layout
- `BlogSidebar`: Sidebar showing recent posts
- `BlogLayout`: Layout wrapper for all blog pages

## Projects System

### Content Structure

Each project is a markdown file with frontmatter:

```md
---
title: 'Project Title'
slug: 'project-slug'
excerpt: 'Brief description of the project.'
datePublished: '2024-03-15'
author: 'Compiled with assistance from AI'
tags: ['Tag1', 'Tag2']
status: 'published'
featuredImage: '/path/to/image.jpg'
---

Project description and details in markdown...
```

### Content Delivery Flow

1. **Projects List Page** (`src/app/projects/page.tsx`):

   - Server component fetches published projects from DynamoDB via GraphQL query
   - Renders a grid of `ProjectCard` components
   - Sorts projects by date or priority

2. **Project Detail Page** (`src/app/projects/[slug]/page.tsx`):
   - Dynamic route based on project slug
   - Fetches the specific project from DynamoDB using `getProjectBySlug` GraphQL query
   - Renders the full project details with title, description, images, etc.
   - Generates metadata for SEO

All project content is served exclusively from DynamoDB via GraphQL queries. The content directory is not accessed by the application code.

### Components

- `ProjectCard`: Card component for project preview
- `ProjectDetailSection`: Component for project details
- `ProjectGallery`: Image gallery for project screenshots

## Contact System

The contact system uses a form-based approach with server-side API handling:

### Frontend Implementation

The contact form is implemented in `src/components/ContactForm.tsx`:

```typescript
// Simplified version
export function ContactForm() {
  const [formState, setFormState] = useState(/* initial state */)

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Validate form data
    // Send form data to API endpoint
    // Handle success/error states
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

Features:

- Client-side validation
- Submission status indicators
- Debounced submissions to prevent duplicates
- Accessibility considerations

### Backend Implementation

API route for handling contact form submissions (`src/app/api/contact/route.ts`):

```typescript
// Simplified version
export async function POST(request: Request) {
  const data = await request.json()

  // Validate data
  // Send email notification
  // Store contact in database if needed
  // Return success/error response
}
```

Features:

- Server-side validation
- Email sending via configured provider
- CSRF protection
- Rate limiting to prevent spam
- Duplicate detection

## Deployment & Infrastructure

### AWS Infrastructure

The website is deployed on AWS with:

- **AWS Amplify**: For hosting the Next.js application
- **AWS AppSync**: GraphQL API for accessing DynamoDB data
- **DynamoDB**: NoSQL database for storing blog posts, projects, and contact form submissions
- **Lambda Functions**: For serverless API endpoints (contact form) and content processing
- **CloudFront**: For CDN and caching
- **Route 53**: For DNS management
- **S3**: For storing static assets and images

### Database Architecture

The application uses DynamoDB as its primary datastore with the following tables:

| Table Name  | Primary Key | Sort Key | GSI1                 | GSI2                                     |
| ----------- | ----------- | -------- | -------------------- | ---------------------------------------- |
| BlogPost    | id          | -        | slug (GSI1-PK)       | status, datePublished (GSI2-PK, GSI2-SK) |
| Project     | id          | -        | slug (GSI1-PK)       | status, featured (GSI2-PK, GSI2-SK)      |
| Comment     | id          | -        | blogPostID (GSI1-PK) | status (GSI2-PK)                         |
| ContactForm | id          | -        | -                    | status (GSI1-PK)                         |

### Content Processing Pipeline

1. **Content Creation**: Authors create content as markdown files in the `/content` directory (solely as a staging area)
2. **Build Time Processing**:
   - Pre-build scripts process markdown files during CI/CD
   - `blog-to-json.js` temporarily converts markdown to JSON format
   - `import-all-blogs` script uploads JSON content to DynamoDB
3. **Content Delivery**:
   - Application exclusively serves content from DynamoDB via AppSync GraphQL API
   - No application code accesses the content directory directly

The content directory is completely isolated from the application code and serves purely as a content staging area. It is only accessed by build scripts during the deployment process.

### Build & Deployment Process

1. Code is pushed to GitHub repository
2. AWS Amplify detects changes and initiates build
3. During build:
   - Pre-build scripts run to process content
   - Next.js builds the application
   - Content is processed and synchronized with DynamoDB
   - Static pages are pre-rendered
4. Deploy to production environment
5. CloudFront cache is invalidated for updated resources

### Performance Optimizations

- Images are optimized using Next.js Image component
- Static content is pre-rendered at build time
- CDN caching for faster global delivery
- Code splitting for optimal bundle sizes
- DynamoDB read/write capacity auto-scaling

## Conclusion

This architecture provides a maintainable, performant system for delivering blog posts, project information, and handling contact requests with several key advantages:

1. **Single Source of Truth**: DynamoDB serves as the exclusive content database for the application
2. **Strict Separation of Concerns**: Content management (authoring/uploading) is completely separate from content delivery (application)
3. **Optimized Performance**: GraphQL allows for precise data fetching with minimal overhead
4. **Scalable Infrastructure**: AWS services scale automatically to handle traffic spikes

The clean separation between content creation (markdown in the content directory) and content serving (DynamoDB via GraphQL) provides an architecture that is both maintainable and scalable. Content creators can work with familiar markdown files, while the application benefits from the performance and reliability of a proper database.

This architecture enables the site to scale efficiently as content grows over time, without creating technical debt or performance bottlenecks.
