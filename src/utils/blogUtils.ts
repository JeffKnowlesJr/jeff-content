import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'

export interface BlogPost {
  id: string
  title: string
  date: string
  content: string
  excerpt: string
  coverImage: string
  author: {
    name: string
    picture: string
  }
  ogImage: {
    url: string
  }
  tags: string[]
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = join(process.cwd(), 'content/blog', `${slug}.md`)
    const fileContents = await readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const processedContent = await remark()
      .use(html)
      .use(prism)
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      id: slug,
      title: data.title,
      date: data.date,
      content: contentHtml,
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      author: {
        name: data.author?.name || 'Unknown',
        picture: data.author?.picture || ''
      },
      ogImage: {
        url: data.ogImage?.url || ''
      },
      tags: data.tags || []
    }
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error)
    return null
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}
