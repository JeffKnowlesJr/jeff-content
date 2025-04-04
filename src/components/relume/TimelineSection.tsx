import React from 'react'
import SimpleBadge from '../ui/SimpleBadge'

interface TimelineItem {
  year: string
  title: string
  description: string
  tags: string[]
}

// Sample timeline data
const timelineData: TimelineItem[] = [
  {
    year: '2024',
    title: 'Senior Full Stack Developer',
    description:
      'Leading development of enterprise web applications using React, Node.js, and AWS.',
    tags: ['React', 'Node.js', 'AWS', 'TypeScript']
  },
  {
    year: '2022',
    title: 'Marketing Technology Specialist',
    description:
      'Integrated marketing automation and analytics solutions for data-driven campaigns.',
    tags: ['Marketing Tech', 'Analytics', 'Automation']
  },
  {
    year: '2020',
    title: 'UI/UX Designer & Developer',
    description:
      'Created user-centered designs and developed responsive web applications.',
    tags: ['UI/UX', 'Web Design', 'Frontend']
  }
]

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description
}) => {
  return (
    <div className="text-center mb-16">
      {label && (
        <div className="flex items-center gap-4 mb-3 justify-center">
          <div className="h-px w-8 bg-teal-500"></div>
          <span className="text-sm uppercase tracking-wider text-teal-500 font-medium">
            {label}
          </span>
        </div>
      )}
      <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}

const TimelineSectionRelume: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <SectionHeader
          label="Experience"
          title="Professional Journey"
          description="A timeline of my professional experience and key milestones."
        />

        <div className="relative mt-16">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-teal-500/50 to-transparent"></div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="w-5/12">
                  <div
                    className={`${
                      index % 2 === 0 ? 'pr-16 text-right' : 'pl-16 text-left'
                    }`}
                  >
                    <span className="text-sm font-medium text-teal-500">
                      {item.year}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                    <div
                      className={`mt-4 flex flex-wrap gap-2 ${
                        index % 2 === 0 ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {item.tags.map((tag, tagIndex) => (
                        <SimpleBadge
                          key={tagIndex}
                          className="px-3 py-1 text-xs rounded-full bg-teal-100/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                        >
                          {tag}
                        </SimpleBadge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-teal-500 border-4 border-white dark:border-gray-900"></div>

                {/* Empty Space for the other side */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSectionRelume
