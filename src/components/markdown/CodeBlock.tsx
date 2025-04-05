'use client'

import React from 'react'

interface CodeBlockProps {
  children: string
  className?: string
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  return (
    <pre className={className}>
      <code>{children}</code>
    </pre>
  )
}

export default CodeBlock
