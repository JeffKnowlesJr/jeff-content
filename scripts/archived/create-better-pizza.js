import sharp from 'sharp'
import path from 'path'

const inputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'adrian-infernus-wIIIcJlC32k-unsplash.jpg'
)
const outputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-optimized.webp'
)

async function processImage() {
  try {
    // Create a better pizza image - centered, cropped, with nice composition
    await sharp(inputPath)
      // Extract just the relevant portion with the pizza and yellow background
      .extract({ left: 0, top: 600, width: 5464, height: 4000 })
      // Resize to a reasonable size while maintaining aspect ratio
      .resize({
        width: 1200,
        height: 800,
        fit: 'inside'
      })
      // Better quality WebP
      .webp({ quality: 90 })
      .toFile(outputPath)

    console.log('Created optimized pizza WebP image!')
    console.log(`Saved to: ${outputPath}`)

    // Also create a JPEG version
    const jpegOutputPath = path.join(
      process.cwd(),
      'public',
      'images',
      'blog',
      'featured',
      'pizza-optimized.jpg'
    )

    await sharp(inputPath)
      .extract({ left: 0, top: 600, width: 5464, height: 4000 })
      .resize({
        width: 1200,
        height: 800,
        fit: 'inside'
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpegOutputPath)

    console.log('Created optimized pizza JPEG image!')
    console.log(`Saved to: ${jpegOutputPath}`)
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

processImage()
