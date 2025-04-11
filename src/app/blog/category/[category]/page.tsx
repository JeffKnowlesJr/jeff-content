import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogPostList from '@/components/blog/BlogPostList'
import BlogPagination from '@/components/blog/BlogPagination'
import { generateCategoryMetadata } from '@/utils/metadata'
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
  params: { category: string }
  searchParams: Record<string, string | string[] | undefined>
}

async function getCategoryPosts(category: string): Promise<BlogPost[]> {
  try {
    // Decode the category parameter to handle URL encoding
    const decodedCategory = decodeURIComponent(category.toLowerCase())

    // Get all blog posts
    const allPosts = await getContentList<ContentBlogPost>('blog')

    // For simplicity, we're using tags as categories
    // Filter by category (case-insensitive) and map to expected format
    return allPosts
      .filter((post) =>
        post.tags?.some((t) => {
          // Handle tags with slashes - CI/CD would be stored as either "CI/CD" or "ci/cd"
          const normalizedTag = t.toLowerCase().replace(/\s+/g, '')
          const normalizedCategory = decodedCategory.replace(/\s+/g, '')

          return (
            normalizedTag === normalizedCategory ||
            normalizedTag.replace(/\//g, '') ===
              normalizedCategory.replace(/\//g, '') ||
            t.toLowerCase() === decodedCategory
          )
        })
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
    console.error('Error fetching posts for category:', category, error)
    return []
  }
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const category = params.category
  const posts = await getCategoryPosts(category)

  if (posts.length === 0) {
    return {
      title: 'Category Not Found',
      description: 'The requested blog category could not be found.'
    }
  }

  return generateCategoryMetadata(
    category,
    `Browse all blog posts in the ${category} category.`
  )
}

export default async function BlogCategoryPage({
  params,
  searchParams
}: PageProps) {
  const category = params.category
  const currentPage = Number(searchParams.page) || 1
  const postsPerPage = 6

  const categoryPosts = await getCategoryPosts(category)
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
