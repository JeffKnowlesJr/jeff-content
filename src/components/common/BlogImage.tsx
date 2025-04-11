'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

/**
 * BlogImage component with fallback handling
 *
 * This component wraps Next.js Image and provides fallback handling
 * for missing images to prevent 404 errors on the page.
 */
export default function BlogImage({
  src,
  alt,
  width = 1200,
  height = 630,
  className = '',
  priority = false,
  ...props
}: BlogImageProps) {
  const [error, setError] = useState(false)

  // Default fallback image
  const fallbackSrc = '/images/fallback-image.webp'

  // Generate src for the blog images
  const imageSrc = src.startsWith('http') ? src : src

  // Console log for debugging in development
  if (process.env.NODE_ENV === 'development' && error) {
    console.log(`Image failed to load: ${src}`)
  }

  return (
    <div className={`blog-image-container ${className}`}>
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={alt || 'Blog post image'}
        width={width}
        height={height}
        priority={priority}
        onError={() => setError(true)}
        className={`blog-image ${error ? 'blog-image-fallback' : ''}`}
        {...props}
      />

      {/* Only show this in development */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className='bg-yellow-100 text-yellow-800 text-xs p-1 mt-1 rounded'>
          Image not found: {src}
        </div>
      )}
    </div>
  )
}
