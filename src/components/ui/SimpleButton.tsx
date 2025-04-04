import React, { ReactNode, ButtonHTMLAttributes } from 'react'

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Simple Button component to replace Relume UI Button
 * This eliminates the dependency on Relume UI which might be causing the useLayoutEffect issues
 */
const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles =
    'font-medium rounded-lg inline-flex items-center justify-center transition-colors whitespace-nowrap'

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    text: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default SimpleButton
