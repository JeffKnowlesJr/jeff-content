import React from 'react'
import Footer from '../Footer'

interface BaseLayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

/**
 * Base layout component that wraps all pages.
 * Provides consistent header, footer, and padding
 */
export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  hideFooter = false
}) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow'>{children}</div>
      {!hideFooter && <Footer />}
    </div>
  )
}
