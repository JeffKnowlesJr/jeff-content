const fs = require('fs')
const path = require('path')

// Create directories if they don't exist
const dirs = ['public/images/blog/featured', 'public/images/projects']

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Map of blog posts to images
const blogImageMap = {
  'getting-started-with-nextjs': 'lukas-MU8w72PzRow-unsplash.jpg',
  'building-modern-portfolio': 'hector-j-rivas-QNc9tTNHRyI-unsplash.jpg',
  'optimizing-react-performance': 'vadim-sherbakov-osSryggkso4-unsplash.jpg',
  'typescript-best-practices': 'sajad-nori-21mJd5NUGZU-unsplash.jpg',
  'aws-serverless-architecture': 'planet-volumes-FBBcdlwIDK0-unsplash.jpg',
  'responsive-design-principles': 'mohammad-alizade-XgeZu2jBaVI-unsplash.jpg'
}

// Map of projects to images
const projectImageMap = {
  'portfolio-website': 'adrian-infernus-wIIIcJlC32k-unsplash.jpg',
  'e-commerce-platform': 'getty-images-4zkrf2iPZ8k-unsplash.jpg',
  'task-management-app': 'lautaro-andreani-xkBaqlcqeb4-unsplash.jpg',
  'weather-dashboard': 'allison-saeng-Iy_wveeeqe8-unsplash.jpg',
  'blog-cms': 'marin-huang-yz9da_YVV80-unsplash.jpg',
  'analytics-dashboard': 'lala-azizli-OLvQEjwCSVI-unsplash.jpg'
}

// Copy blog post images
Object.entries(blogImageMap).forEach(([slug, imageName]) => {
  const sourcePath = path.join('content/assets', imageName)
  const destPath = path.join('public/images/blog/featured', `${slug}.jpg`)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath)
    console.log(`Copied: ${sourcePath} -> ${destPath}`)
  } else {
    console.error(`Source image not found: ${sourcePath}`)
  }
})

// Copy project images
Object.entries(projectImageMap).forEach(([slug, imageName]) => {
  const sourcePath = path.join('content/assets', imageName)
  const destPath = path.join('public/images/projects', `${slug}.jpg`)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath)
    console.log(`Copied: ${sourcePath} -> ${destPath}`)
  } else {
    console.error(`Source image not found: ${sourcePath}`)
  }
})

console.log('All images have been organized!')
