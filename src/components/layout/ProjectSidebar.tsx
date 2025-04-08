'use client'

import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '../../services/projectService'
import { Project } from '../../types/project'
import Link from 'next/link'

interface ProjectSidebarProps {
  onLinkClick?: () => void
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ onLinkClick }) => {
  const { theme } = useTheme()
  const { isLoading, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.listProjects()
  })

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const textColorDimmer = theme === 'dark' ? 'text-white/70' : 'text-gray-500'

  const getIconForProject = (projectType: string) => {
    switch (projectType?.toLowerCase()) {
      case 'full-stack web application':
        return 'fas fa-code text-purple-600'
      case 'mobile app':
        return 'fas fa-mobile-alt text-purple-600'
      case 'desktop app':
        return 'fas fa-desktop text-purple-600'
      default:
        return 'fas fa-project-diagram text-purple-600'
    }
  }

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
        <div className='space-y-1'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-8 bg-gray-200 dark:bg-gray-700 rounded'
            ></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h3
          className={`text-lg font-bold ${textColor} mb-4 tracking-tight transition-colors duration-300`}
        >
          Projects
        </h3>
        <div className='text-sm text-red-500 dark:text-red-400'>
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </div>
      </div>
    )
  }

  const projects =
    data
      ?.filter(
        (project: Partial<Project>): project is Partial<Project> =>
          project !== null && project.status === 'PUBLISHED'
      )
      .sort((a, b) => a.title!.localeCompare(b.title!)) || []

  if (projects.length === 0) {
    return (
      <div>
        <h3
          className={`text-lg font-bold ${textColor} mb-4 tracking-tight transition-colors duration-300`}
        >
          Projects
        </h3>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          No projects found
        </div>
      </div>
    )
  }

  return (
    <div className='transition-colors duration-300'>
      <h3
        className={`text-lg font-bold ${textColor} mb-3 tracking-tight transition-colors duration-300`}
      >
        Projects
      </h3>
      <div className='space-y-1'>
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            onClick={onLinkClick}
            className={`block text-sm ${textColorDimmer} hover:text-purple-600 transition-colors min-h-[28px] flex items-center group`}
          >
            <i
              className={`${getIconForProject(
                project.projectType!
              )} mr-2 group-hover:text-purple-600 transition-colors`}
            ></i>
            <span className='font-medium'>{project.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProjectSidebar
