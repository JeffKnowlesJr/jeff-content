# Content Management Guide

This document outlines the content organization and management workflows for both the main Next.js website and the backend admin SPA.

## Content Structure

The content management system uses two distinct components:

1. **Content Staging Area**: Local markdown files used solely for content authoring and upload
2. **Production Database**: DynamoDB tables that serve as the exclusive source of truth for the application

```
├── content/                    # Content staging area (NOT used by application code)
│   ├── blog/                   # Blog posts for upload to DynamoDB
│   │   ├── modern-website-architecture.md
│   │   ├── aws-amplify-cloud-development.md
│   │   └── ...
│   ├── projects/               # Project case studies for upload to DynamoDB
│   │   ├── project-zero-documentation.md
│   │   ├── project-omega-specifications.md
│   │   └── ...
│   └── assets/                 # Content-related assets for processing
│       ├── blog/               # Blog post specific assets
│       └── projects/           # Project specific assets
├── public/
│   ├── images/                 # Optimized images
│   │   ├── blog/               # Blog images
│   │   │   ├── featured/       # Featured images for blog posts
│   │   │   └── content/        # Images used within blog content
│   │   ├── projects/           # Project images
│   │   │   ├── project-zero/   # Images for specific projects
│   │   │   └── project-omega/
│   │   └── ...
```

**Important**: The `content/` directory is NOT referenced by any application code. It serves strictly as a staging area for content to be uploaded to DynamoDB by build scripts. The application exclusively retrieves content from DynamoDB.

## Content Types and Frontmatter

### Blog Posts

```markdown
---
title: 'Modern Website Architecture'
slug: 'modern-website-architecture'
excerpt: 'Optimizing React applications for search engines by splitting architecture into SSR and SPA components.'
author: 'Compiled with assistance from AI'
tags: ['Architecture', 'Next.js', 'React', 'SEO']
category: 'Development'
readingTime: 8
featuredImage: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg'
ogImage: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg'
status: 'published'
datePublished: '2023-09-15'
dateModified: '2024-04-04'
---

Content goes here...
```

### Projects

```markdown
---
title: 'Project Zero Documentation'
slug: 'project-zero-documentation'
excerpt: 'Comprehensive documentation for Project Zero, detailing architecture and implementation.'
client: 'Internal'
tags: ['documentation', 'architecture']
category: 'Documentation'
featuredImage: '/images/projects/project-zero/cover.jpg'
ogImage: '/images/projects/project-zero/cover.jpg'
status: 'published'
dateCompleted: '2023-08-20'
featured: true
---

Content goes here...
```

## Content Management Workflows

### Adding New Content

#### Blog Posts

1. **Create the Markdown File**

   Create a new file in `content/blog/` with the appropriate frontmatter:

   ```bash
   touch content/blog/my-new-post.md
   ```

2. **Prepare Images**

   Place original images in `src/assets/` and process them:

   ```bash
   # From project root
   node scripts/resize-blog-image.js src/assets/my-image.jpg
   ```

3. **Update Frontmatter**

   Ensure all required fields are filled:

   - title
   - slug (URL-friendly version of title)
   - excerpt (short description)
   - featuredImage (path to processed image)
   - status ("draft", "published", or "archived")

4. **Upload to DynamoDB**

   Run the content processing script to upload to DynamoDB:

   ```bash
   npm run import:all-blogs
   ```

5. **Publish**

   Commit the changes to trigger a build and content upload:

   ```bash
   git add content/blog/my-new-post.md public/images/blog
   git commit -m "Add new blog post: My Post Title"
   git push
   ```

#### Projects

1. **Create the Markdown File**

   Create a new file in `content/projects/` with the appropriate frontmatter:

   ```bash
   touch content/projects/my-new-project.md
   ```

2. **Prepare Project Directory**

   Create a directory for project images:

   ```bash
   mkdir -p public/images/projects/my-new-project
   ```

3. **Optimize Images**

   Process and optimize images:

   ```bash
   # From project root
   node scripts/optimize-project-images.js src/assets/project-cover.jpg public/images/projects/my-new-project/cover.jpg
   ```

4. **Update Frontmatter**

   Ensure all required fields are filled, including:

   - title
   - slug
   - excerpt
   - featuredImage
   - status
   - featured (set to true for homepage feature)

5. **Upload to DynamoDB**

   Run the project import script:

   ```bash
   npm run import:all-projects
   ```

6. **Publish**

   Commit the changes to trigger a build:

   ```bash
   git add content/projects/my-new-project.md public/images/projects/my-new-project
   git commit -m "Add new project: My Project Title"
   git push
   ```

## Backend SPA Content Management

The backend SPA provides a user-friendly interface for managing content in DynamoDB without directly editing Markdown files.

### Content API Endpoints

The AppSync API provides these operations for content management:

#### Blog Posts

```graphql
# Queries
query ListBlogPosts { ... }
query GetBlogPost($id: ID!) { ... }

# Mutations
mutation CreateBlogPost($input: BlogPostInput!) { ... }
mutation UpdateBlogPost($id: ID!, $input: BlogPostUpdateInput!) { ... }
mutation DeleteBlogPost($id: ID!) { ... }
```

#### Projects

```graphql
# Queries
query ListProjects { ... }
query GetProject($id: ID!) { ... }

# Mutations
mutation CreateProject($input: ProjectInput!) { ... }
mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) { ... }
mutation DeleteProject($id: ID!) { ... }
```

### Content Synchronization

The system maintains two-way synchronization:

1. **Markdown to DynamoDB**: Build scripts process markdown files and upload to DynamoDB
2. **DynamoDB to Markdown**: Admin interfaces can export from DynamoDB back to markdown for version control

### Draft and Preview

The backend SPA adds draft and preview capabilities:

1. **Draft Mode**: Content with status="draft" is only visible in the admin SPA
2. **Preview Mode**: The admin SPA provides a preview button to view how content will appear on the main site
3. **Scheduled Publishing**: Content can be scheduled for future publication

## SEO Best Practices

1. **URLs**: Use descriptive, kebab-case slugs
2. **Meta Tags**: Always include title, description, and appropriate OG tags
3. **Images**: Always include alt text for images
4. **Structured Data**: Use schema.org markup for blog posts and projects

## Content Maintenance Schedule

| Task                     | Frequency | Description                                      |
| ------------------------ | --------- | ------------------------------------------------ |
| Content Audit            | Quarterly | Review all content for relevance and accuracy    |
| Image Optimization Check | Monthly   | Ensure all images are properly optimized         |
| Broken Link Check        | Bi-weekly | Check for and fix any broken links               |
| SEO Review               | Monthly   | Review performance and update metadata as needed |

## Emergency Content Updates

For urgent content changes:

1. **Via Backend SPA**:

   - Log in to the admin interface
   - Locate the content
   - Make the necessary changes
   - Save and publish immediately

2. **Direct DynamoDB Update**:
   - Use the AppSync GraphQL API to update content directly
   - No need to update markdown files for emergency changes

## Conclusion

This content management guide provides a structured approach to maintaining content across both the main Next.js website and the backend SPA. The `content/` directory serves solely as a staging area for content to be uploaded to DynamoDB, which is the exclusive source of truth for the application.
