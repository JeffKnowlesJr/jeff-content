import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'fas fa-tachometer-alt' },
    { name: 'Posts', href: '/admin/posts', icon: 'fas fa-newspaper' },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: 'fas fa-project-diagram'
    },
    { name: 'Media', href: '/admin/media', icon: 'fas fa-images' },
    { name: 'Comments', href: '/admin/comments', icon: 'fas fa-comments' },
    { name: 'Users', href: '/admin/users', icon: 'fas fa-users' }
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-gray-800 dark:bg-gray-950">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-white font-bold text-xl">
                    JKJR Admin
                  </span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                    >
                      <i className={`${item.icon} mr-2`}></i>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  href="/admin/settings"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Settings
                </Link>
                <button
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-3"
                  onClick={() => {
                    // Logout logic will be implemented later
                    console.log('Logout clicked')
                  }}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {navigation.find((item) => isActive(item.href))?.name || 'Admin'}
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  )
}
