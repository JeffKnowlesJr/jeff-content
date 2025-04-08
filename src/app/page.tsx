import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getContentList, BlogPost, Project } from '@/utils/content-loader'

export const metadata: Metadata = {
  title: 'Jeff Knowles Jr. | Analytics Engineer & Cloud Architect',
  description:
    'Full-stack analytics engineer and cloud architect specializing in modern web development, AWS, and scalable architectures.'
}

// Get latest blog post dynamically from content directory
async function getLatestBlogPost() {
  try {
    const posts = await getContentList<BlogPost>('blog')

    // Look for the Obsidian blog post first
    const obsidianPost = posts.find(
      (post) => post.slug === 'obsidian-for-developers'
    )

    if (obsidianPost) {
      return {
        slug: obsidianPost.slug,
        title: obsidianPost.title,
        excerpt: obsidianPost.excerpt,
        date: obsidianPost.datePublished || obsidianPost.publishDate || '',
        featuredImage: obsidianPost.featuredImage || obsidianPost.image || '',
        readingTime: obsidianPost.readingTime || 9
      }
    }

    // If not found, fall back to the newest post
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.datePublished || a.publishDate || '').getTime()
      const dateB = new Date(b.datePublished || b.publishDate || '').getTime()
      return dateB - dateA
    })

    // Return the newest post
    if (sortedPosts.length > 0) {
      const latestPost = sortedPosts[0]
      return {
        slug: latestPost.slug,
        title: latestPost.title,
        excerpt: latestPost.excerpt,
        date: latestPost.datePublished || latestPost.publishDate || '',
        featuredImage: latestPost.featuredImage || latestPost.image || '',
        readingTime: latestPost.readingTime || 5
      }
    }
  } catch (error) {
    console.error('Error fetching latest blog post:', error)
  }

  // Fallback data if no posts found
  return {
    slug: 'obsidian-for-developers',
    title: 'Obsidian for Developers: Building a Knowledge Management System',
    excerpt:
      'A comprehensive guide on how developers can use Obsidian to create an effective knowledge management system for code snippets, documentation, and technical notes.',
    date: '2025-03-30',
    featuredImage: '/images/blog/featured/responsive-design-principles.jpg',
    readingTime: 9
  }
}

// Get featured projects dynamically from content directory
async function getFeaturedProjects() {
  try {
    // Get all projects from content directory
    const allProjects = await getContentList<Project>('projects')

    // Filter projects that should be featured (you could add a 'featured: true' field in your markdown)
    // For now, just take the first 2 projects or all if less than 2
    const featuredProjects = allProjects.slice(0, 2)

    if (featuredProjects.length > 0) {
      return featuredProjects.map((project) => ({
        slug: project.slug,
        title: project.title,
        description: project.excerpt,
        image:
          project.featuredImage ||
          project.thumbnailImage ||
          '/images/projects/placeholder.jpg',
        technologies: Array.isArray(project.techStack)
          ? project.techStack
          : Array.isArray(project.tags)
          ? project.tags
          : []
      }))
    }
  } catch (error) {
    console.error('Error fetching featured projects:', error)
  }

  // Fallback data if no projects found
  return [
    {
      slug: 'project-zero-documentation',
      title: 'Project Zero Documentation',
      description: 'Comprehensive documentation for Project Zero.',
      image: '/images/projects/project-zero/cover.jpg',
      technologies: ['Documentation', 'Technical Writing', 'User Guides']
    },
    {
      slug: 'project-omega-documentation',
      title: 'Project Omega Documentation',
      description: 'Detailed documentation for Project Omega.',
      image: '/images/projects/project-omega/cover.jpg',
      technologies: ['Documentation', 'Technical Writing', 'API Reference']
    }
  ]
}

