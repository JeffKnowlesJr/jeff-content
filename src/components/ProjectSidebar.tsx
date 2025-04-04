import React from 'react'
import { useProjects } from '../hooks/useProjects'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorDisplay } from './ErrorDisplay'
import { ProjectList } from './ProjectList'

const ProjectSidebar: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorDisplay error={error} />

  return <ProjectList projects={projects ?? []} />
}

export default ProjectSidebar
