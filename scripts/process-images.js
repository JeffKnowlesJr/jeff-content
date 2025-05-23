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

// Force reprocessing - set to true to reprocess all images regardless of existing CloudFront URLs
const FORCE_REPROCESS = false

// Configuration
const ASSETS_DIR = path.join(process.cwd(), 'content', 'blog', 'assets')
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const PROJECT_CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')
const PROJECT_ASSETS_DIR = path.join(process.cwd(), 'content', 'projects', 'assets')
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

// Project to image mapping
const PROJECT_IMAGE_MAPPING = {
  'project-pii': 'nick-hillier-yD5rv8_WzxA-unsplash',
  'project-omega': 'planet-volumes-OLH166vSyHA-unsplash', 
  'project-zero': 'allison-saeng-Iy_wveeeqe8-unsplash'
}

// Helper to find source asset matching base name (enhanced for projects)
const findSourceAsset = (baseName, isProject = false, projectSlug = null) => {
  if (!baseName) return null
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  
  // For projects, first try the mapping
  if (isProject && projectSlug && baseName === 'cover') {
    const mappedImage = PROJECT_IMAGE_MAPPING[projectSlug]
    if (mappedImage) {
      for (const ext of extensions) {
        const potentialFile = path.join(PROJECT_ASSETS_DIR, `${mappedImage}${ext}`)
        if (fs.existsSync(potentialFile)) {
          return potentialFile
        }
      }
    }
  }
  
  // For projects, check multiple possible locations
  const searchDirs = isProject 
    ? [PROJECT_ASSETS_DIR, ASSETS_DIR, path.join(process.cwd(), 'public', 'images', 'projects')]
    : [ASSETS_DIR]
  
  for (const dir of searchDirs) {
    for (const ext of extensions) {
      const potentialFile = path.join(dir, `${baseName}${ext}`)
      if (fs.existsSync(potentialFile)) {
        return potentialFile
      }
    }
  }
  
  // Also check if the image file exists in the project root (for manual uploads)
  const rootPath = path.join(process.cwd(), `${baseName}.jpg`)
  if (fs.existsSync(rootPath)) {
    return rootPath
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
    'Starting Image Sync Process (S3/CloudFront Workflow)...'
  )
  console.log(`Reading blog markdown from: ${BLOG_CONTENT_DIR}`)
  console.log(`Reading project markdown from: ${PROJECT_CONTENT_DIR}`)
  console.log(`Using blog assets from: ${ASSETS_DIR}`)
  console.log(`Using project assets from: ${PROJECT_ASSETS_DIR}`)
  console.log(
    `Uploading to S3 Bucket: ${S3_BUCKET_NAME}, Prefix: ${S3_UPLOAD_PREFIX}`
  )
  console.log(`Using CloudFront Domain: ${CLOUDFRONT_DOMAIN}`)

  // Process both blog and project markdown files
  const blogFiles = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(f => ({ path: path.join(BLOG_CONTENT_DIR, f), type: 'blog', filename: f }))
    
  const projectFiles = fs.existsSync(PROJECT_CONTENT_DIR) 
    ? fs.readdirSync(PROJECT_CONTENT_DIR)
        .filter((f) => f.endsWith('.md'))
        .map(f => ({ path: path.join(PROJECT_CONTENT_DIR, f), type: 'project', filename: f }))
    : []
    
  const allMarkdownFiles = [...blogFiles, ...projectFiles]
  
  console.log(`Found ${blogFiles.length} blog posts and ${projectFiles.length} project files.`)

  let processedCount = 0
  let uploadedCount = 0
  let updatedMdCount = 0
  let warningCount = 0
  let alreadyCloudFrontCount = 0

  for (const { path: mdFilePath, type, filename: mdFilename } of allMarkdownFiles) {
    console.log(`\nProcessing ${type} markdown: ${mdFilename}`)
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

      // For projects, we look at featuredImage, thumbnailImage, and contentImage
      // For blogs, we look at ogImage and featuredImage
      const imageFields = type === 'project' 
        ? ['featuredImage', 'thumbnailImage', 'contentImage']
        : ['ogImage']

      for (const field of imageFields) {
        const currentImage = frontmatter[field]
        
        if (!currentImage || typeof currentImage !== 'string') {
          // Skip if field doesn't exist
          continue
        }

        // Skip if already a CloudFront URL and not forcing reprocess
        if (currentImage.startsWith(`https://${CLOUDFRONT_DOMAIN}`) && !FORCE_REPROCESS) {
          console.log(`  -> ${field} already has CloudFront URL: ${currentImage}`)
          alreadyCloudFrontCount++
          continue
        }

        console.log(`  -> Processing ${field}: ${currentImage}`)

        // Extract base name and find source
        const baseName = getBaseName(currentImage)
        if (!baseName) {
          console.warn(`     Could not determine base name from ${field} path.`)
          warningCount++
          continue
        }

        // For projects, extract project slug from markdown filename
        const projectSlug = type === 'project' ? mdFilename.replace('-documentation.md', '') : null
        const sourceAssetPath = findSourceAsset(baseName, type === 'project', projectSlug)
        if (!sourceAssetPath) {
          console.error(`     Error: Could not find source asset matching '${baseName}' for ${type === 'project' ? `project '${projectSlug}'` : 'blog'}.`)
          warningCount++
          continue
        }

        console.log(`     Found source asset: ${path.basename(sourceAssetPath)}`)

        // Prepare paths - use different S3 prefixes for projects vs blogs
        const s3Prefix = type === 'project' ? 'projects/' : S3_UPLOAD_PREFIX
        const baseFileName = path.parse(path.basename(sourceAssetPath)).name
        const webpFilename = `${baseFileName}.webp`
        const tempWebpPath = path.join(TEMP_PROCESSING_DIR, webpFilename)
        const s3Key = `${s3Prefix}${webpFilename}`
        const finalCloudfrontUrl = `https://${CLOUDFRONT_DOMAIN}/${s3Key}`

        // Process image
        const processedOk = await processImageLocal(sourceAssetPath, tempWebpPath)
        if (!processedOk) {
          warningCount++
          continue
        }
        processedCount++

        // Upload to S3
        const uploadedOk = await uploadToS3(tempWebpPath, s3Key)
        fs.unlinkSync(tempWebpPath) // Clean up temp
        if (!uploadedOk) {
          warningCount++
          continue
        }
        uploadedCount++

        // Update frontmatter
        console.log(`     Updating ${field} to: ${finalCloudfrontUrl}`)
        frontmatter[field] = finalCloudfrontUrl
        needsSave = true
      }

      // For blog posts, sync ogImage to featuredImage
      if (type === 'blog' && frontmatter.ogImage && frontmatter.ogImage !== frontmatter.featuredImage) {
        frontmatter.featuredImage = frontmatter.ogImage
        needsSave = true
      }

      // Save the file if any changes were made
      if (needsSave) {
        frontmatter.dateModified = new Date().toISOString().split('T')[0]
        const serializableFrontmatter = { ...frontmatter }
        Object.keys(serializableFrontmatter).forEach((key) => {
          if (typeof serializableFrontmatter[key] === 'undefined') {
            serializableFrontmatter[key] = null
          }
        })
        const updatedFileContent = matter.stringify(content, serializableFrontmatter)
        fs.writeFileSync(mdFilePath, updatedFileContent, 'utf8')
        updatedMdCount++
        console.log(`     -> Successfully updated frontmatter for ${mdFilename}`)
      }
    } catch (error) {
      if (error.name === 'YAMLException') {
        console.error(`  Error parsing YAML frontmatter in ${mdFilename}:`, error.message)
      } else {
        console.error(`  Error processing markdown file ${mdFilename}:`, error.message)
      }
      warningCount++
    }
  }

  // Clean up temp dir
  if (fs.existsSync(TEMP_PROCESSING_DIR) && fs.readdirSync(TEMP_PROCESSING_DIR).length === 0) {
    fs.rmdirSync(TEMP_PROCESSING_DIR)
  }

  console.log(`\nImage Sync Finished.`)
  console.log(`Total Files Processed: ${allMarkdownFiles.length}, Already CloudFront: ${alreadyCloudFrontCount}, Images Processed: ${processedCount}, Images Uploaded: ${uploadedCount}, Markdown Updated: ${updatedMdCount}, Warnings/Errors: ${warningCount}`)
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
