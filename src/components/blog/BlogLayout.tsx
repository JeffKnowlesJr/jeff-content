import { ReactNode } from 'react'
import BlogHeader from './BlogHeader'
import ImageSourceToggle from './ImageSourceToggle'

interface BlogLayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export default function BlogLayout({
  children,
  showHeader = false
}: BlogLayoutProps) {
  return (
    <div className='container mx-auto px-0 py-8'>
      {showHeader && <BlogHeader />}

      <div className='mx-auto max-w-4xl'>
        <main>{children}</main>
      </div>

      {process.env.NODE_ENV === 'development' && <ImageSourceToggle />}
    </div>
  )
}
