import Link from 'next/link'

export default function SitemapNotFound() {
  return (
    <main className='min-h-screen bg-white dark:bg-gray-900 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Page Not Found
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href='/sitemap'
          className='inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Back to Sitemap
        </Link>
      </div>
    </main>
  )
}
