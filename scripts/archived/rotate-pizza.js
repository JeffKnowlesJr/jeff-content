import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const inputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'adrian-infernus-wIIIcJlC32k-unsplash-16x9.jpg'
)
const outputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-rotated.webp'
)

// Define a more reasonable max height
const MAX_HEIGHT = 800
const QUALITY = 85

async function processImage() {
  try {
    await sharp(inputPath)
      .rotate(90)
      .resize({
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    console.log('Image successfully rotated, resized and converted to WebP!')
    console.log(`Saved to: ${outputPath}`)

    // Also create a fallback JPEG
    const jpegOutputPath = path.join(
      process.cwd(),
      'public',
      'images',
      'blog',
      'featured',
      'pizza-rotated.jpg'
    )
    await sharp(inputPath)
      .rotate(90)
      .resize({
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY })
      .toFile(jpegOutputPath)

    console.log('JPEG fallback also created!')
    console.log(`Saved to: ${jpegOutputPath}`)
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

processImage()
