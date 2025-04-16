'use client'

import { useRouter } from 'next/navigation'
import BlogImage from '@/components/common/BlogImage'

interface BlogCardProps {
  id?: string
  title: string
  excerpt: string
  image: string
  author: string
  publishDate: string
  readingTime: string | number
  tags: string[]
  slug: string
}

export default function BlogCard({
  title,
  excerpt,
  image,
  author,
  publishDate,
  readingTime,
  tags,
  slug
}: BlogCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/blog/${slug}`)
  }

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Format reading time to string if it's a number
  const formattedReadingTime =
    typeof readingTime === 'number' ? `${readingTime} min read` : readingTime

  // Format date for different screen sizes
  const formatDate = (dateStr: string) => {
    // Default values if date is invalid
    const defaultDates = {
      fullDate: 'No date available',
      shortDate: 'No date'
    }

    if (!dateStr) return defaultDates

    try {
      const d = new Date(dateStr)

      // Check if date is valid
      if (isNaN(d.getTime())) return defaultDates

      // Full date for larger screens
      const fullDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Shortened date for mobile
      const shortDate = d.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
      })

      return { fullDate, shortDate }
    } catch (error) {
      console.error('Error formatting date:', error)
      return defaultDates
    }
  }

  const { fullDate, shortDate } = formatDate(publishDate)

  // Fallback image if none provided or if the URL is invalid
  const defaultImage = '/images/blog/default-post.jpg'
  const imageUrl = image || defaultImage

  return (
    <div
      onClick={handleCardClick}
      className='group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col'
    >
      <article className='h-full flex flex-col overflow-hidden relative'>
        {/* Image container with fixed aspect ratio */}
        <div className='aspect-[16/9] relative overflow-hidden'>
          <BlogImage
            src={imageUrl}
            alt={title}
            className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

          {/* Reading time badge */}
          <div className='absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full'>
            {formattedReadingTime}
          </div>
        </div>

        <div className='p-4 sm:p-6 flex-grow flex flex-col'>
          <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2'>
            {title}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3'>
            {excerpt}
          </p>
          <div className='mt-auto'>
            <div className='flex flex-wrap items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4'>
              <span className='truncate max-w-[100px] sm:max-w-[150px]'>
                {author}
              </span>
              <span className='mx-1 sm:mx-2'>•</span>
              <span className='hidden sm:inline'>{fullDate}</span>
              <span className='inline sm:hidden'>{shortDate}</span>
            </div>
            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className='px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-xs transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary-dark dark:group-hover:bg-primary-dark/30 dark:group-hover:text-primary-light truncate max-w-[80px] sm:max-w-[120px]'
                  onClick={handleTagClick}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className='px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-xs'>
                  +{tags.length - 2} more
                </span>
              )}
            </div>
            <div className='mt-3 sm:mt-4 text-primary dark:text-primary-light text-sm font-medium transition-all duration-200 group-hover:translate-x-1 flex items-center'>
              <span className='mr-1'>Read more</span>
              <svg
                className='w-3 h-3 sm:w-4 sm:h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14 5l7 7m0 0l-7 7m7-7H3'
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
