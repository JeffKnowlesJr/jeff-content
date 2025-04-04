import React, { useState, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // Transparent GIF
  className = ''
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setImageLoaded(true)
    }
  }, [src])

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${
        !imageLoaded ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''
      }`}
    />
  )
}

export default LazyImage
