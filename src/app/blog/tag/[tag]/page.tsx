import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogPostList from '@/components/blog/BlogPostList'
import BlogPagination from '@/components/blog/BlogPagination'
import { generateTagMetadata } from '@/utils/metadata'

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

function getTagPosts(tag: string): BlogPost[] {
  const allPosts = BlogPostList({}).props.posts || []
  return allPosts.filter((post: BlogPost) =>
    post.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
  )
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const tag = params.tag
  const posts = getTagPosts(tag)

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
      description: 'The requested blog tag could not be found.'
    }
  }

  return generateTagMetadata(tag)
}

export default function BlogTagPage({ params, searchParams }: PageProps) {
  const tag = params.tag
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 6

  const tagPosts = getTagPosts(tag)
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
