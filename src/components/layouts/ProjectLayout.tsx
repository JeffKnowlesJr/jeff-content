import React from 'react'

interface ProjectPageLayoutProps {
  children: React.ReactNode
}

/**
 * ProjectPageLayout - Layout container for Project section
 *
 * HIERARCHY:
 * GlobalLayout > ProjectPageLayout > Project content
 *
 * WIDTH BEHAVIOR:
 * This layout is intentionally full-width with no max-width constraint
 * to provide a spacious design for project content.
 *
 * IMPORTANT LAYOUT NOTES FOR FUTURE DEVELOPERS:
 * --------------------------------------------
 * 1. This layout is closely tied to BlogPageLayout.tsx - changes here should be mirrored there
 * 2. Use standard px-4 padding for content alignment
 *    (Note: Header uses asymmetrical padding with px-6 on left, px-4 on right)
 * 3. Width constraints and overflow handling are critical for mobile responsiveness
 * 4. These layouts work in conjunction with GlobalLayout.tsx which provides the sidebar
 * 5. There are no minimum width constraints to ensure proper responsiveness
 * 6. All containers include overflow-x-hidden to prevent horizontal scrolling
 *
 * CONTENT RESIZING:
 * The content area will automatically resize when the sidebar is expanded or collapsed.
 * There are no minimum width constraints on the content area to prevent overflow.
 *
 * If significant changes are made to either ProjectPageLayout or BlogPageLayout, update both files
 * to maintain visual consistency across content types.
 */
export const ProjectPageLayout: React.FC<ProjectPageLayoutProps> = ({
  children
}) => {
  return (
    <div className='w-full overflow-x-hidden'>
      {/* Main Content */}
      <div className='pt-1 sm:pt-2 md:pt-4 overflow-x-hidden w-full'>
        {/* 
          Padding notes: 
          - Use standard px-4 sm:px-6 lg:px-8 padding to match content areas across the app
          - Header uses asymmetrical padding (px-6 left, px-4 on right)
          - Maintain this consistency for proper alignment across the entire application
        */}
        <div className='w-full px-4 sm:px-6 lg:px-8 2xl:px-16'>{children}</div>
      </div>
    </div>
  )
}

// For backward compatibility, also export as ProjectLayout
export const ProjectLayout = ProjectPageLayout
