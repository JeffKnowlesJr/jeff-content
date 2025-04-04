export default function BlogLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mb-12 text-center'>
        <div className='h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-6 animate-pulse' />
        <div className='h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-8 animate-pulse' />
        <div className='h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse' />
      </div>

      <div className='flex flex-col lg:flex-row gap-12'>
        <aside className='lg:w-1/4 order-2 lg:order-1'>
          <div className='sticky top-24 space-y-8'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-5 animate-pulse' />
              <div className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                    <div className='h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-5 animate-pulse' />
              <div className='space-y-3'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse'
                  />
                ))}
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-5 animate-pulse' />
              <div className='flex flex-wrap gap-2'>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
        <main className='lg:w-3/4 order-1 lg:order-2'>
          <div className='space-y-8'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
              >
                <div className='h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-700 animate-pulse' />
                <div className='p-6'>
                  <div className='h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse' />
                  <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse' />
                  <div className='flex flex-wrap gap-2'>
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
