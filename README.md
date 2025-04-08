# JKJR Portfolio & Blog

A modern, performant portfolio and blog built with Next.js and React.

## Architecture

This project uses Next.js for:

- Marketing pages
- Blog content
- Static content
- Interactive features

### Core Features

- Content-focused blog system with search, tags, and categories
- Project showcase with detailed case studies
- Interactive portfolio with animated background
- Contact system with form validation
- Performance optimized with adaptive components
- SEO friendly with metadata and structured data
- Theme-aware components with dark/light mode support
- Responsive design with mobile-first approach

## Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- React Context API
- Framer Motion for animations

### Build & Deploy

- Node.js
- AWS Amplify
- GitHub Actions

### Content

- MDX for blog posts
- Image optimization pipeline
- WebP with PNG fallbacks

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── blog/              # Blog pages and routes
│   ├── dev-log/           # Development log pages
│   ├── projects/          # Project showcase pages
│   └── page.tsx           # Home page
├── components/            # Shared React components
│   ├── blog/             # Blog-specific components
│   ├── layout/           # Layout components
│   ├── common/           # Reusable UI components
│   └── EnhancedBackgroundAnimation.tsx # Animated background
├── content/              # MDX content and assets
├── docs/                 # Project documentation
│   ├── MIGRATION_PLAN.md
│   ├── VISUAL_SYSTEM.md
│   ├── CODEBASE.md
│   └── ANIMATION_TROUBLESHOOTING.md
├── public/               # Static assets
│   └── images/
├── scripts/             # Build and utility scripts
├── styles/              # Global styles
└── types/               # TypeScript definitions
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run process-images` - Process and optimize images
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Documentation

- [Migration Plan](docs/MIGRATION_PLAN.md) - Detailed migration strategy
- [Visual System](docs/VISUAL_SYSTEM.md) - Design system documentation
- [CODEBASE.md](docs/CODEBASE.md) - Codebase architecture and standards
- [Animation Troubleshooting](docs/ANIMATION_TROUBLESHOOTING.md) - Animation component documentation
- [Tailwind Troubleshooting](docs/TAILWIND_TROUBLESHOOTING.md) - Tailwind CSS configuration and troubleshooting
- [Website Retooling](docs/WEBSITE_RETOOLING.md) - Website retooling plan and progress

## Performance Targets

- Lighthouse score ≥ 95
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Core Web Vitals passing

## Security

- HTTPS enforced
- CSP headers
- Input sanitization
- Regular dependency updates

## Accessibility

- WCAG AA compliance
- Semantic HTML
- Keyboard navigation
- Screen reader support

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - see LICENSE file

## Contact

For questions or feedback, please open an issue or reach out through the contact form on the website.

## File Structure

- `content/`: Contains all blog posts and project descriptions in markdown format
- `public/`: Publicly accessible files like processed images and static assets
- `scripts/`: Utility scripts for image processing and other tasks
- `src/`: Source code for the website
  - `src/app/`: Next.js app router pages and layouts
  - `src/components/`: React components used across the site
  - `src/utils/`: Utility functions and helpers
  - `src/assets/`: Unprocessed files and source images before optimization

## Image Processing

Raw images should be placed in the `public/content/assets` directory with proper naming:

- For blog images: Include "blog" in the filename
- For project images: Include "project" in the filename
- Logo: Named "JKJR3.png"

Then run the image processing script to optimize the images:

```bash
npm run process-images
```

This will:

- Process blog images to `/public/images/blog/featured/` (1200px width, WebP format)
- Process project images to `/public/images/projects/` (1200px width, WebP format)
- Process the logo to both PNG and WebP formats
- Automatically create any necessary directories

Always process images before using them on the website to ensure optimal performance.

## Deployment to AWS Amplify

This project is configured to deploy to AWS Amplify. To deploy:

1. Push your changes to the GitHub repository
2. In the AWS Management Console:
   - Go to AWS Amplify
   - Select "New app" > "Host web app"
   - Choose GitHub as the repository source
   - Select the jeff-content repository
   - Keep the default branch (main)
   - Review the build settings (should automatically detect Next.js)
   - Confirm and deploy

## Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Content Management

Content is stored in the following locations:

- Blog posts: `/content/blog/`
- Projects: `/content/projects/`
- Unprocessed image assets: `/src/assets/`
- Processed images for the website: `/public/images/`

## Image Processing

Images are processed using Sharp to optimize them for web:

```bash
# Process a specific image
node scripts/resize-blog-image.js

# Convert HEIC to JPG
node scripts/convert-profile-image.js
```

## Environment Setup

The website is built with:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
