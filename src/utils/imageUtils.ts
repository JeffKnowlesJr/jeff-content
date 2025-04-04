import sharp from 'sharp'
import { join } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'

export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageMetadata extends ImageDimensions {
  format: string
  size: number
}

export interface ProcessedImage {
  originalPath: string
  webpPath: string
  placeholderPath: string
  dimensions: ImageDimensions
  metadata: ImageMetadata
}

export async function getImageDimensions(
  buffer: Buffer
): Promise<ImageDimensions> {
  const metadata = await sharp(buffer).metadata()
  return {
    width: metadata.width || 0,
    height: metadata.height || 0
  }
}

export async function generatePlaceholder(
  buffer: Buffer,
  width: number = 20
): Promise<string> {
  const placeholder = await sharp(buffer)
    .resize(width, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toBuffer()

  return `data:image/png;base64,${placeholder.toString('base64')}`
}

export async function convertToWebP(
  buffer: Buffer,
  quality: number = 80
): Promise<Buffer> {
  return sharp(buffer).webp({ quality }).toBuffer()
}

export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  options = {
    maxWidth: 1920,
    quality: 80,
    generatePlaceholder: true
  }
): Promise<ProcessedImage> {
  // Create output directory if it doesn't exist
  await mkdir(outputDir, { recursive: true })

  // Read input file
  const buffer = await readFile(inputPath)
  const originalDimensions = await getImageDimensions(buffer)

  // Process image
  const image = sharp(buffer)
  const metadata = await image.metadata()

  // Resize if needed
  if (originalDimensions.width > options.maxWidth) {
    image.resize(options.maxWidth, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
  }

  // Generate WebP version
  const webpBuffer = await image.webp({ quality: options.quality }).toBuffer()

  // Generate paths
  const filename = inputPath.split('/').pop()?.split('.')[0]
  const webpPath = join(outputDir, `${filename}.webp`)
  const placeholderPath = join(outputDir, `${filename}-placeholder.png`)

  // Save WebP version
  await writeFile(webpPath, webpBuffer)

  // Generate and save placeholder if requested
  let placeholder = ''
  if (options.generatePlaceholder) {
    placeholder = await generatePlaceholder(buffer)
    await writeFile(
      placeholderPath,
      Buffer.from(placeholder.split(',')[1], 'base64')
    )
  }

  // Get final dimensions
  const finalDimensions = await getImageDimensions(webpBuffer)

  return {
    originalPath: inputPath,
    webpPath,
    placeholderPath: options.generatePlaceholder ? placeholderPath : '',
    dimensions: finalDimensions,
    metadata: {
      width: finalDimensions.width,
      height: finalDimensions.height,
      format: metadata.format || '',
      size: webpBuffer.length
    }
  }
}

export async function processImages(
  inputDir: string,
  outputDir: string,
  _options = {
    maxWidth: 1920,
    quality: 80,
    generatePlaceholder: true
  }
): Promise<ProcessedImage[]> {
  // Implementation would go here
  // This would scan inputDir for images and process each one
  return []
}

export function generateSrcSet(
  basePath: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): string {
  return widths.map((width) => `${basePath}?w=${width} ${width}w`).join(', ')
}

export function generateImageSizes(
  breakpoints: { [key: string]: number } = {
    sm: 640,
    md: 750,
    lg: 828,
    xl: 1080,
    '2xl': 1920
  }
): string {
  return Object.entries(breakpoints)
    .map(([_breakpoint, width]) => `(min-width: ${width}px) ${width}px`)
    .join(', ')
}
