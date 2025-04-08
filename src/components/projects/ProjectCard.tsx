'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

  // Fallback image if none provided or if the URL is invalid
  const defaultImage = '/images/projects/portfolio-website.jpg'
  const imageUrl = image || defaultImage

  // Function to handle image loading error
  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`)
    // We can't directly set a new src in Next.js Image component on error
    // This would be handled by the fallback in the component
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
    >
      <article className="h-full flex flex-col overflow-hidden relative">
        {/* Image container with fixed aspect ratio */}
        <div className="aspect-[16/9] relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            priority
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 sm:p-6 flex-grow flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-xs transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary-dark dark:group-hover:bg-primary-dark/30 dark:group-hover:text-primary-light truncate max-w-[80px] sm:max-w-[120px]"
                  onClick={handleTechClick}
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-xs">
                  +{technologies.length - 3} more
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-primary dark:text-primary-light text-sm font-medium transition-all duration-200 group-hover:translate-x-1 flex items-center">
                <span className="mr-1">View Details</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>

              {github && (
                <button
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center bg-transparent border-0 p-0 cursor-pointer font-inherit text-sm"
                  onClick={handleGitHubClick}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                  GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
