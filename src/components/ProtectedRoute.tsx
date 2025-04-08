'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = true
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
      } else if (adminOnly && user?.role !== 'admin') {
        // If admin only and user is not admin, redirect
        router.push('/unauthorized')
      }
    }
  }, [isAuthenticated, isLoading, router, adminOnly, user])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If not authenticated, don't render children (will redirect in useEffect)
  if (!isAuthenticated) {
    return null
  }

  // If admin only and not admin, don't render children (will redirect in useEffect)
  if (adminOnly && user?.role !== 'admin') {
    return null
  }

  // If authenticated (and admin if adminOnly), render children
  return <>{children}</>
}

export default ProtectedRoute
