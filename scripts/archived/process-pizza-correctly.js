import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const inputPath = path.join(
  process.cwd(),
  'public',
  'content',
  'assets',
  'adrian-infernus-wIIIcJlC32k-unsplash.jpg'
)
const outputWebpPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-repositioned.webp'
)
const outputJpgPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-repositioned.jpg'
)

// Yellow background color to match original
const bgColor = { r: 232, g: 182, b: 16, alpha: 1 }

async function processImage() {
  try {
    // Get metadata to determine dimensions
    const metadata = await sharp(inputPath).metadata()
    console.log(`Original image: ${metadata.width}x${metadata.height}`)

    // Extract the pizza portion (bottom part of the image)
    // Adjusting to move pizza up by taking it from lower in the image
    const extractHeight = Math.floor(metadata.height * 0.45)
    const extractTop = metadata.height - extractHeight

    // Process WebP version
    await sharp(inputPath)
      // Extract just the part with the pizza
      .extract({
        left: 0,
        top: extractTop,
        width: metadata.width,
        height: extractHeight
      })
      // Resize with padding to move right
      .resize({
        width: 1200,
        height: 800,
        fit: 'contain',
        position: 'right', // Position to right
        background: bgColor
      })
      // Add extra padding to position
      .extend({
        top: 50, // Move up by reducing top padding
        bottom: 100,
        left: 0,
        right: 150, // Add padding on right
        background: bgColor
      })
      .webp({ quality: 85 })
      .toFile(outputWebpPath)

    console.log(
      `Processed WebP image with repositioned pizza saved to: ${outputWebpPath}`
    )

    // Process JPG version as fallback
    await sharp(inputPath)
      .extract({
        left: 0,
        top: extractTop,
        width: metadata.width,
        height: extractHeight
      })
      .resize({
        width: 1200,
        height: 800,
        fit: 'contain',
        position: 'right',
        background: bgColor
      })
      .extend({
        top: 50, // Move up by reducing top padding
        bottom: 100,
        left: 0,
        right: 150, // Add padding on right
        background: bgColor
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outputJpgPath)

    console.log(
      `Processed JPG image with repositioned pizza saved to: ${outputJpgPath}`
    )

    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size
    const webpSize = fs.statSync(outputWebpPath).size
    const jpgSize = fs.statSync(outputJpgPath).size

    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(
      `WebP size: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${Math.round(
        (1 - webpSize / originalSize) * 100
      )}% reduction)`
    )
    console.log(
      `JPG size: ${(jpgSize / 1024 / 1024).toFixed(2)} MB (${Math.round(
        (1 - jpgSize / originalSize) * 100
      )}% reduction)`
    )
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

processImage()
