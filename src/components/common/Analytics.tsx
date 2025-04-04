import React, { useEffect } from 'react'
import { GA_MEASUREMENT_ID } from '../../lib/gtag'

const Analytics: React.FC = () => {
  useEffect(() => {
    // Add Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    // Initialize Google Analytics
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `
    document.head.appendChild(script2)

    return () => {
      // Cleanup
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  return null
}

export default Analytics
