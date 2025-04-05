import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { Project, getContentBySlug } from '@/utils/content-loader'
import { generateProjectSchema } from '@/utils/schema'
import { generateProjectMetadata } from '@/utils/metadata'
import ExternalLink from '@/components/projects/ExternalLink'

interface PageProps {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

// Generate metadata for the project page
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const project = await getContentBySlug<Project>('projects', params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }

  return generateProjectMetadata(project)
}

// Project detail page component
export default async function ProjectDetailPage({ params }: PageProps) {
  // Get project from the slug
  const project = await getContentBySlug<Project>('projects', params.slug)

  // If not found, show 404
  if (!project) {
    notFound()
  }

  // Generate structured data for JSON-LD
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'
  const canonicalUrl = `${baseUrl}/projects/${params.slug}`
  const jsonLd = generateProjectSchema(project, canonicalUrl)

  // GitHub icon SVG
  const GitHubIcon = (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'
      />
    </svg>
  )

  // Demo icon SVG
  const DemoIcon = (
    <svg
      className='w-5 h-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
      />
    </svg>
  )

  return (
    <div className='min-h-screen'>
      <Script
        id='project-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12'>
        <Link
          href='/projects'
          className='inline-flex items-center text-primary dark:text-primary-light hover:underline mb-4 sm:mb-8 text-base sm:text-lg'
        >
          <svg
            className='mr-2 w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Projects
        </Link>

        <article className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
          <div className='p-4 sm:p-8 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700'>
            <header>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                {project.title}
              </h1>

              <div className='flex flex-wrap gap-3 mb-6'>
                {project.techStack &&
                  project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm sm:text-base'
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </header>
          </div>

          {project.featuredImage && (
            <div className='w-full relative max-h-[500px] overflow-hidden'>
              <img
                src={
                  project.featuredImage ||
                  project.contentImage ||
                  project.thumbnailImage
                }
                alt={project.title}
                className='object-cover w-full'
              />
            </div>
          )}

          <div className='p-4 sm:p-8 bg-white dark:bg-gray-800'>
            <div className='flex flex-wrap gap-4 mb-6 sm:mb-8'>
              {project.liveUrl && (
                <ExternalLink
                  href={project.liveUrl}
                  className='inline-flex items-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors text-base sm:text-lg'
                  icon={DemoIcon}
                >
                  View Live Demo
                </ExternalLink>
              )}

              {project.githubUrl && (
                <ExternalLink
                  href={project.githubUrl}
                  className='inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors text-base sm:text-lg'
                  icon={GitHubIcon}
                >
                  View on GitHub
                </ExternalLink>
              )}
            </div>

            <div className='mt-8 prose dark:prose-invert max-w-none'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <div className='mt-6 sm:mt-8 flex justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700'>
          <Link
            href='/projects'
            className='text-primary dark:text-primary-light hover:underline inline-flex items-center text-base sm:text-lg'
          >
            <svg
              className='mr-2 w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Projects
          </Link>

          <div className='flex gap-4'>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                project.title
              )}&url=${encodeURIComponent(
                `https://jeffknowlesjr.com/projects/${project.slug}`
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-600'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.01 10.01 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z' />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://jeffknowlesjr.com/projects/${project.slug}`
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
