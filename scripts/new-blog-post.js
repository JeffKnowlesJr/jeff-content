#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// Get the filename for reference only
fileURLToPath(import.meta.url)

// Get title from command line arguments
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Please provide a blog post title')
  console.error('Usage: npm run new:blog "My Blog Post Title"')
  process.exit(1)
}

const title = args[0]

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, '-')

// Get current date
const today = new Date()
const dateFormatted = today.toISOString().split('T')[0] // YYYY-MM-DD

// Create content directory if it doesn't exist
const contentDir = path.join(process.cwd(), 'content', 'blog')
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

// Generate file path
const filePath = path.join(contentDir, `${slug}.md`)

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`Error: Blog post already exists at ${filePath}`)
  process.exit(1)
}

// Generate front matter
const frontMatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "A brief description of the blog post goes here."
author: "Jeff Knowles Jr"
tags: ["Development", "Web"]
readingTime: "5 min read"
datePublished: "${dateFormatted}"
dateModified: "${dateFormatted}"
status: "draft"
featuredImage: "/images/blog/featured/default-blog-image.jpg"
---

## Introduction

Start writing your blog post here. This is the introductory paragraph that should hook the reader.

## Main Section

This is the main content of your post. You can use Markdown formatting:

- Bullet points
- Are easy to add

## Code Examples

\`\`\`javascript
// You can include code examples like this
const greeting = 'Hello, world!';
console.log(greeting);
\`\`\`

## Conclusion

Summarize the key points of your post here.
`

// Write the file
fs.writeFileSync(filePath, frontMatter)

console.log(`Success! Blog post created at ${filePath}`)
console.log(`Slug: ${slug}`)
console.log(`URL: http://localhost:3000/blog/${slug} (when running dev server)`)

// Try to open the file in the default editor
try {
  // For Windows
  if (process.platform === 'win32') {
    execSync(`start ${filePath}`)
  }
  // For macOS
  else if (process.platform === 'darwin') {
    execSync(`open ${filePath}`)
  }
  // For Linux and others
  else {
    execSync(`xdg-open ${filePath}`)
  }
} catch {
  console.log('Note: Could not automatically open the file in an editor.')
}

// Remind about creating the images directory
const imageDir = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured'
)
if (!fs.existsSync(imageDir)) {
  console.log(`Note: Don't forget to create the image directory: ${imageDir}`)
}
