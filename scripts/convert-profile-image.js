/**
 * Profile Image Conversion Script
 *
 * Converts HEIC image to JPG and optimizes it for the homepage
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Source and destination paths
const sourcePath = path.join(process.cwd(), 'src', 'assets', 'IMG_5836.HEIC')
const tempJpgPath = path.join(
  process.cwd(),
  'src',
  'assets',
  'IMG_5836_temp.jpg'
)
const outputPath = path.join(
  process.cwd(),
  'public',
  'images',
  'jeff-profile.jpg'
)

// Settings for the optimized image
const TARGET_WIDTH = 400 // Width for the profile image
const QUALITY = 85

async function convertAndOptimizeImage() {
  try {
    console.log('Starting image conversion process...')

    // Step 1: Convert HEIC to JPG
    console.log('Converting HEIC to JPG...')
    const heicData = await readFile(sourcePath)
    const jpgBuffer = await heicConvert({
      buffer: heicData,
      format: 'JPEG',
      quality: 0.9
    })

    // Save the temporary JPG
    await writeFile(tempJpgPath, jpgBuffer)
    console.log('HEIC converted to JPG successfully.')

    // Step 2: Optimize with sharp
    console.log('Optimizing image...')

    // Get original JPG metadata
    const metadata = await sharp(tempJpgPath).metadata()
    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`)

    // Calculate target height to maintain aspect ratio
    const targetHeight = Math.round(
      TARGET_WIDTH * (metadata.height / metadata.width)
    )

    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Process the image
    await sharp(tempJpgPath)
      .resize({
        width: TARGET_WIDTH,
        height: targetHeight,
        fit: 'cover'
      })
      .jpeg({
        quality: QUALITY,
        mozjpeg: true
      })
      .toFile(outputPath)

    // Get new metadata
    const newMetadata = await sharp(outputPath).metadata()
    console.log(`New dimensions: ${newMetadata.width}x${newMetadata.height}`)
    console.log(
      `New size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)}KB`
    )

    // Clean up temporary file
    fs.unlinkSync(tempJpgPath)
    console.log('Temporary file removed.')

    console.log('Image processing completed successfully!')
    console.log(`Optimized image saved to: ${outputPath}`)
    console.log('You can now use this image in the homepage.')
  } catch (error) {
    console.error('Error processing image:', error)
  }
}

// Run the conversion and optimization function
convertAndOptimizeImage()
