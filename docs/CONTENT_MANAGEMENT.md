# Content Management Guide

This document outlines the content organization and management workflows for both the main Next.js website and the backend admin SPA.

## Content Structure

The content management system uses two distinct components:

1. **Content Staging Area**: Local markdown files used solely for content authoring and upload
2. **Production Database**: DynamoDB tables that serve as the exclusive source of truth for the application

```
├── content/                    # Content staging area (NOT used by application code)
│   ├── blog/                   # Blog posts for upload to DynamoDB
│   │   └── *.md                # Markdown files with frontmatter
│   ├── projects/               # Project case studies for upload to DynamoDB
│   │   └── *.md
│   └── assets/                 # Raw image assets for processing & upload to S3
├── public/                     # Static files served directly (NO processed images here now)
│   ├── images/                 # Optimized images
│   │   ├── blog/               # Blog images
│   │   │   ├── featured/       # Featured images for blog posts
│   │   │   └── content/        # Images used within blog content
│   │   ├── projects/           # Project images
│   │   │   ├── project-zero/   # Images for specific projects
│   │   │   └── project-omega/
│   │   └── ...
```

**Important**: The `content/` directory is NOT referenced by application code. `/content/assets/` holds source images. Processed images are uploaded to S3 and served via CloudFront (`https://d309xicbd1a46e.cloudfront.net/featured/...`). The application reads content (including CloudFront image URLs) exclusively from DynamoDB.

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
ogImage: 'sajad-nori-21mJd5NUGZU-unsplash.jpg' # Source image filename in assets/
featuredImage: 'https://d309xicbd1a46e.cloudfront.net/featured/sajad-nori-21mJd5NUGZU-unsplash.webp' # Final CloudFront URL (added by script)
status: 'published'
datePublished: '2023-09-15'
dateModified: '2024-04-11' # Updated by script
---

Content goes here...
```

_Note: `ogImage` references the source asset filename. `featuredImage` is automatically updated by the `process-images` script to the final CloudFront URL._

### Projects

```markdown
---
title: 'Project Zero Documentation'
slug: 'project-zero-documentation'
excerpt: 'Comprehensive documentation for Project Zero, detailing architecture and implementation.'
client: 'Internal'
tags: ['documentation', 'architecture']
category: 'Documentation'
ogImage: 'project-zero-cover.jpg' # Source image filename in assets/
featuredImage: 'https://d309xicbd1a46e.cloudfront.net/featured/project-zero-cover.webp' # Final CloudFront URL (if projects use same workflow)
status: 'published'
dateCompleted: '2023-08-20'
featured: true
---

Content goes here...
```

## Content Management Workflows

### Adding New Content (Blog Posts Example)

1.  **Add Source Image:** Place the original image file (e.g., `new-blog-image.jpg`) in `/public/content/assets/`.
2.  **Create Markdown File:** Create a new file in `content/blog/` (e.g., `my-new-post.md`).
3.  **Add Frontmatter & Content:** Fill in the required frontmatter fields.
    - **Crucially, set the `ogImage` field** to the _exact filename_ of the source image you added in Step 1 (e.g., `ogImage: new-blog-image.jpg`).
    - You can leave `featuredImage` blank or set it initially; the script will overwrite it.
    - Write the main content of the post.
4.  **Run Image Sync Script:** From the project root, run:
    ```bash
    npm run process-images
    ```
    - This processes the image referenced in `ogImage`, uploads it to S3, gets the CloudFront URL, and automatically updates the `featuredImage` and `ogImage` fields in `my-new-post.md`.
5.  **Run Content Import Script:** Run:
    ```bash
    npm run blog:import
    ```
    - This uploads the content (including the CloudFront image URLs) from `my-new-post.md` to DynamoDB.
6.  **Commit & Deploy:** Commit the updated markdown file (`my-new-post.md`) and deploy the application.

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
