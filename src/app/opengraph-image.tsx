import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 1200,
  height: 630
}

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background image */}
        <img
          src='https://jeffknowlesjr.com/images/projects/project-project-omega-cover.webp'
          alt='Project Omega'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7
          }}
        />

        {/* Overlay gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              marginBottom: 20,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Jeff Knowles Jr
          </h1>
          <p
            style={{
              fontSize: 30,
              color: 'white',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Portfolio & Blog
          </p>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported size metadata
      // config to also set the ImageResponse's width and height.
      ...size
    }
  )
}
