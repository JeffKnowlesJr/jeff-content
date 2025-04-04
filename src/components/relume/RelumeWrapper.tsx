import React, { ReactNode } from 'react'
import { ensureUseLayoutEffect } from '../../utils/reactPolyfills'

interface RelumeWrapperProps {
  children: ReactNode
}

/**
 * A lightweight wrapper component for Relume UI components
 * This ensures that React.useLayoutEffect is properly polyfilled
 * without adding unnecessary effects.
 */
const RelumeWrapper: React.FC<RelumeWrapperProps> = ({ children }) => {
  // Ensure polyfill is applied (redundant but safe)
  ensureUseLayoutEffect()

  // Simply render children without additional effects
  return <>{children}</>
}

export default RelumeWrapper
