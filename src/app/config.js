// Global configuration for dynamic routes
// This helps prevent static generation errors for client-side routes

// Set 404 page as static to prevent build errors
export const notFound = {
  dynamic: 'error'
}

// Don't attempt to statically optimize admin routes
export const dynamicRoutes = {
  '/admin': { dynamic: 'force-dynamic' },
  '/admin/login': { dynamic: 'force-dynamic' },
  '/admin/dashboard': { dynamic: 'force-dynamic' }
}

// Export dynamic setting for all pages to use
export const runtime = 'nodejs'
