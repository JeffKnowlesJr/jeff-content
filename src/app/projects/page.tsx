import { Metadata } from 'next'
import { Project, getContentList } from '@/utils/content-loader'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectsLayout from '@/components/projects/ProjectsLayout'
import { generateProjectsIndexMetadata } from '@/utils/metadata'

// Generate metadata
export const metadata: Metadata = generateProjectsIndexMetadata()

// Define the project type as displayed in the UI
interface UIProject {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  github: string
  slug: string
}

// Get projects from our content loader
async function getProjects(): Promise<UIProject[]> {
  try {
    // Try to load projects from the content directory
    const projects = await getContentList<Project>('projects')

    // If we have content, return it with proper formatting
    if (projects && projects.length > 0) {
      return projects.map((project) => ({
        id: project.id || project.slug,
        title: project.title,
        description: project.excerpt,
        image: project.thumbnailImage || project.featuredImage,
        technologies: project.techStack || [],
        link: project.liveUrl,
        github: project.githubUrl,
        slug: project.slug
      }))
    }
  } catch (error) {
    console.error('Error loading projects from content:', error)
  }

  // Fallback to hardcoded projects
  return [
    {
      id: 'project-zero',
      title: 'Project Zero: Full-Stack Portfolio',
      description:
        'A modern full-stack portfolio website built with React, TypeScript, AWS, and Terraform. Features detailed architecture, security considerations, and best practices.',
      image: '/images/projects/portfolio-website.jpg',
      technologies: [
        'React',
        'TypeScript',
        'AWS AppSync',
        'DynamoDB',
        'Terraform',
        'Tailwind CSS'
      ],
      link: 'https://www.jeffknowles.dev',
      github: 'https://github.com/yourusername/project-zero',
      slug: 'project-zero-documentation'
    },
    {
      id: 'project-omega',
      title: 'Project Omega: Multi-Site Architecture',
      description:
        'A comprehensive case study on implementing a hybrid architecture that combines Next.js SSR for SEO-critical content with a React SPA for interactive functionalities.',
      image: '/images/projects/blog-cms.jpg',
      technologies: [
        'Next.js',
        'React',
        'TypeScript',
        'AWS AppSync',
        'DynamoDB',
        'Terraform',
        'CloudFront',
        'Cognito',
        'Tailwind CSS',
        'Turborepo'
      ],
      link: 'https://www.projectomega.dev',
      github: 'https://github.com/yourusername/project-omega',
      slug: 'project-omega'
    },
    {
      id: 'project-omega-build',
      title: 'Project Omega: Build System & Deployment',
      description:
        'A detailed technical guide to the build system, CI/CD pipeline, and deployment infrastructure for the Project Omega multi-site architecture.',
      image: '/images/projects/analytics-dashboard.jpg',
      technologies: [
        'GitHub Actions',
        'AWS CodePipeline',
        'Docker',
        'Terraform',
        'CloudFront',
        'Lambda@Edge',
        'CloudWatch',
        'S3'
      ],
      link: 'https://www.projectomega.dev/build',
      github: 'https://github.com/yourusername/project-omega-infrastructure',
      slug: 'project-omega-build-manual'
    }
  ]
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <ProjectsLayout>
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-4xl">
          Here are some of the projects I&apos;ve worked on. Each project
          represents a unique challenge and solution in web development, cloud
          architecture, and technical implementation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              github={project.github}
              slug={project.slug}
            />
          ))}
        </div>
      </div>
    </ProjectsLayout>
  )
}
