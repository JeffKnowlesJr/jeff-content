import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogPostList from '@/components/blog/BlogPostList'
import BlogPagination from '@/components/blog/BlogPagination'
import { generateTagMetadata } from '@/utils/metadata'
import {
  getContentList,
  BlogPost as ContentBlogPost
} from '@/utils/content-loader'

// Define the interface expected by the BlogPostList component
interface BlogPost {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

interface PageProps {
  params: { tag: string }
  searchParams: Record<string, string | string[] | undefined>
}

async function getTagPosts(tag: string): Promise<BlogPost[]> {
  try {
    // Get all blog posts
    const allPosts = await getContentList<ContentBlogPost>('blog')

    // Filter by tag (case-insensitive) and map to expected format
    return allPosts
      .filter((post) =>
        post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        publishDate:
          post.datePublished || post.publishDate || new Date().toISOString(),
        author: post.author,
        readingTime:
          typeof post.readingTime === 'number'
            ? `${post.readingTime} min read`
            : post.readingTime || '5 min read',
        featuredImage:
          post.featuredImage || post.image || '/images/blog/default-post.jpg',
        tags: post.tags || []
      }))
  } catch (error) {
    console.error('Error fetching posts for tag:', tag, error)
    return []
  }
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const tag = params.tag
  const posts = await getTagPosts(tag)

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
      description: 'The requested blog tag could not be found.'
    }
  }

  return generateTagMetadata(tag)
}

export default async function BlogTagPage({ params, searchParams }: PageProps) {
  const tag = params.tag
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 6

  const tagPosts = await getTagPosts(tag)
  if (tagPosts.length === 0) {
    notFound()
  }

  const totalPages = Math.ceil(tagPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = tagPosts.slice(startIndex, endIndex)

  return (
    <BlogLayout>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Posts tagged with &quot;{tag}&quot;
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            {tagPosts.length} post{tagPosts.length === 1 ? '' : 's'}
          </p>
        </div>
        <BlogPostList posts={paginatedPosts} />
        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/blog/tag/${tag}`}
          />
        )}
      </div>
    </BlogLayout>
  )
}
