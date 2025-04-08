'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className='mb-12 text-center'>
      <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
        Blog
      </h1>
      <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
        Technical articles and insights about web development, cloud
        architecture, and analytics engineering.
      </p>

      <form onSubmit={handleSearch} className='max-w-md mx-auto'>
        <div className='relative'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search articles...'
            className='w-full px-4 py-3 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 shadow-sm'
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <button
            type='submit'
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium'
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}
