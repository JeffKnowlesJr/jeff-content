import { useState, useEffect } from 'react'

/**
 * Custom hook that returns true when the component is mounted on the client.
 * Used to prevent hydration errors when server and client renders don't match.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
