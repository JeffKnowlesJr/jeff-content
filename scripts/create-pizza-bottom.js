import sharp from 'sharp'
import path from 'path'

const inputPath = path.join(
  process.cwd(),
  'public',
  'content',
  'assets',
  'adrian-infernus-wIIIcJlC32k-unsplash.jpg'
)
const outputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'blog',
  'featured',
  'pizza-bottom.webp'
)

async function processImage() {
  try {
    // Get the image dimensions
    const metadata = await sharp(inputPath).metadata()
    const { width, height } = metadata

    // Extract the bottom portion where the pizza is located
    // The pizza appears to be in approximately the bottom 40% of the image
    const cropHeight = Math.floor(height * 0.4)
    const cropTop = height - cropHeight

    console.log(`Original image: ${width}x${height}`)
    console.log(`Cropping from y=${cropTop} with height=${cropHeight}`)

    await sharp(inputPath)
      // Extract just the bottom portion with the pizza
      .extract({ left: 0, top: cropTop, width: width, height: cropHeight })
      // Resize to a reasonable size while maintaining aspect ratio
      .resize({
        width: 1200,
        fit: 'inside'
      })
      .webp({ quality: 90 })
      .toFile(outputPath)

    console.log('Created pizza image focusing on bottom portion!')
    console.log(`Saved to: ${outputPath}`)

    // Also create a JPEG version
    const jpegOutputPath = path.join(
      process.cwd(),
      'public',
      'images',
      'blog',
      'featured',
      'pizza-bottom.jpg'
    )

    await sharp(inputPath)
      .extract({ left: 0, top: cropTop, width: width, height: cropHeight })
      .resize({
        width: 1200,
        fit: 'inside'
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpegOutputPath)

    console.log('Created JPEG version!')
    console.log(`Saved to: ${jpegOutputPath}`)
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

processImage()
