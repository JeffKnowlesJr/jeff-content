import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Marketing Guide',
  description:
    'Download our comprehensive marketing guide for web developers and digital professionals.',
  robots: {
    index: true,
    follow: true
  }
}

export default function MarketingGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Web Development Marketing Guide
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Comprehensive strategies for marketing your web development
                services
              </p>
            </div>

            <div className="mt-10">
              <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                <div className="sm:flex sm:items-start">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Marketing-Guide-2024.pdf
                    </div>
                    <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                      <div>4.2MB PDF document</div>
                      <span
                        className="hidden sm:mx-2 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>
                      <div className="mt-1 sm:mt-0">Updated April 2024</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <a
                    href="/downloads/Marketing-Guide-2024.pdf"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 prose prose-blue max-w-none">
              <h2>What's Inside This Guide?</h2>
              <p>
                Our comprehensive marketing guide provides actionable strategies
                and techniques specifically for web developers and digital
                professionals looking to grow their business and attract more
                clients.
              </p>
              <ul>
                <li>Client acquisition strategies for web developers</li>
                <li>Building a professional portfolio that converts</li>
                <li>
                  Effective social media approaches for technical professionals
                </li>
                <li>Content marketing that showcases your expertise</li>
                <li>Pricing strategies and proposal templates</li>
              </ul>
              <p>
                This 45-page resource is designed to help you translate your
                technical skills into a thriving business with a steady stream
                of quality clients.
              </p>
            </div>
          </div>
          <div className="px-6 py-8 bg-gray-50 sm:px-10">
            <p className="text-xs leading-5 text-gray-500">
              By downloading this guide, you agree to our{' '}
              <Link
                href="/privacy-policy"
                className="font-medium text-gray-900 hover:underline"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="/terms"
                className="font-medium text-gray-900 hover:underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
