import { NextResponse } from 'next/server'
import { getContentList, BlogPost } from '@/utils/content-loader'

export async function GET() {
  try {
    // Get all blog posts
    const posts = await getContentList<BlogPost>('blog')

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
      recentPosts,
      categories: categoryCount
    })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch blog data',
        recentPosts: [],
        categories: {}
      },
      { status: 500 }
    )
  }
}
