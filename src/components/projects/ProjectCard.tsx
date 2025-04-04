'use client'

import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  github: string
  slug: string
}

export default function ProjectCard({
  id,
  title,
  description,
  image,
  technologies,
  github,
  slug
}: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/projects/${slug}`)
  }

  const handleGitHubClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(github, '_blank', 'noopener,noreferrer')
  }

  const handleTechClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      key={id}
      onClick={handleCardClick}
      className='group transition-transform duration-200 hover:-translate-y-1 cursor-pointer'
    >
      <article className='card overflow-hidden shadow-lg rounded-lg bg-white dark:bg-gray-800 h-full flex flex-col transition-shadow duration-200 hover:shadow-xl'>
        <div className='aspect-video relative'>
          <img
            src={image || '/images/projects/analytics-dashboard.jpg'}
            alt={title}
            className='object-cover w-full h-full'
          />
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
        </div>
        <div className='p-6 flex-grow flex flex-col'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors'>
            {title}
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-4 flex-grow'>
            {description}
          </p>

          <div className='mt-auto'>
            <div className='flex flex-wrap gap-2 mb-4'>
              {technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className='px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700'
                  onClick={handleTechClick}
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className='px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700'>
                  +{technologies.length - 4} more
                </span>
              )}
            </div>

            <div className='flex gap-4'>
              <span className='text-primary dark:text-primary-light font-medium group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center'>
                View Details
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 ml-1 transition-transform group-hover:translate-x-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </span>

              <button
                className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center bg-transparent border-0 p-0 cursor-pointer font-inherit'
                onClick={handleGitHubClick}
              >
                GitHub
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 ml-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
