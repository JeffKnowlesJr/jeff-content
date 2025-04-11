import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Configuration
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const ASSETS_DIR = path.join(process.cwd(), 'content', 'blog', 'assets')

// Mapping of blog slugs to image filenames in assets folder
// This mapping connects blog posts to their corresponding images
const blogImageMap = {
  'streamlining-build-processes': 'lukas-MU8w72PzRow-unsplash.jpg',
  'building-modern-portfolio': 'hector-j-rivas-QNc9tTNHRyI-unsplash.jpg',
  'react-performance-tips': 'vadim-sherbakov-osSryggkso4-unsplash.jpg',
  'obsidian-for-developers': 'sajad-nori-21mJd5NUGZU-unsplash.jpg',
  'directorybased-domain-splitting-in-aws':
    'planet-volumes-FBBcdlwIDK0-unsplash.jpg',
  'modern-website-architecture': 'mohammad-alizade-XgeZu2jBaVI-unsplash.jpg',
  'optimizing-images-web': 'hal-gatewood-tZc3vjPCk-Q-unsplash.jpg'
}

// Get available images in assets directory
function getAvailableImages() {
  const availableImages = fs
    .readdirSync(ASSETS_DIR)
    .filter(
      (file) =>
        file.endsWith('.jpg') ||
        file.endsWith('.jpeg') ||
        file.endsWith('.png') ||
        file.endsWith('.webp')
    )

  console.log(`Found ${availableImages.length} images in assets directory.`)
  return availableImages
}

// Ensure all blog posts reference images correctly
async function fixImagePaths() {
  console.log('Checking blog post image references...')

  const markdownFiles = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))

  console.log(`Found ${markdownFiles.length} markdown blog posts.`)

  const availableImages = getAvailableImages()

  let updatedCount = 0
  let warningCount = 0

  for (const mdFilename of markdownFiles) {
    const mdFilePath = path.join(BLOG_CONTENT_DIR, mdFilename)
    let needsSave = false

    // Get blog slug from filename (remove .md extension)
    const blogSlug = path.basename(mdFilename, '.md')

    try {
      const fileContent = fs.readFileSync(mdFilePath, 'utf8')
      if (!fileContent.startsWith('---')) {
        console.log(`Skipping ${mdFilename}: No frontmatter detected.`)
        continue
      }

      const { data: frontmatter, content } = matter(fileContent)

      // Ensure ogImage exists
      if (!frontmatter.ogImage) {
        frontmatter.ogImage = ''
        needsSave = true
        console.log(`Adding empty ogImage field to ${mdFilename}`)
      }

      // First check if we should update the sourceImageAsset based on our mapping
      if (blogImageMap[blogSlug]) {
        const mappedImage = blogImageMap[blogSlug]

        // Make sure the mapped image exists in the assets folder
        if (availableImages.includes(mappedImage)) {
          // If sourceImageAsset doesn't exist or is different, update it
          if (
            !frontmatter.sourceImageAsset ||
            frontmatter.sourceImageAsset !== mappedImage
          ) {
            frontmatter.sourceImageAsset = mappedImage
            console.log(`Mapping '${blogSlug}' to image: ${mappedImage}`)
            needsSave = true
          }
        } else {
          console.log(
            `Warning: Mapped image ${mappedImage} for blog ${blogSlug} not found in assets folder.`
          )
          warningCount++
        }
      } else {
        console.log(`Note: No mapping defined for blog: ${blogSlug}`)

        // Check if there's an existing sourceImageAsset
        if (frontmatter.sourceImageAsset) {
          const sourcePath = path.join(ASSETS_DIR, frontmatter.sourceImageAsset)
          if (!fs.existsSync(sourcePath)) {
            console.log(
              `Warning: Image ${frontmatter.sourceImageAsset} referenced in ${mdFilename} not found in assets folder.`
            )
            warningCount++
          } else {
            console.log(
              `Found image: ${frontmatter.sourceImageAsset} for ${mdFilename}`
            )
          }
        } else {
          // If no sourceImageAsset and no mapping, use default behavior
          console.log(
            `No image mapped for ${blogSlug} and no sourceImageAsset found.`
          )
          warningCount++
        }
      }

      // Save if needed
      if (needsSave) {
        const updatedFileContent = matter.stringify(content, frontmatter)
        fs.writeFileSync(mdFilePath, updatedFileContent, 'utf8')
        updatedCount++
        console.log(`Updated ${mdFilename}`)
      }
    } catch (error) {
      console.error(`Error processing ${mdFilename}:`, error)
      warningCount++
    }
  }

  console.log(
    `\nCompleted! Updated ${updatedCount} files with ${warningCount} warnings.`
  )
}

// Run the function
fixImagePaths()
