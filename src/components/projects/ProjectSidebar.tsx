import React from 'react'
import Link from 'next/link'

// Get list of technologies from projects
function getTechnologies(): string[] {
  // Hard-coded list for now - would be generated from projects in production
  return [
    'React',
    'Next.js',
    'TypeScript',
    'AWS AppSync',
    'DynamoDB',
    'Terraform',
    'CloudFront',
    'Tailwind CSS',
    'GitHub Actions',
    'CI/CD',
    'Docker',
    'Lambda@Edge',
    'Cognito',
    'S3',
    'CloudWatch',
    'Turborepo'
  ].sort()
}

// Get list of project categories
function getCategories(): string[] {
  return [
    'Full-Stack Applications',
    'Infrastructure & DevOps',
    'Cloud Architecture',
    'Build Systems',
    'Frontend Development',
    'Multi-Site Architecture',
    'AWS Deployments'
  ].sort()
}

// Get popular project examples
function getPopularProjects() {
  return [
    {
      title: 'Project Zero: Full-Stack Portfolio',
      slug: 'project-zero-documentation'
    },
    {
      title: 'Project Omega: Multi-Site Architecture',
      slug: 'project-omega'
    },
    {
      title: 'Project Omega: Build System & Deployment',
      slug: 'project-omega-build-manual'
    }
  ]
}

export default function ProjectSidebar() {
  const technologies = getTechnologies()
  const categories = getCategories()
  const popularProjects = getPopularProjects()

  return (
    <aside className="space-y-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Popular Projects
        </h2>
        <ul className="space-y-5">
          {popularProjects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {project.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Categories
        </h2>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/projects?category=${encodeURIComponent(
                  category.toLowerCase()
                )}`}
                className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center"
              >
                <span className="mr-2">•</span>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Technologies
        </h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Link
              key={tech}
              href={`/projects?tech=${encodeURIComponent(tech.toLowerCase())}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
            >
              {tech}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          GitHub
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Check out my open-source projects and contributions on GitHub.
        </p>
        <a
          href="https://github.com/jeffknowles"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <svg
            className="mr-2 -ml-1 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          View GitHub Profile
        </a>
      </div>
    </aside>
  )
}
