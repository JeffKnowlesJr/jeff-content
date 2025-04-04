import React from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

interface SkillBarProps {
  name: string
  percentage: number
  color?: string
  description?: string
  className?: string
}

const SkillBar: React.FC<SkillBarProps> = ({
  name,
  percentage,
  color = '#0668E1',
  description,
  className = ''
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1
  })

  return (
    <div
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={`mb-4 ${className}`}
    >
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          {name}
        </span>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {percentage}%
        </span>
      </div>
      <div className='relative'>
        <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
          <motion.div
            className='h-full rounded-full'
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: isIntersecting ? `${percentage}%` : 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {description && (
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity'>
            <div className='bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap'>
              {description}
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillBar
