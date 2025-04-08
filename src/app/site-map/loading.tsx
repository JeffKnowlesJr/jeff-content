export default function SitemapLoading() {
  return (
    <main className='min-h-screen bg-white dark:bg-gray-900 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Title */}
        <div className='h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8' />

        <div className='space-y-12'>
          {/* Main Pages Section */}
          <section>
            <div className='h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
            <div className='grid gap-6 md:grid-cols-2'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='p-6 bg-gray-50 dark:bg-gray-800 rounded-lg'
                >
                  <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                  <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </section>

          {/* Blog Section */}
          <section>
            <div className='h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
            <div className='grid gap-6 md:grid-cols-2'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='p-6 bg-gray-50 dark:bg-gray-800 rounded-lg'
                >
                  <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                  <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </section>

          {/* Development Log Section */}
          <section>
            <div className='h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='p-6 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section>
            <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
            <div className='grid gap-6 md:grid-cols-2'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='p-6 bg-gray-50 dark:bg-gray-800 rounded-lg'
                >
                  <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                  <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <div className='h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        </div>
      </div>
    </main>
  )
}
