import React from 'react'
import Link from 'next/link'

export default function DevLogNotFound() {
  return (
    <div className='py-16'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Development Log Entry Not Found
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
          The development log entry you are looking for could not be found. It
          may have been moved or deleted.
        </p>
        <div className='flex justify-center'>
          <Link
            href='/dev-log'
            className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
          >
            Return to Development Log
          </Link>
        </div>
      </div>
    </div>
  )
}
