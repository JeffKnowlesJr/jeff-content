export default function BlogPostLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
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
          <article className='prose prose-lg dark:prose-invert max-w-none'>
            <header className='mb-10 text-center'>
              <div className='h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-6 animate-pulse' />
              <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
                <div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                <div className='h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
                <div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                <div className='h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
                <div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
              </div>
              <div className='relative w-full max-w-4xl mx-auto aspect-video mb-10 rounded-xl overflow-hidden'>
                <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse' />
              </div>
              <div className='flex flex-wrap justify-center gap-2 mb-10'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'
                  />
                ))}
              </div>
            </header>
            <div className='max-w-3xl mx-auto space-y-6'>
              {[...Array(10)].map((_, i) => (
                <div key={i} className='space-y-4'>
                  <div className='h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                  <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                  <div className='h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                </div>
              ))}
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}
