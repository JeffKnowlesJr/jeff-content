import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import 'server-only'

// Define content types
export type ContentType = 'blog' | 'projects' | 'project'

// Define base content interface
interface BaseContent {
  slug: string
  title: string
  excerpt: string
  content: string
  status: string
  datePublished: string
  dateModified: string
}

// Blog post interface
export interface BlogPost extends BaseContent {
  id: string
  author: string
  tags: string[]
  readingTime: number | string
  featuredImage: string
  image?: string
  publishDate?: string
}

// Project interface
export interface Project extends BaseContent {
  id: string
  author: string
  tags: string[]
  readingTime: number | string
  featuredImage: string
  thumbnailImage: string
  contentImage: string
  projectType: string
  projectStatus: string
  githubUrl: string
  liveUrl: string
  techStack: string[]
  featured?: boolean
}

// Function to read content directory - used in development only
export async function getContentList<T>(type: ContentType): Promise<T[]> {
  // In production, this function should be replaced with a GraphQL query to DynamoDB
  // Check process environment to ensure we're not in production
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Warning: Using content-loader in production. Content should come from DynamoDB via GraphQL.'
    )
    // Return empty array in production - no fallbacks
    return []
  }

  const contentDir = path.join(process.cwd(), 'content', type)
  console.log(`Development mode: Loading content from: ${contentDir}`)

  try {
    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      console.warn(`Content directory not found: ${contentDir}`)
      // No fallbacks - return empty array
      return []
    }

    const files = fs.readdirSync(contentDir)
    console.log(`Found ${files.length} files in ${type} directory`)

    const markdownFiles = files.filter((file) => file.endsWith('.md'))
    console.log(
      `Found ${markdownFiles.length} markdown files in ${type} directory`
    )

    if (markdownFiles.length === 0) {
      console.warn(`No markdown files found in ${contentDir}`)
      // No fallbacks - return empty array
      return []
    }

    const contentList = markdownFiles.map((fileName) => {
      const filePath = path.join(contentDir, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const slug = fileName.replace('.md', '')

      // For blog posts, ensure consistency between datePublished and publishDate
      if (type === 'blog') {
        // Use datePublished as the primary field, fall back to publishDate
        if (!data.datePublished && data.publishDate) {
          data.datePublished = data.publishDate
        } else if (!data.publishDate && data.datePublished) {
          data.publishDate = data.datePublished
        }

        // Generate ID from slug if not provided
        if (!data.id) {
          data.id = slug
        }
      }

      return {
        ...data,
        content,
        slug
      } as T
    })

    // Filter out drafts or unpublished content
    const publishedContent = contentList.filter((item) => {
      const contentItem = item as { status?: string }
      const status = (contentItem.status || '').toLowerCase()
      return status === 'published' || status === 'PUBLISHED'
    })

    console.log(`Found ${publishedContent.length} published ${type} items`)

    // Return exactly what we found, no additional content
    return publishedContent
  } catch (error) {
    console.error(`Error reading content: ${error}`)
    // Return empty array on error - no fallbacks
    return []
  }
}

// Function to get a specific content item by slug - used in development only
export async function getContentBySlug<T>(
  type: ContentType,
  slug: string
): Promise<T | null> {
  // In production, this function should be replaced with a GraphQL query to DynamoDB
  // Check process environment to ensure we're not in production
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Warning: Using content-loader in production. Content should come from DynamoDB via GraphQL.'
    )
    // Return null in production - no fallbacks
    return null
  }

  const contentDir = path.join(process.cwd(), 'content', type)
  const filePath = path.join(contentDir, `${slug}.md`)

  console.log('Development mode: Looking for file:', filePath)

  try {
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath)
      // Return null if file doesn't exist - no fallbacks
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    console.log(
      'File found and parsed, frontmatter:',
      Object.keys(data).join(', ')
    )

    // For blog posts, ensure consistency between datePublished and publishDate
    if (type === 'blog') {
      // Use datePublished as the primary field, fall back to publishDate
      if (!data.datePublished && data.publishDate) {
        data.datePublished = data.publishDate
      } else if (!data.publishDate && data.datePublished) {
        data.publishDate = data.datePublished
      }

      // Generate ID from slug if not provided
      if (!data.id) {
        data.id = slug
      }
    }

    // Return exactly what we read from the file - no extra data
    return {
      ...data,
      content,
      slug
    } as T
  } catch (error) {
    console.error(`Error reading content: ${error}`)
    console.log(
      'Error details:',
      error instanceof Error ? error.message : String(error)
    )
    // Return null on error - no fallbacks
    return null
  }
}

// Import content from legacy app - development use only
export async function importLegacyContent(type: ContentType): Promise<void> {
  // Only allow this function to work in development mode
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Warning: importLegacyContent should not be used in production'
    )
    return
  }

  const legacyDir = path.join(process.cwd(), 'legacy.app', type)
  const targetDir = path.join(process.cwd(), 'content', type)

  try {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // Read legacy directory
    const files = fs.readdirSync(legacyDir)
    const markdownFiles = files.filter((file) => file.endsWith('.md'))

    // Copy each file
    markdownFiles.forEach((fileName) => {
      const sourcePath = path.join(legacyDir, fileName)
      const targetPath = path.join(targetDir, fileName)

      fs.copyFileSync(sourcePath, targetPath)
      console.log(`Imported ${fileName}`)
    })

    console.log(`Successfully imported ${markdownFiles.length} ${type} files`)
  } catch (error) {
    console.error(`Error importing legacy content: ${error}`)
  }
}
