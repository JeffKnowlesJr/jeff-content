import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Path to the source image
const sourcePath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'smit-patel-xMNQketH4tU-unsplash.jpg'
)

// Path to the optimized output (new filename with 16:9 suffix)
const outputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'smit-patel-xMNQketH4tU-unsplash-16x9.jpg'
)

// Target image specifications
const TARGET_WIDTH = 1200
const TARGET_HEIGHT = 675 // 16:9 aspect ratio
const QUALITY = 85

async function resizeImage() {
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
    console.log(
      'Update the blog post to use the new 16:9 optimized image filename.'
    )
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

// Run the resize function
resizeImage()
