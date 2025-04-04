import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { execSync } from 'child_process'

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content')
const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog')
const PROJECT_IMAGES_DIR = path.join(
  process.cwd(),
  'public',
  'images',
  'projects'
)
const ASSETS_DIR = path.join(CONTENT_DIR, 'assets')

// Ensure directories exist
const createDirs = () => {
  const dirs = [
    CONTENT_DIR,
    BLOG_IMAGES_DIR,
    path.join(BLOG_IMAGES_DIR, 'featured'),
    PROJECT_IMAGES_DIR
  ]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    }
  })
}

// Process and optimize an image
async function processImage(sourcePath, targetPath, options = {}) {
  const { width = 1200, height = null, quality = 80 } = options

  try {
    const image = sharp(sourcePath)
    const metadata = await image.metadata()

    // Maintain aspect ratio if height not specified
    const resizeOptions = {
      width,
      height: height || Math.round(width * (metadata.height / metadata.width)),
      fit: 'cover'
    }

    await image.resize(resizeOptions).webp({ quality }).toFile(targetPath)

    console.log(
      `Processed: ${path.basename(sourcePath)} -> ${path.basename(targetPath)}`
    )
  } catch (error) {
    console.error(`Error processing ${sourcePath}:`, error)
  }
}

// Copy and process logo
async function processLogo() {
  const logoSource = path.join(ASSETS_DIR, 'JKJR3.png')
  const logoTarget = path.join(process.cwd(), 'public', 'JKJR3.png')

  if (fs.existsSync(logoSource)) {
    await processImage(logoSource, logoTarget.replace('.png', '.webp'), {
      width: 120,
      height: 40,
      quality: 100
    })
    // Also keep the original PNG
    fs.copyFileSync(logoSource, logoTarget)
    console.log('Logo processed and copied')
  } else {
    console.error('Logo source not found:', logoSource)
  }
}

// Process blog images
async function processBlogImages() {
  const blogImages = fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => file.toLowerCase().includes('blog'))

  for (const image of blogImages) {
    const sourcePath = path.join(ASSETS_DIR, image)
    const targetPath = path.join(
      BLOG_IMAGES_DIR,
      'featured',
      image.replace(/\.[^/.]+$/, '.webp')
    )

    await processImage(sourcePath, targetPath, {
      width: 1200,
      quality: 85
    })
  }
}

// Process project images
async function processProjectImages() {
  const projectImages = fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => file.toLowerCase().includes('project'))

  for (const image of projectImages) {
    const sourcePath = path.join(ASSETS_DIR, image)
    const targetPath = path.join(
      PROJECT_IMAGES_DIR,
      image.replace(/\.[^/.]+$/, '.webp')
    )

    await processImage(sourcePath, targetPath, {
      width: 1200,
      quality: 85
    })
  }
}

// Main execution
async function main() {
  try {
    // First create all necessary directories
    createDirs()

    // Install sharp if not already installed
    try {
      await import('sharp')
    } catch {
      console.log('Installing sharp package...')
      execSync('npm install sharp --save-dev', { stdio: 'inherit' })
    }

    console.log('Processing images...')

    // Process all image types
    await processLogo()
    await processBlogImages()
    await processProjectImages()

    console.log('Image processing complete!')
  } catch (error) {
    console.error('Error during image processing:', error)
    process.exit(1)
  }
}

main()