export default async function HomePage() {
  const latestPost = await getLatestBlogPost()
  const featuredProjects = await getFeaturedProjects()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/30 dark:to-secondary-dark/30 opacity-80"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          {/* Mobile-first layout - stack elements vertically */}
          <div className="block md:hidden text-center">
            {/* Image first on mobile */}
            <div className="mb-12">
              <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden shadow-xl group">
                {/* Large circle gradient background */}
                <div className="profile-bg-circle"></div>

                {/* Circle border */}
                <div className="absolute inset-0 border-[6px] border-primary dark:border-primary-light rounded-full z-10"></div>

                {/* Subtle radial overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20 dark:to-black/40 z-5 opacity-60"></div>

                {/* Image */}
                <Image
                  src="/images/jeff-profile.jpg"
                  alt="Jeff Knowles Jr."
                  fill
                  className="object-cover object-top z-0 transition-transform duration-300"
                  priority
                />
              </div>
            </div>

            {/* Text content below on mobile */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="whitespace-nowrap">Analytics Engineer</span>{' '}
                <span className="whitespace-nowrap">
                  <span className="text-white dark:text-white">&</span>{' '}
                  <span className="text-primary dark:text-primary-light">
                    Cloud Architect
                  </span>
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Building modern, scalable web applications with React, Next.js,
                and AWS. Focused on performance, user experience, and
                maintainable code.
              </p>
              <div className="flex justify-center flex-wrap gap-4">
                <Link href="/projects" className="btn btn-primary">
                  View Projects
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop layout - side by side */}
          <div className="hidden md:flex md:flex-row items-center max-w-7xl mx-auto">
            <div className="md:w-3/5">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="whitespace-nowrap">Analytics Engineer</span>{' '}
                <span className="whitespace-nowrap">
                  <span className="text-white dark:text-white">&</span>{' '}
                  <span className="text-primary dark:text-primary-light">
                    Cloud Architect
                  </span>
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Building modern, scalable web applications with React, Next.js,
                and AWS. Focused on performance, user experience, and
                maintainable code.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="btn btn-primary">
                  View Projects
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="md:w-2/5 flex justify-end items-center">
              <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-xl group">
                {/* Large circle gradient background */}
                <div className="profile-bg-circle-large"></div>

                {/* Circle border */}
                <div className="absolute inset-0 border-[8px] border-primary dark:border-primary-light rounded-full z-10"></div>

                {/* Subtle radial overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20 dark:to-black/40 z-5 opacity-60"></div>

                {/* Image */}
                <Image
                  src="/images/jeff-profile.jpg"
                  alt="Jeff Knowles Jr."
                  fill
                  className="object-cover object-top z-0 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 section-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white relative inline-block">
              <span className="relative z-10">Featured Projects</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary dark:bg-primary-light rounded-full"></span>
            </h2>
            <Link
              href="/projects"
              className="btn btn-primary text-sm sm:text-base py-2 px-4 sm:px-5 self-start"
            >
              View All Projects
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="badge bg-primary-light/20 dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Post Section */}
      <section className="py-20 section-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white relative inline-block">
              <span className="relative z-10">Latest from the Blog</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-secondary dark:bg-secondary-light rounded-full"></span>
            </h2>
            <Link
              href="/blog"
              className="btn btn-secondary text-sm sm:text-base py-2 px-4 sm:px-5 self-start"
            >
              View All Posts
            </Link>
          </div>
          <div className="card flex flex-col md:flex-row gap-8 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {latestPost.featuredImage && (
              <div className="md:w-1/2">
                <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
                  <Image
                    src={latestPost.featuredImage}
                    alt={latestPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
            <div className="md:w-1/2 p-6 sm:p-8">
              <Link href={`/blog/${latestPost.slug}`}>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light mb-4 transition-colors">
                  {latestPost.title}
                </h3>
              </Link>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                {latestPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span>
                  {new Date(latestPost.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span>·</span>
                <span>{latestPost.readingTime} min read</span>
              </div>
              <Link
                href={`/blog/${latestPost.slug}`}
                className="inline-flex items-center text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary font-medium text-sm sm:text-base"
              >
                Read More
                <svg
                  className="ml-2 w-4 h-4"
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
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 section-gradient-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: 'Frontend',
                skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
              },
              {
                name: 'Backend',
                skills: ['Node.js', 'Express', 'GraphQL', 'REST APIs']
              },
              {
                name: 'Cloud',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Serverless']
              },
              {
                name: 'Database',
                skills: ['MongoDB', 'PostgreSQL', 'Redis', 'DynamoDB']
              }
            ].map((category) => (
              <div key={category.name} className="feature-box">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category.name}
                </h3>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-primary dark:text-primary-light"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let&apos;s Build Something Amazing Together
          </h2>
          <p className="text-xl mb-8 text-white opacity-90">
            Whether you need a new website, a cloud architecture, or technical
            consulting, I&apos;m here to help bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-gray-100 inline-block px-8 py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
