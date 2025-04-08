'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access the requested page. This area is
          restricted to administrators only.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Homepage
          </button>
          {isAuthenticated && (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
