'use client'

import React from 'react'

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '')

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children)
    }
  }

  return !inline && match ? (
    <div className='relative group'>
      <pre className={`${className} overflow-x-auto p-4 rounded-lg`}>
        <code className={className} {...props}>
          {children}
        </code>
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button
            className='text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600'
            onClick={handleCopy}
          >
            Copy
          </button>
        </div>
      </pre>
    </div>
  ) : (
    <code className={`${className} px-1 py-0.5 rounded text-sm`} {...props}>
      {children}
    </code>
  )
}
