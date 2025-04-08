const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// Define full paths to make sure we're accessing the right files
const inputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-rotated.webp' // Use the image we know exists
)
const outputWebpPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-moved.webp'
)

// Yellow background color to match original
const bgColor = { r: 232, g: 182, b: 16, alpha: 1 }

async function processImage() {
  try {
    console.log('Starting image processing...')
    console.log(`Input file: ${inputPath}`)

    if (!fs.existsSync(inputPath)) {
      console.error(`Input file does not exist: ${inputPath}`)
      return
    }

    console.log('Input file exists, continuing with processing...')

    // Process WebP version with positioning adjustments
    await sharp(inputPath)
      .resize({
        width: 1200,
        fit: 'contain',
        background: bgColor
      })
      // Position the pizza to the right and up from its current position
      .extend({
        top: 0,
        bottom: 100,
        left: 0,
        right: 150,
        background: bgColor
      })
      .webp({ quality: 90 })
      .toFile(outputWebpPath)

    console.log(`Successfully processed image: ${outputWebpPath}`)
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

processImage()
