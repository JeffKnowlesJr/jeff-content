import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

// Define paths
const contentDir = path.join(rootDir, 'content', 'blog')
const outputDir = path.join(rootDir, 'public', 'data')
const outputFile = path.join(outputDir, 'blog-posts.json')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
  console.log(`Created output directory: ${outputDir}`)
}

// Function to process blog posts
async function processBlogPosts() {
  console.log('Processing blog posts to JSON...')

  try {
    // Get all markdown files from the content/blog directory
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith('.md'))

    console.log(`Found ${markdownFiles.length} blog posts`)

    // Process each markdown file
    const blogPosts = markdownFiles.map((fileName) => {
      const filePath = path.join(contentDir, fileName)
      const fileContent = fs.readFileSync(filePath, 'utf8')

      // Parse frontmatter
      const { data, content } = matter(fileContent)

      // Create blog post object
      return {
        id: data.slug || fileName.replace('.md', ''),
        slug: data.slug || fileName.replace('.md', ''),
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        author: data.author || 'Unknown',
        tags: data.tags || [],
        readingTime: data.readingTime || '',
        datePublished: data.datePublished || '',
        dateModified: data.dateModified || data.datePublished || '',
        status: data.status || 'draft',
        featuredImage: data.featuredImage || '',
        content: content
      }
    })

    // Sort by date published (newest first)
    const sortedPosts = blogPosts.sort((a, b) => {
      const dateA = new Date(a.datePublished)
      const dateB = new Date(b.datePublished)
      return dateB - dateA
    })

    // Create JSON object
    const jsonOutput = {
      count: sortedPosts.length,
      items: sortedPosts
    }

    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonOutput, null, 2))
    console.log(
      `Successfully wrote ${sortedPosts.length} blog posts to ${outputFile}`
    )

    // If this were a real implementation, here's where we would push to DynamoDB
    console.log(
      'Note: This script only creates the JSON file. To push to DynamoDB,'
    )
    console.log(
      'you would need to implement the DynamoDB client and put operations here.'
    )

    return sortedPosts
  } catch (error) {
    console.error('Error processing blog posts:', error)
    throw error
  }
}

// Execute the function
processBlogPosts()
  .then(() => {
    console.log('Blog processing completed successfully!')
  })
  .catch((error) => {
    console.error('Failed to process blogs:', error)
    process.exit(1)
  })
