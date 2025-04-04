import React from 'react'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  centered?: boolean
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  centered = false
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-16`}>
      {label && (
        <div
          className={`flex items-center gap-4 mb-3 ${
            centered && 'justify-center'
          }`}
        >
          <div className='h-px w-8 bg-teal-500'></div>
          <span className='text-sm uppercase tracking-wider text-teal-500 font-medium'>
            {label}
          </span>
        </div>
      )}
      <h2 className='text-3xl font-medium text-gray-900 dark:text-white mb-4'>
        {title}
      </h2>
      {description && (
        <p
          className={`text-gray-600 dark:text-gray-300 ${
            centered && 'max-w-2xl mx-auto'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeader
