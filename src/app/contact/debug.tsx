'use client'

import { useEffect, useState } from 'react'

/**
 * Debug component for contact form issues in production
 * This component helps troubleshoot browser extension and network issues
 */
export default function ContactFormDebug() {
  const [browserInfo, setBrowserInfo] = useState<Record<string, any>>({})
  const [contentScripts, setContentScripts] = useState<string[]>([])
  const [mutationObservers, setMutationObservers] = useState(0)
  const [ajaxRequests, setAjaxRequests] = useState<any[]>([])

  useEffect(() => {
    // Collect browser information
    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      devicePixelRatio: window.devicePixelRatio,
      localStorage: typeof window.localStorage !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator
    })

    // Look for content scripts
    const scripts = []
    document.querySelectorAll('script').forEach((script) => {
      if (script.src && script.src.includes('content-script')) {
        scripts.push(script.src)
      }
    })
    setContentScripts(scripts)

    // Count MutationObservers by monkey patching
    let observerCount = 0
    const originalMutationObserver = window.MutationObserver

    // Create wrapper to count observer creations
    function CountingMutationObserver(...args: any[]) {
      observerCount++
      setMutationObservers(observerCount)

      try {
        // @ts-ignore
        return new originalMutationObserver(...args)
      } catch (error) {
        console.warn('MutationObserver creation error:', error)

        // Return a fake observer to prevent crashes
        return {
          observe: () => {},
          disconnect: () => {},
          takeRecords: () => []
        }
      }
    }

    // Apply the monkey patch
    CountingMutationObserver.prototype = originalMutationObserver.prototype
    window.MutationObserver = CountingMutationObserver as any

    // Track Ajax requests
    const requests: any[] = []
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url
      console.log(`Debug: fetch request to ${url}`)
      requests.push({
        type: 'fetch',
        url,
        time: new Date().toISOString()
      })
      setAjaxRequests([...requests])
      return originalFetch.apply(this, args as any)
    }

    // Restore original functions when component unmounts
    return () => {
      window.MutationObserver = originalMutationObserver
      window.fetch = originalFetch
    }
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Contact Form Debug</h1>

      <div className="grid gap-6">
        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-3">Browser Information</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(browserInfo, null, 2)}
          </pre>
        </div>

        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-3">Content Scripts</h2>
          {contentScripts.length > 0 ? (
            <ul className="list-disc pl-5">
              {contentScripts.map((script, index) => (
                <li key={index} className="mb-1">
                  {script}
                </li>
              ))}
            </ul>
          ) : (
            <p>No content scripts detected</p>
          )}
        </div>

        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-3">MutationObservers</h2>
          <p>Active MutationObservers: {mutationObservers}</p>
        </div>

        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-3">
            Recent Network Requests
          </h2>
          {ajaxRequests.length > 0 ? (
            <ul className="list-disc pl-5">
              {ajaxRequests.map((req, index) => (
                <li key={index} className="mb-1">
                  <span className="font-mono">{req.time}</span>: {req.type} to{' '}
                  {req.url}
                </li>
              ))}
            </ul>
          ) : (
            <p>No requests detected</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <a href="/contact" className="btn btn-primary">
          Return to Contact Form
        </a>
      </div>
    </div>
  )
}
