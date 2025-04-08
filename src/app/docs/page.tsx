import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Technical documentation and resources for projects by Jeff Knowles Jr.',
  robots: {
    index: true,
    follow: true
  }
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Documentation
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Technical resources and guides for developers
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Zero Documentation */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Project Documentation
                  </p>
                  <Link
                    href="/projects/project-zero-documentation"
                    className="block mt-2"
                  >
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Project Zero
                    </p>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300">
                      Complete documentation for the Project Zero framework,
                      including installation, configuration, and advanced usage
                      guides.
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">Jeff Knowles Jr</span>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                        JK
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Jeff Knowles Jr
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime="2024-04-01">Apr 1, 2024</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>15 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Omega Documentation */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Project Documentation
                  </p>
                  <Link
                    href="/projects/project-omega-documentation"
                    className="block mt-2"
                  >
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Project Omega
                    </p>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300">
                      Development documentation for Project Omega, including API
                      references, component guides, and integration examples.
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">Jeff Knowles Jr</span>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                        JK
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Jeff Knowles Jr
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime="2024-03-15">Mar 15, 2024</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>20 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Documentation */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    API Reference
                  </p>
                  <Link href="/docs/api" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      API Documentation
                    </p>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300">
                      Comprehensive API reference documentation for services and
                      endpoints, including authentication, parameters, and
                      examples.
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">Jeff Knowles Jr</span>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                        JK
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Jeff Knowles Jr
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime="2024-02-22">Feb 22, 2024</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>Updated regularly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
