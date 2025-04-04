export default function ProjectLoading() {
  return (
    <main className='min-h-screen bg-white dark:bg-gray-900 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12'>
          <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8' />
          <div className='h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8' />
          <div className='max-w-3xl'>
            <div className='h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
            <div className='h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6' />
            <div className='flex flex-wrap gap-2 mb-8'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'
                />
              ))}
            </div>
            <div className='flex gap-4'>
              <div className='h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
              <div className='h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='grid gap-12 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-12'>
            {/* Overview */}
            <section>
              <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
              <div className='h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
            </section>

            {/* Challenge & Solution */}
            <section className='grid gap-8 md:grid-cols-2'>
              <div>
                <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
                <div className='h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
              </div>
              <div>
                <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
                <div className='h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
              </div>
            </section>

            {/* Features */}
            <section>
              <div className='h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6' />
              <div className='grid gap-8'>
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className='h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
                    <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2' />
                    <div className='h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
                  </div>
                ))}
              </div>
            </section>

            {/* Results */}
            <section>
              <div className='h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4' />
              <div className='h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
            </section>
          </div>

          <div className='space-y-12'>
            {/* Technologies */}
            <section>
              <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6' />
              <div className='space-y-6'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
                  >
                    <div className='h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                    <div className='flex-1'>
                      <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                      <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6' />
              <div className='space-y-6'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='relative pl-6 pb-6 last:pb-0 before:content-[""] before:absolute before:left-[0.3125rem] before:top-2 before:bottom-0 before:w-px before:bg-gray-200 dark:before:bg-gray-700 last:before:hidden'
                  >
                    <div className='absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse' />
                    <div className='h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                    <div className='h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
                    <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
