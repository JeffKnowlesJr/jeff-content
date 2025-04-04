import { useEffect } from 'react'
import { GA_MEASUREMENT_ID } from '../lib/gtag'
import { useLocation } from 'react-router-dom'

const GoogleAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page views when location changes
    const pageUrl = location.pathname + location.search
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pageUrl
    })
  }, [location])

  return (
    <>
      {/* Google Analytics Script */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
    </>
  )
}

export default GoogleAnalytics
