import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { execSync } from 'child_process'
import matter from 'gray-matter'
import dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Configuration
const ASSETS_DIR = path.join(process.cwd(), 'public', 'content', 'assets')
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const TEMP_PROCESSING_DIR = path.join(process.cwd(), 'temp_processed_images')

// AWS/CloudFront Config
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'jeff-dev-blog-images'
const CLOUDFRONT_DOMAIN =
  process.env.CLOUDFRONT_DOMAIN || 'd309xicbd1a46e.cloudfront.net'
const AWS_REGION = process.env.REGION || 'us-east-1'
const S3_UPLOAD_PREFIX = 'featured/'

if (!S3_BUCKET_NAME || !CLOUDFRONT_DOMAIN || !AWS_REGION) {
  console.error(
    'Error: Missing S3_BUCKET_NAME, CLOUDFRONT_DOMAIN, or AWS_REGION.'
  )
  process.exit(1)
}

const s3Client = new S3Client({ region: AWS_REGION })

// Ensure temp directory exists
if (!fs.existsSync(TEMP_PROCESSING_DIR)) {
  fs.mkdirSync(TEMP_PROCESSING_DIR, { recursive: true })
}

// Helper to extract base name from path/URL
const getBaseName = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return null
  try {
    const parsedUrl = new URL(filePath, 'http://dummybase') // Use dummy base for relative paths
    const pathname = parsedUrl.pathname
    const parsed = path.parse(pathname)
    return parsed.name
  } catch {
    // Fallback for simple filenames or non-URL paths
    try {
      const parsed = path.parse(filePath)
      return parsed.name
    } catch {
      console.warn(`Could not parse base name from: ${filePath}`)
      return null
    }
  }
}

// Helper to find source asset matching base name
const findSourceAsset = (baseName) => {
  if (!baseName) return null
  const extensions = ['.jpg', '.jpeg', '.png', '.gif']
  for (const ext of extensions) {
    const potentialFile = path.join(ASSETS_DIR, `${baseName}${ext}`)
    if (fs.existsSync(potentialFile)) {
      return potentialFile
    }
  }
  return null // Not found
}

// Process image locally
async function processImageLocal(sourcePath, tempTargetPath, options = {}) {
  const { width = 1200, quality = 85 } = options
  try {
    await sharp(sourcePath)
      .resize({ width })
      .webp({ quality })
      .toFile(tempTargetPath)
    // console.log(`Locally processed: ${path.basename(sourcePath)} -> ${path.basename(tempTargetPath)}`)
    return true
  } catch (error) {
    console.error(`Error processing ${sourcePath} locally:`, error)
    return false
  }
}

// Upload file to S3
async function uploadToS3(filePath, s3Key) {
  try {
    const fileStream = fs.createReadStream(filePath)
    const contentType = mime.lookup(filePath) || 'application/octet-stream'
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileStream,
      ContentType: contentType
      // ACL: 'public-read', // Uncomment if your bucket requires public-read ACL
    })
    await s3Client.send(command)
    console.log(`  -> Uploaded to S3: s3://${S3_BUCKET_NAME}/${s3Key}`)
    return true
  } catch (error) {
    console.error(`  -> Error uploading ${s3Key} to S3:`, error)
    return false
  }
}

