interface ErrorDisplayProps {
  error: Error | unknown
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const message = error instanceof Error ? error.message : 'An error occurred'

  return (
    <div className='p-4 text-red-600 dark:text-red-400'>
      <p className='font-semibold'>Error loading data</p>
      <p className='text-sm'>{message}</p>
    </div>
  )
}
