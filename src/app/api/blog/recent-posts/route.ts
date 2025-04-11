import { NextResponse } from 'next/server'
import { getContentList, BlogPost } from '@/utils/content-loader'
import { fetchAllBlogPosts } from '@/services/blogApi'

export async function GET() {
  let posts: BlogPost[] = []
  let notice: string | null = null

  // In production, use GraphQL to fetch from DynamoDB
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log(
        'Production mode: Fetching blog posts from DynamoDB via GraphQL API'
      )
      posts = await fetchAllBlogPosts()
    } catch (error) {
      console.error('Error fetching blog posts from DynamoDB:', error)
      notice = 'Error fetching blog posts from DynamoDB'
    }
  } else {
    // Development only: Load posts from the content directory
    console.log('Development mode: Loading posts from content directory')
    posts = await getContentList<BlogPost>('blog')
  }

  // Sort by date, newest first
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.datePublished || a.publishDate || '').getTime()
    const dateB = new Date(b.datePublished || b.publishDate || '').getTime()
    return dateB - dateA
  })

  // Extract tags and count posts per tag
  const categoryCount: { [key: string]: number } = {}
  posts.forEach((post) => {
    // Process tags
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        categoryCount[tag] = (categoryCount[tag] || 0) + 1
      })
    }
  })

  // Get the latest 3 posts
  const recentPosts = sortedPosts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    publishDate: post.datePublished || post.publishDate || ''
  }))

  // Return data as JSON
  return NextResponse.json({
    notice,
    recentPosts,
    categories: categoryCount
  })
}
