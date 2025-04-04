export default function ProjectsLoading() {
  return (
    <main className='min-h-screen bg-white dark:bg-gray-900 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-4' />
          <div className='h-16 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto' />
        </div>

        {/* Featured Projects */}
        <section className='mb-16'>
          <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8' />
          <div className='grid gap-8 md:grid-cols-2'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg'
              >
                <div className='h-64 bg-gray-200 dark:bg-gray-700 animate-pulse' />
                <div className='p-6'>
                  <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4' />
                  <div className='h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4' />
                  <div className='flex flex-wrap gap-2'>
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Projects */}
        <section>
          <div className='h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8' />
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow'
              >
                <div className='h-48 bg-gray-200 dark:bg-gray-700 animate-pulse' />
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                    <div className='h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                  </div>
                  <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4' />
                  <div className='flex flex-wrap gap-2'>
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
