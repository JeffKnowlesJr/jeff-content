import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogPostList from '@/components/blog/BlogPostList'
import BlogPagination from '@/components/blog/BlogPagination'

interface BlogPost {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

interface BlogCategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    page?: string
  }
}

function getCategoryPosts(category: string): BlogPost[] {
  const allPosts = BlogPostList({}).props.posts || []
  return allPosts.filter((post: BlogPost) =>
    post.tags.some(
      (tag: string) => tag.toLowerCase() === category.toLowerCase()
    )
  )
}

export async function generateMetadata({
  params
}: BlogCategoryPageProps): Promise<Metadata> {
  const category = params.category
  const posts = getCategoryPosts(category)

  if (posts.length === 0) {
    return {
      title: 'Category Not Found | Jeff Knowles Jr.',
      description: 'The requested blog category could not be found.'
    }
  }

  return {
    title: `${category} | Blog Categories | Jeff Knowles Jr.`,
    description: `Browse all blog posts in the ${category} category.`
  }
}

export default function BlogCategoryPage({
  params,
  searchParams
}: BlogCategoryPageProps) {
  const category = params.category
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 6

  const categoryPosts = getCategoryPosts(category)
  if (categoryPosts.length === 0) {
    notFound()
  }

  const totalPages = Math.ceil(categoryPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = categoryPosts.slice(startIndex, endIndex)

  return (
    <BlogLayout>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            {category}
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            {categoryPosts.length} post{categoryPosts.length === 1 ? '' : 's'}
          </p>
        </div>
        <BlogPostList posts={paginatedPosts} />
        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/blog/category/${category}`}
          />
        )}
      </div>
    </BlogLayout>
  )
}
