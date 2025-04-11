const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')

// Create directories if they don't exist
const dirs = ['public/images/blog/featured', 'public/images/projects']

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Function to create a placeholder image
function createPlaceholderImage(text, outputPath, width = 1200, height = 630) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, width, height)

  // Add text
  ctx.fillStyle = '#1f2937'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg')
  fs.writeFileSync(outputPath, buffer)
  console.log(`Created: ${outputPath}`)
}

// Create blog post images
const blogPosts = [
  'getting-started-with-nextjs',
  'building-modern-portfolio',
  'optimizing-react-performance',
  'typescript-best-practices',
  'aws-serverless-architecture',
  'responsive-design-principles'
]

blogPosts.forEach((slug) => {
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  createPlaceholderImage(
    title,
    path.join('public/images/blog/featured', `${slug}.jpg`)
  )
})

// Create project images
const projects = [
  'portfolio-website',
  'e-commerce-platform',
  'task-management-app',
  'weather-dashboard',
  'blog-cms',
  'analytics-dashboard'
]

projects.forEach((slug) => {
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  createPlaceholderImage(
    title,
    path.join('public/images/projects', `${slug}.jpg`)
  )
})

console.log('All placeholder images have been generated!')
