import Link from 'next/link'
import { Metadata } from 'next'
import BlogLayout from '@/components/blog/BlogLayout'
import { getContentList, BlogPost } from '@/utils/content-loader'

export const metadata: Metadata = {
  title: 'Blog Categories',
  description: 'Browse all categories in the Jeff Knowles Jr blog.',
  robots: {
    index: true,
    follow: true
  }
}

export default async function BlogCategoriesPage() {
  const posts = await getContentList<BlogPost>('blog')

  // Extract categories from posts (using tags as categories for now)
  const categoriesMap = new Map<string, number>()

  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        const category = tag.trim()
        const count = categoriesMap.get(category) || 0
        categoriesMap.set(category, count + 1)
      })
    }
  })

  // Convert to array and sort by name
  const categories = Array.from(categoriesMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <BlogLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse all categories in the blog
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/tag/${category.slug}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {category.count} post{category.count === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}
