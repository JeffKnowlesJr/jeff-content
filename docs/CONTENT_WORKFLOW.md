# Content Workflow Documentation

This document provides guidance on how to create, manage, and publish content for the website, including blog posts and project pages.

## Content Structure

### Directory Structure

```
content/
├── blog/           # Blog posts
│   └── *.md        # Individual blog post files
└── projects/       # Project documentation
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

Blog posts use Markdown files with front matter. Here's the required format:

````markdown
---
title: 'Your Blog Post Title'
slug: 'url-friendly-slug'
excerpt: 'A short description of the post (160-200 characters)'
author: 'Your Name'
tags: ['Tag1', 'Tag2', 'Tag3']
readingTime: '10 min read'
datePublished: 'YYYY-MM-DD'
dateModified: 'YYYY-MM-DD'
status: 'published'
featuredImage: '/images/blog/featured/your-image.jpg'
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

Project documentation uses Markdown files with front matter. Here's the required format:

```markdown
---
title: "Your Project Title"
slug: "project-slug"
excerpt: "A short description of the project (160-200 characters)"
author: "Your Name"
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

### 2. Adding Images

1. Place your source images in the assets directory:

   - **Source directory**: `/public/content/assets/`
   - For blog images: Use filenames containing "blog" (e.g., `blog-your-topic.jpg`)
   - For project images: Use filenames containing "project" (e.g., `project-name.jpg`)

2. Process the images using the automated script:

   ```bash
   npm run process-images
   ```

   This will:

   - Process blog images to: `/public/images/blog/featured/`
   - Process project images to: `/public/images/projects/`
   - Convert images to WebP format
   - Optimize images for web (1200px width for blog images)
   - Create any required directories automatically

3. Reference the processed images in your content's frontmatter:
   - Blog posts: `featuredImage: "/images/blog/featured/your-image.webp"`
   - Projects: `featuredImage: "/images/projects/your-image.webp"`

> Note: The image processing script filters images based on filenames. Blog images must contain "blog" in the filename, and project images must contain "project".

### 3. Preview Content

1. Run the development server:

   ```bash
   npm run dev
   ```

2. View your content at:
   - Blog post: `http://localhost:3000/blog/your-slug`
   - Project: `http://localhost:3000/projects/your-slug`

### 4. Publish Content

To publish content, set the `status` field in the front matter to `"published"`.

To unpublish content, change the status to `"draft"`.

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

## Content Migration

To import content from the legacy application:

```bash
npm run import-legacy-content
```

This uses the `importLegacyContent` utility from `src/utils/content-loader.ts` to import content from the legacy app directory.

## Troubleshooting

### Common Issues

1. **Content not showing up:**

   - Check that the `status` is set to `"published"`
   - Verify the file is in the correct directory
   - Ensure all required front matter fields are present

2. **Images not displaying:**

   - Verify the path is correct relative to `/public`
   - Check that the image exists in the specified location
   - Run the image processing script

3. **Formatting issues:**
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

3. **SEO Optimization**
   - Use descriptive, keyword-rich titles
   - Write compelling excerpts
   - Include relevant tags
   - Optimize image alt text
