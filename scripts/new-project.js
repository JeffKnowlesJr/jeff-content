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
  console.error('Please provide a project title')
  console.error('Usage: npm run new:project "My Project Title"')
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
const contentDir = path.join(process.cwd(), 'content', 'projects')
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

// Generate file path
const filePath = path.join(contentDir, `${slug}.md`)

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`Error: Project already exists at ${filePath}`)
  process.exit(1)
}

// Generate front matter
const frontMatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "A brief description of the project goes here."
author: "Compiled with assistance from AI"
tags: ["Web Development", "Portfolio"]
techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
datePublished: "${dateFormatted}"
dateModified: "${dateFormatted}"
status: "draft"
featuredImage: "/images/projects/featured/default-project-image.jpg"
thumbnailImage: "/images/projects/default-thumbnail.jpg"
contentImage: "/images/projects/content/default-content-image.jpg"
projectType: "Web Application"
projectStatus: "In Progress"
githubUrl: "https://github.com/yourusername/project-repo"
liveUrl: "https://your-project.com"
readingTime: "8 min read"
---

## Project Overview

Provide a comprehensive overview of the project here. Explain what the project is, its purpose, and why it was created.

## Technical Details

### Architecture

Describe the architecture of the project:

- Frontend framework: Next.js with React and TypeScript
- Styling: Tailwind CSS
- State Management: [Specify]
- API/Backend: [Specify]
- Database: [Specify]
- Deployment: [Specify]

### Key Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Implementation Notes

Discuss the most interesting or challenging aspects of implementing this project.

### Challenges

Describe any significant challenges faced during development and how they were overcome.

### Solutions

Explain the solutions implemented to address the challenges.

## Results & Impact

Share any metrics, user feedback, or business impact resulting from this project.

## Lessons Learned

Reflect on what you learned from this project and how it has influenced your approach to future projects.

## Future Enhancements

Outline potential future improvements or features that could be added to the project.
`

// Write the file
fs.writeFileSync(filePath, frontMatter)

console.log(`Success! Project created at ${filePath}`)
console.log(`Slug: ${slug}`)
console.log(
  `URL: http://localhost:3000/projects/${slug} (when running dev server)`
)

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
  'projects',
  'featured'
)
if (!fs.existsSync(imageDir)) {
  console.log(`Note: Don't forget to create the image directory: ${imageDir}`)
}
