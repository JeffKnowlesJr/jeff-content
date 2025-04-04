import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
      <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
        Page Not Found
      </h1>
      <p className='text-xl text-gray-600 dark:text-gray-400 mb-8'>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href='/blog'
        className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
      >
        Return to Blog
      </Link>
    </div>
  )
}
