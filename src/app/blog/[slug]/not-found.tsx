import Link from 'next/link'

export default function BlogPostNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center'>
      <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
        Post Not Found
      </h1>
      <p className='text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md'>
        The blog post you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href='/blog'
        className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
      >
        Return to Blog
      </Link>
    </div>
  )
}
