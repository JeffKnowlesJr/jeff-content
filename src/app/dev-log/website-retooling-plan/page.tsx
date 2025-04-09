import { Metadata } from 'next'
import { BlogLayout } from '@/components/BlogLayout'

export const metadata: Metadata = {
  title: 'Website Retooling: Hybrid Architecture Implementation | Dev Log',
  description:
    'A comprehensive plan for transitioning from a single React SPA to a hybrid architecture using Next.js for content-heavy pages while maintaining interactive features in the existing React application.',
  openGraph: {
    title: 'Website Retooling: Hybrid Architecture Implementation | Dev Log',
    description:
      'A comprehensive plan for transitioning from a single React SPA to a hybrid architecture using Next.js for content-heavy pages while maintaining interactive features in the existing React application.',
    type: 'article',
    publishedTime: '2024-04-09T03:15:00.000Z',
    authors: ['Jeff Knowles Jr'],
    tags: ['Architecture', 'Next.js', 'React', 'AWS', 'Migration']
  }
}

export default function WebsiteRetoolingPage() {
  return (
    <BlogLayout>
      <article className='prose dark:prose-invert max-w-none'>
        <h1>Website Retooling: Hybrid Architecture Implementation</h1>
        <div className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
          Published on April 9, 2024
        </div>

        <h2>Overview</h2>
        <p>
          Our website is undergoing a significant architectural transformation,
          moving from a single-page React application to a hybrid architecture
          that leverages the strengths of both Next.js and React. This
          transition aims to improve SEO, performance, and maintainability while
          preserving the rich interactive features of our existing application.
        </p>

        <h2>Current Status</h2>
        <p>The retooling effort is progressing through four distinct phases:</p>
        <ul>
          <li>
            <strong>Phase 1 (Completed)</strong>: Successfully implemented
            Next.js setup with shared components, Tailwind CSS integration, and
            a robust theme system.
          </li>
          <li>
            <strong>Phase 2 (In Progress)</strong>: Currently migrating content,
            including the blog system and project showcases, to the new
            architecture.
          </li>
          <li>
            <strong>Phase 3 (Pending)</strong>: Planning API integration with
            AppSync and implementing a shared API layer.
          </li>
          <li>
            <strong>Phase 4 (Pending)</strong>: Preparing deployment
            configuration with AWS Amplify and CloudFront.
          </li>
        </ul>

        <h2>Architecture Overview</h2>
        <p>
          The new architecture divides the website into two specialized
          applications:
        </p>

        <h3>1. Next.js Content Site</h3>
        <p>
          This portion handles all content-heavy pages and static content,
          including:
        </p>
        <ul>
          <li>Marketing pages</li>
          <li>Blog system</li>
          <li>Project showcases</li>
          <li>Resources</li>
          <li>Documentation</li>
        </ul>
        <p>Key features include:</p>
        <ul>
          <li>App Router architecture for improved routing and performance</li>
          <li>TypeScript integration for enhanced type safety</li>
          <li>Tailwind CSS for consistent styling</li>
          <li>Optimized font and image loading</li>
          <li>Seamless dark/light mode support</li>
        </ul>

        <h3>2. React SPA (Interactive Features)</h3>
        <p>
          This portion maintains the rich interactive features of the original
          application:
        </p>
        <ul>
          <li>Admin dashboard</li>
          <li>Portfolio experience</li>
          <li>Development tools</li>
          <li>Interactive components</li>
        </ul>

        <h2>Technical Implementation</h2>
        <h3>Frontend Stack</h3>
        <ul>
          <li>Next.js 14 with TypeScript</li>
          <li>Tailwind CSS for styling</li>
          <li>Optimized asset loading and delivery</li>
        </ul>

        <h3>Backend Services</h3>
        <ul>
          <li>AWS AppSync for GraphQL API</li>
          <li>DynamoDB for data storage</li>
          <li>S3 for static assets</li>
          <li>CloudFront for content delivery</li>
        </ul>

        <h3>Performance Targets</h3>
        <ul>
          <li>Lighthouse SEO score: 95+</li>
          <li>First Contentful Paint: &lt; 1.5s</li>
          <li>Time to Interactive: &lt; 3.5s</li>
          <li>All Core Web Vitals passing</li>
        </ul>

        <h2>Migration Strategy</h2>
        <p>The migration follows a carefully planned, phased approach:</p>
        <ol>
          <li>Content-first migration (static pages)</li>
          <li>Blog system migration</li>
          <li>Project showcases</li>
          <li>Documentation transfer</li>
          <li>Interactive features remain in React SPA</li>
        </ol>

        <h2>Timeline and Maintenance</h2>
        <h3>Implementation Timeline</h3>
        <ul>
          <li>Weeks 1-2: Next.js setup and initial configuration</li>
          <li>Weeks 3-4: Content migration and component library</li>
          <li>Weeks 5-6: API integration and data fetching</li>
          <li>Weeks 7-8: Testing and deployment</li>
          <li>Weeks 9-10: Performance optimization and monitoring</li>
        </ul>

        <h3>Maintenance Plan</h3>
        <ul>
          <li>Regular dependency updates</li>
          <li>Continuous performance monitoring</li>
          <li>Content updates</li>
          <li>Security patches</li>
          <li>Comprehensive backup strategy</li>
        </ul>

        <h3>Rollback Strategy</h3>
        <p>To ensure a safe transition, we maintain:</p>
        <ul>
          <li>Functional current SPA</li>
          <li>Separate deployments for each application</li>
          <li>Version control for both applications</li>
          <li>Regular database backups</li>
          <li>DNS fallback configuration</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          This retooling effort represents a significant step forward in our
          website's evolution. By leveraging the strengths of both Next.js and
          React, we aim to deliver an improved user experience while maintaining
          the rich interactive features that make our site unique. The phased
          approach ensures a smooth transition with minimal disruption to users.
        </p>
      </article>
    </BlogLayout>
  )
}
