import React from 'react'

export default function DevLogLoading() {
  return (
    <div className='py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='animate-pulse'>
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8'></div>

          <div className='space-y-12'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-16'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                    <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-24'></div>
                  </div>
                  <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4'></div>
                  <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-24'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
