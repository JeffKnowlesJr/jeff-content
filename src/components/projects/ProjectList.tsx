'use client'

import React from 'react'
import Link from 'next/link'
import { SimpleCard } from '../../components/common/SimpleCard'
import { Project } from '../../types/project'
import { normalizeImagePath } from '../../utils/imageUtils'

interface ProjectListProps {
  projects: Project[]
}

// Debug mode - set to false to disable logging
const DEBUG = false

const debug = {
  log: (...args: unknown[]) => {
    if (DEBUG) {
      console.log('[ProjectList]', ...args)
    }
  }
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  debug.log('Rendering with projects:', projects.length)

  if (!projects || projects.length === 0) {
    debug.log('No projects available')
    return <div>No projects found.</div>
  }

  return (
    <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full overflow-hidden'>
      {projects.map((project) => {
        const imageUrl = project.featuredImage
          ? normalizeImagePath(project.featuredImage)
          : 'https://placehold.co/800x450?text=No+Image'

        return (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className='h-full'
          >
            <div className='h-full transition-transform hover:-translate-y-1 duration-200'>
              <SimpleCard className='h-full overflow-hidden'>
                <article className='flex flex-col h-full'>
                  <div className='relative pb-[56.25%] mb-5 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className='absolute inset-0 w-full h-full object-cover'
                      onError={(e) => {
                        // Fall back to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        debug.log(`Image failed to load: ${target.src}`)
                        target.src =
                          'https://placehold.co/800x450?text=No+Image'
                        target.onerror = null // Prevent infinite error loop
                      }}
                    />
                  </div>
                  <div className='flex flex-col flex-1'>
                    <h2 className='text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2'>
                      {project.title}
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 flex-1'>
                      {project.excerpt}
                    </p>
                    <div className='mt-auto space-y-2'>
                      <div className='flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-1'>
                        <span className='font-medium'>{project.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(project.publishedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className='capitalize'>
                          {project.projectStatus
                            .replace('_', ' ')
                            .toLowerCase()}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className='px-2 py-0.5 text-xs bg-gray-100/60 dark:bg-gray-700/60 rounded-full text-gray-600 dark:text-gray-300'
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className='px-2 py-0.5 text-xs bg-gray-100/60 dark:bg-gray-700/60 rounded-full text-gray-600 dark:text-gray-300'>
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                      {(project.githubUrl || project.liveUrl) && (
                        <div className='flex gap-2 mt-2'>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs px-2 py-1 bg-gray-800 text-white rounded flex items-center'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className='fab fa-github mr-1'></i> GitHub
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs px-2 py-1 bg-primary text-white rounded flex items-center'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className='fas fa-external-link-alt mr-1'></i>{' '}
                              Live
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </SimpleCard>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
