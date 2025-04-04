import { Metadata } from 'next'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogPostList from '@/components/blog/BlogPostList'

export const metadata: Metadata = {
  title: 'Search Blog Posts | Jeff Knowles Jr.',
  description:
    'Search through our blog posts about web development, programming, and technology.'
}

interface BlogPost {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

interface BlogSearchPageProps {
  searchParams: {
    q?: string
  }
}

function searchBlogPosts(query: string, posts: BlogPost[]) {
  if (!query) return posts

  const searchTerms = query.toLowerCase().split(' ')
  return posts.filter((post) => {
    const searchableText = `
      ${post.title.toLowerCase()}
      ${post.author.toLowerCase()}
      ${post.tags.join(' ').toLowerCase()}
    `

    return searchTerms.every((term) => searchableText.includes(term))
  })
}

export default function BlogSearchPage({ searchParams }: BlogSearchPageProps) {
  const query = searchParams.q || ''
  const allPosts = BlogPostList({}).props.posts || []
  const searchResults = searchBlogPosts(query, allPosts)

  return (
    <BlogLayout>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Search Results
          </h1>
          {query && (
            <p className='text-gray-600 dark:text-gray-400'>
              Found {searchResults.length} results for &quot;{query}&quot;
            </p>
          )}
        </div>
        {searchResults.length > 0 ? (
          <BlogPostList posts={searchResults} />
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-600 dark:text-gray-400'>
              No results found for &quot;{query}&quot;
            </p>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
