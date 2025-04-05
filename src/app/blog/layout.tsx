import { Sidebar } from '@/components/Sidebar'

export default function BlogLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Main content */}
          <div className='w-full md:w-2/3 lg:w-3/4'>{children}</div>

          {/* Sidebar */}
          <div className='w-full md:w-1/3 lg:w-1/4'>
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
