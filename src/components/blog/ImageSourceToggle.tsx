'use client'

import { useState, useEffect } from 'react'

// Helper for safe localStorage access
const safeGetLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key)
    }
    return null
  } catch (e) {
    console.warn('Failed to access localStorage:', e)
    return null
  }
}

export default function ImageSourceToggle() {
  const [useCloudImages, setUseCloudImages] = useState(false)

  // Initialize state from localStorage after component mounts
  useEffect(() => {
    setUseCloudImages(safeGetLocalStorage('useCloudImages') === 'true')
  }, [])

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') return null

  const toggleImageSource = () => {
    const newValue = !useCloudImages
    localStorage.setItem('useCloudImages', newValue.toString())
    setUseCloudImages(newValue)
    // Force reload to apply changes
    window.location.reload()
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 bg-gray-800 text-white text-xs p-2 rounded-md opacity-70 hover:opacity-100 transition-opacity'>
      <button onClick={toggleImageSource} className='flex items-center gap-1'>
        <span
          className={`w-2 h-2 rounded-full ${
            useCloudImages ? 'bg-green-500' : 'bg-blue-500'
          }`}
        ></span>
        {useCloudImages ? 'Using Cloud Images' : 'Using Local Images'}
      </button>
    </div>
  )
}
