# Content Workflow Documentation

This document provides guidance on how to create, manage, and publish content for the website, including blog posts and project pages.

## Content Structure

### Content Management System

The content system uses a two-part approach:

1. **Authoring and Staging (content/ directory)**: The `content/` directory serves strictly as a staging area for authoring and preparing content
2. **Production Content (DynamoDB)**: The actual content displayed on the website comes exclusively from DynamoDB via GraphQL queries

**Important:** The application code never reads directly from markdown files. The content directory is only accessed by build scripts that upload content to DynamoDB.

### Directory Structure

```
content/            # Content staging area - NOT referenced by application code
├── blog/           # Blog posts for upload to DynamoDB
│   └── *.md        # Individual blog post files
└── projects/       # Project documentation for upload to DynamoDB
    └── *.md        # Individual project files
```

### Image Structure

```
public/
├── content/
│   └── assets/      # Source images before processing
└── images/
    ├── blog/
    │   └── featured/ # Processed blog featured images
    └── projects/     # Processed project images
```

## Content Formats

### Blog Post Format

Blog posts use Markdown files with front matter to be uploaded to DynamoDB. Here's the required format:

````markdown
---
title: 'Your Blog Post Title'
slug: 'url-friendly-slug'
excerpt: 'A short description of the post (160-200 characters)'
author: 'Compiled with assistance from AI'
tags: ['Tag1', 'Tag2', 'Tag3']
readingTime: '10 min read'
datePublished: 'YYYY-MM-DD'
dateModified: 'YYYY-MM-DD'
status: 'published'
featuredImage: '/images/blog/featured/your-image.jpg'
ogImage: my-source-image.jpg
---

## Introduction

Your content starts here, written in Markdown format.

## Section Title

You can use regular Markdown syntax:

- Bulleted lists
- With items

1. Numbered lists
2. Work too

### Subsections

For code samples:

```javascript
// Code snippets work too
const hello = 'world'
console.log(hello)
```
````

> Blockquotes are styled with a left border

**Bold text** and _italic text_ work as expected.