// --- Main processing function ---
async function processAndSyncImages() {
  console.log(
    'Starting Image Sync Process (S3/CloudFront Workflow using ogImage field)...'
  )
  console.log(`Reading markdown from: ${BLOG_CONTENT_DIR}`)
  console.log(`Using assets from: ${ASSETS_DIR}`)
  console.log(
    `Uploading to S3 Bucket: ${S3_BUCKET_NAME}, Prefix: ${S3_UPLOAD_PREFIX}`
  )
  console.log(`Using CloudFront Domain: ${CLOUDFRONT_DOMAIN}`)

  const markdownFiles = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
  console.log(`Found ${markdownFiles.length} markdown blog posts.`)

  let processedCount = 0
  let uploadedCount = 0
  let updatedMdCount = 0
  let warningCount = 0
  let alreadyCloudFrontCount = 0

  for (const mdFilename of markdownFiles) {
    const mdFilePath = path.join(BLOG_CONTENT_DIR, mdFilename)
    console.log(`\nProcessing Markdown: ${mdFilename}`)
    let needsSave = false

    try {
      const fileContent = fs.readFileSync(mdFilePath, 'utf8')
      if (!fileContent.startsWith('---')) {
        console.log(`  -> Skipping ${mdFilename}: No frontmatter detected.`)
        warningCount++
        continue
      }

      const { data: frontmatter, content, empty } = matter(fileContent)
      if (empty || !frontmatter || Object.keys(frontmatter).length === 0) {
        console.log(`  -> Skipping ${mdFilename}: No frontmatter data found.`)
        warningCount++
        continue
      }

      const currentOgImage = frontmatter.ogImage
      const currentFeaturedImage = frontmatter.featuredImage

      if (!currentOgImage || typeof currentOgImage !== 'string') {
        console.warn(
          `  -> Skipping ${mdFilename}: Missing or invalid 'ogImage' field in frontmatter.`
        )
        warningCount++
        continue
      }

      // Scenario 1: ogImage is already a CloudFront URL
      if (currentOgImage.startsWith(`https://${CLOUDFRONT_DOMAIN}`)) {
        console.log(
          `  -> Found existing CloudFront URL in ogImage: ${currentOgImage}`
        )
        alreadyCloudFrontCount++
        // Check if featuredImage needs updating to match
        if (currentFeaturedImage !== currentOgImage) {
          console.log(`     Updating featuredImage to match ogImage.`)
          frontmatter.featuredImage = currentOgImage
          needsSave = true
        } else {
          // console.log(`     -> featuredImage already matches ogImage.`)
        }
      }
      // Scenario 2: ogImage is likely a local path, need to process and upload
      else {
        console.log(
          `  -> Found non-CloudFront ogImage: ${currentOgImage}. Attempting to process and upload.`
        )
        const ogBaseName = getBaseName(currentOgImage)
        if (!ogBaseName) {
          console.warn(
            `     Could not determine base name from ogImage path. Skipping processing.`
          )
          warningCount++
          continue
        }

        const sourceAssetPath = findSourceAsset(ogBaseName)
        if (!sourceAssetPath) {
          console.error(
            `     Error: Could not find source asset in ${ASSETS_DIR} matching base name '${ogBaseName}' derived from ogImage.`
          )
          warningCount++
          continue
        }

        console.log(
          `     Found matching source asset: ${path.basename(sourceAssetPath)}`
        )

        // Prepare filenames and paths
        const webpFilename = `${ogBaseName}.webp`
        const tempWebpPath = path.join(TEMP_PROCESSING_DIR, webpFilename)
        const s3Key = `${S3_UPLOAD_PREFIX}${webpFilename}`
        const finalCloudfrontUrl = `https://${CLOUDFRONT_DOMAIN}/${s3Key}`

        // Process
        const processedOk = await processImageLocal(
          sourceAssetPath,
          tempWebpPath
        )
        if (!processedOk) {
          warningCount++
          continue
        }
        processedCount++

        // Upload
        const uploadedOk = await uploadToS3(tempWebpPath, s3Key)
        fs.unlinkSync(tempWebpPath) // Clean up temp
        if (!uploadedOk) {
          warningCount++
          continue
        }
        uploadedCount++

        // Update frontmatter
        console.log(`     Updating featuredImage to: ${finalCloudfrontUrl}`)
        frontmatter.featuredImage = finalCloudfrontUrl
        console.log(`     Updating ogImage to: ${finalCloudfrontUrl}`)
        frontmatter.ogImage = finalCloudfrontUrl
        needsSave = true
      }

      // Save the file if any changes were made
      if (needsSave) {
        frontmatter.dateModified = new Date().toISOString().split('T')[0] // Update modification date
        const serializableFrontmatter = { ...frontmatter }
        Object.keys(serializableFrontmatter).forEach((key) => {
          if (typeof serializableFrontmatter[key] === 'undefined') {
            serializableFrontmatter[key] = null
          }
        })
        const updatedFileContent = matter.stringify(
          content,
          serializableFrontmatter
        )
        fs.writeFileSync(mdFilePath, updatedFileContent, 'utf8')
        updatedMdCount++
        console.log(
          `     -> Successfully updated frontmatter for ${mdFilename}`
        )
      }
    } catch (error) {
      if (error.name === 'YAMLException') {
        console.error(
          `  Error parsing YAML frontmatter in ${mdFilename}:`,
          error.message
        )
      } else {
        console.error(
          `  Error processing markdown file ${mdFilename}:`,
          error.message
        )
      }
      warningCount++
    }
  }

  // Clean up temp dir
  if (
    fs.existsSync(TEMP_PROCESSING_DIR) &&
    fs.readdirSync(TEMP_PROCESSING_DIR).length === 0
  ) {
    fs.rmdirSync(TEMP_PROCESSING_DIR)
  }

  console.log(`\nImage Sync Finished.`)
  console.log(
    `Markdown Files Processed: ${markdownFiles.length}, Already CloudFront: ${alreadyCloudFrontCount}, Images Processed+Uploaded: ${processedCount}, Markdown Updated: ${updatedMdCount}, Warnings/Errors: ${warningCount}`
  )
}

// Main execution wrapper
async function run() {
  try {
    // Ensure necessary packages are available
    try {
      await import('@aws-sdk/client-s3')
    } catch {
      console.log('Installing @aws-sdk/client-s3...')
      execSync('npm i @aws-sdk/client-s3 --save-dev', { stdio: 'inherit' })
    }
    try {
      await import('mime-types')
    } catch {
      console.log('Installing mime-types...')
      execSync('npm i mime-types --save-dev', { stdio: 'inherit' })
    }
    try {
      await import('sharp')
    } catch {
      console.log('Installing sharp...')
      execSync('npm i sharp --save-dev', { stdio: 'inherit' })
    }
    try {
      await import('gray-matter')
    } catch {
      console.log('Installing gray-matter...')
      execSync('npm i gray-matter --save-dev', { stdio: 'inherit' })
    }

    await processAndSyncImages()
  } catch (error) {
    console.error('\nUnhandled error during script execution:', error)
    process.exit(1)
  }
}

run()
