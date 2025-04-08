import { ReactNode } from 'react'
import BlogSidebar from './BlogSidebar'
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

      <div className='flex flex-col lg:flex-row gap-12'>
        <aside className='lg:w-1/4 order-2 lg:order-1'>
          <div className='sticky top-24'>
            <BlogSidebar />
          </div>
        </aside>
        <main className='lg:w-3/4 order-1 lg:order-2'>{children}</main>
      </div>

      {process.env.NODE_ENV === 'development' && <ImageSourceToggle />}
    </div>
  )
}
