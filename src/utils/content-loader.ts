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

// Function to read content directory
export async function getContentList<T>(type: ContentType): Promise<T[]> {
  const contentDir = path.join(process.cwd(), 'content', type)

  try {
    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      console.warn(`Content directory not found: ${contentDir}`)
      return []
    }

    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith('.md'))

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
    return contentList.filter((item) => {
      const contentItem = item as { status?: string }
      return contentItem.status === 'published'
    })
  } catch (error) {
    console.error(`Error reading content: ${error}`)
    return []
  }
}

// Function to get a specific content item by slug
export async function getContentBySlug<T>(
  type: ContentType,
  slug: string
): Promise<T | null> {
  const contentDir = path.join(process.cwd(), 'content', type)
  const filePath = path.join(contentDir, `${slug}.md`)

  console.log('Content loader - Looking for file:', filePath)
  console.log('Content loader - Does file exist?', fs.existsSync(filePath))

  try {
    if (!fs.existsSync(filePath)) {
      console.log('Content loader - File not found:', filePath)
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    console.log(
      'Content loader - File found and parsed, frontmatter:',
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

    return {
      ...data,
      content,
      slug
    } as T
  } catch (error) {
    console.error(`Error reading content: ${error}`)
    console.log(
      'Content loader - Error details:',
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

// Import content from legacy app
export async function importLegacyContent(type: ContentType): Promise<void> {
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