[Links](https://example.com) have custom styling in the primary color.

````

### Project Format

Project documentation uses similar Markdown files with front matter for upload to DynamoDB:

```markdown
---
title: "Your Project Title"
slug: "project-slug"
excerpt: "A short description of the project (160-200 characters)"
author: "Compiled with assistance from AI"
tags: ["Tag1", "Tag2", "Tag3"]
techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
datePublished: "YYYY-MM-DD"
dateModified: "YYYY-MM-DD"
status: "published"
featuredImage: "/images/projects/featured/your-image.jpg"
thumbnailImage: "/images/projects/your-thumbnail.jpg"
contentImage: "/images/projects/content/your-content-image.jpg"
projectType: "Web Application"
projectStatus: "Completed"
githubUrl: "https://github.com/yourusername/project-repo"
liveUrl: "https://your-project.com"
readingTime: "8 min read"
ogImage: my-source-image.jpg
---

## Project Overview

Start with a comprehensive overview of the project.

## Technical Details

Explain the technical aspects, architecture decisions, etc.

### Features

- List key features
- With explanations

## Implementation Notes

Discuss challenging aspects of implementation and how they were solved.

## Results & Impact

Share metrics, user feedback, or business impact if available.

## Lessons Learned

Reflect on what you learned from this project.

````

## Content Creation Scripts

The following scripts are available to help create new content:

### Creating a New Blog Post

Run the following command from the root of the project:

```bash
npm run new:blog "My Blog Post Title"
```

This will:

1. Create a new Markdown file with the correct front matter
2. Generate a proper slug based on the title
3. Pre-fill required fields with default values
4. Open the file in your default editor

### Creating a New Project

Run the following command from the root of the project:

```bash
npm run new:project "My Project Title"
```

This will:

1. Create a new Markdown file with the correct front matter
2. Generate a proper slug based on the title
3. Pre-fill required fields with default values
4. Open the file in your default editor

## Content Workflow

### 1. Creating Content

1. Use the content creation scripts to generate a new file
2. Fill in the front matter information
3. Write the content in Markdown
4. Prepare any images needed

### 2. Adding and Syncing Images (S3/CloudFront Workflow)

This workflow uses S3 for storage and CloudFront for delivery.

1.  **Place Source Image:** Add your original image file (e.g., `my-source-image.jpg`) to the assets directory: `/public/content/assets/`.
2.  **Link in Markdown:** Open the corresponding markdown file (`content/blog/your-post.md`). Add or update the `ogImage` field in the frontmatter to contain the _exact filename_ of the source image you just added:
    ```yaml
    ogImage: my-source-image.jpg
    ```
3.  **Run Sync Script:** Execute the image processing and sync script from the project root:

    ```bash
    npm run process-images
    ```

    This script performs several actions:

    - Reads the `ogImage` field from the markdown file.
    - Finds the source image (`my-source-image.jpg`) in `/public/content/assets/`.
    - Processes the image (optimizes, converts to WebP).
    - Uploads the processed WebP to the S3 bucket (`s3://jeff-dev-blog-images/featured/my-source-image.webp`).
    - Determines the final CloudFront URL (`https://d309xicbd1a46e.cloudfront.net/featured/my-source-image.webp`).
    - **Automatically updates** the `featuredImage` and `ogImage` fields in your markdown file (`content/blog/your-post.md`) to this CloudFront URL.
    - Updates the `dateModified` field.

4.  **Verify:** Check the output of the script for success or errors. Verify the frontmatter in your markdown file has been updated with the correct CloudFront URL.

### 3. Upload Content to DynamoDB

Once images are synced and frontmatter is updated:

1.  Run the content import script for blogs:

    ```bash
    npm run blog:import
    ```

    _(Note: A similar script might exist for projects, e.g., `npm run import:all-projects`)_

2.  This script reads the markdown files (including the CloudFront URLs) and uploads the content to DynamoDB via the GraphQL API.

### 4. Publish Content

To publish content:

1. Set the `status` field in the front matter to `"published"`
2. Run the import script again to update the status in DynamoDB
3. Commit and push the changes to trigger a build

To unpublish content:

1. Change the status to `"draft"`
2. Run the import script to update DynamoDB

## Content Organization

### Blog Categories

Use the `tags` field in the front matter to categorize blog posts. Common tags include:

- Development
- Architecture
- Design
- Tutorial
- Case Study
- Opinion

### Project Types

Use the `projectType` field to categorize projects. Common types include:

- Web Application
- Mobile App
- Design System
- API/Backend
- Full-Stack
- UI/UX
- Open Source

## Image Guidelines

### Image Sizes

- Blog featured images: Place in `/public/content/assets/` with "blog" in the filename
  - Will be processed to 1200px width (height adjusted proportionally)
- Project images: Place in `/public/content/assets/` with "project" in the filename
  - Will be processed to 1200px width (height adjusted proportionally)

### Naming Convention

- Use descriptive filenames that include "blog" or "project" as appropriate
- Examples:
  - Blog: `blog-nextjs-architecture.jpg`
  - Project: `project-portfolio-redesign.jpg`

### Image Formats

- Original images can be JPG, PNG, etc.
- The processing script will convert to WebP format automatically
- Reference the WebP version in your content (e.g., `/images/blog/featured/blog-nextjs-architecture.webp`)

## Troubleshooting

### Common Issues

1. **Content not showing up:**

   - Check that the content was correctly uploaded to DynamoDB
   - Verify the `status` is set to `"published"` in DynamoDB
   - Confirm the import script ran successfully

2. **Images not displaying:**

   - Verify the path is correct relative to `/public`
   - Check that the image exists in the specified location
   - Run the image processing script

3. **Import failures:**
   - Ensure your Markdown is valid
   - Check that code blocks are properly formatted
   - Verify front matter is enclosed in triple dashes `---`

## Best Practices

1. **Content Strategy**

   - Maintain a consistent posting schedule
   - Use a content calendar to plan future posts
   - Focus on evergreen content that remains relevant

2. **Writing Style**

   - Use clear, concise language
   - Break up text with headings and bullet points
   - Include code examples when relevant

3. **DynamoDB Maintenance**
   - Regularly audit the DynamoDB tables for outdated content
   - Use the Admin SPA for easy content management
   - Remember that DynamoDB is the single source of truth
