import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useReset } from '../contexts/ResetContext'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const { theme } = useTheme()
  const { resetApp } = useReset()

  const activeProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-4'>Active Projects</h2>
      {activeProjects.length === 0 ? (
        <p className='text-gray-500'>No active projects found.</p>
      ) : (
        <ul className='space-y-2'>
          {activeProjects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects/${project.slug}`}
                onClick={resetApp}
                className={`block p-2 rounded hover:bg-opacity-10 ${
                  theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
                }`}
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
