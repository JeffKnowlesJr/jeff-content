/**
 * Blog Image Optimization Script
 *
 * Usage:
 * node scripts/optimize-blog-image.js <source-image-path>
 *
 * Example:
 * node scripts/optimize-blog-image.js public/images/blog/featured/my-image.jpg
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Target image specifications
const TARGET_WIDTH = 1200
const TARGET_HEIGHT = 675 // 16:9 aspect ratio
const QUALITY = 85

async function optimizeImage(sourcePath) {
  // Create output path with -16x9 suffix before file extension
  const parsedPath = path.parse(sourcePath)
  const outputPath = path.join(
    parsedPath.dir,
    `${parsedPath.name}-16x9${parsedPath.ext}`
  )

  try {
    console.log(`Processing image: ${sourcePath}`)

    // Get original image metadata
    const metadata = await sharp(sourcePath).metadata()
    console.log(
      `Original size: ${(fs.statSync(sourcePath).size / 1024 / 1024).toFixed(
        2
      )}MB`
    )
    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`)

    // Process the image with 16:9 aspect ratio
    // For a square image, we'll crop from center to get 16:9
    await sharp(sourcePath)
      .resize({
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
        fit: 'cover',
        position: 'center' // Center crop to preserve the most important part
      })
      .jpeg({
        quality: QUALITY,
        mozjpeg: true // Use mozjpeg for better compression
      })
      .toFile(outputPath)

    // Get new metadata
    const newMetadata = await sharp(outputPath).metadata()
    console.log(
      `New size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)}MB`
    )
    console.log(`New dimensions: ${newMetadata.width}x${newMetadata.height}`)

    console.log('Image processing completed successfully!')
    console.log(`Optimized 16:9 image saved to: ${outputPath}`)
    console.log('Update your blog post to use this new image path.')
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

// Get source path from command line arguments
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Please provide a source image path')
  console.log('Usage: node scripts/optimize-blog-image.js <source-image-path>')
  process.exit(1)
}

const sourcePath = path.resolve(args[0])
if (!fs.existsSync(sourcePath)) {
  console.error(`File not found: ${sourcePath}`)
  process.exit(1)
}

// Run the optimize function
optimizeImage(sourcePath)
