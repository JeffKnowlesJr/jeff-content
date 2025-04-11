---
title: 'Project Zero Documentation'
slug: 'project-zero-documentation'
excerpt: 'Comprehensive documentation for Project Zero, complete with user guides, API references, and technical instructions.'
datePublished: '2024-04-01'
dateModified: '2024-04-04'
author: 'Jeff Knowles Jr (Compiled with assistance from AI)'
tags: ['Documentation', 'Technical Writing', 'User Guides']
status: 'published'
featured: true
featuredImage: '/images/projects/project-project-zero-cover.webp'
thumbnailImage: '/images/projects/project-project-zero-cover.webp'
techStack:
  ['Documentation', 'Technical Writing', 'User Guides', 'API Reference']
description: 'In-depth technical documentation covering the architecture, implementation, and maintenance of a modern full-stack portfolio website using React, AWS, and Terraform.'
keywords:
  - 'portfolio documentation'
  - 'react architecture'
  - 'aws appsync'
  - 'terraform infrastructure'
  - 'full-stack development'
  - 'technical documentation'
ogTitle: 'Project Zero: Complete Technical Documentation'
ogDescription: 'Comprehensive guide to building and maintaining a modern full-stack portfolio website with React, AWS, and Terraform'
ogImage: '/images/projects/project-zero/featured/architecture-overview.webp'
ogType: 'article'
twitterCard: 'summary_large_image'
twitterCreator: '@YourTwitterHandle'
articleSection: 'Technical Documentation'
articleAuthor: 'Jeff'
---

## 1-Project-Overview

### Introduction

The Project Zero is a modern, responsive web application designed to showcase professional work, services, and blog content. Built with React and TypeScript, the site features a clean, interactive design with dark/light theme support, interactive components, and a comprehensive blog system backed by AWS services.

### Core-Technologies

**Frontend:**

- React 18 with TypeScript
- Vite for build and development
- Tailwind CSS for styling
- Framer Motion and GSAP for animations
- Three.js for 3D effects

**Backend:**

- AWS AppSync for GraphQL API
- DynamoDB for data storage
- Lambda for serverless functions
- SES for email notifications

**Infrastructure:**

- Terraform for infrastructure as code
- AWS Amplify for hosting and deployment
- GitHub for version control

### Key-Features

- 🌓 Dark/Light theme with system preference detection
- 📱 Responsive design for all screen sizes
- 🎨 Interactive card components with drag functionality
- 📝 Contact form with AWS AppSync backend
- 🔒 reCAPTCHA integration for form security
- 📊 Google Analytics integration
- 🎬 GSAP animations and Three.js 3D effects
- 📚 Comprehensive blog system with markdown support

### Architecture-Overview

The application follows a component-based architecture with clear separation of concerns:

- **Frontend:** React components with TypeScript for type safety
- **State Management:** React Context API for global state
- **API Layer:** GraphQL with AWS AppSync
- **Data Storage:** DynamoDB tables for blog posts and contact forms
- **Infrastructure:** Terraform-managed AWS resources

---

## 2-Getting-Started

### Prerequisites

- Node.js (v20.17.0 or higher)
- npm (v9.8.1 or higher)
- Git
- AWS Account with configured AWS CLI
- Terraform (v1.0.0 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-zero.git
cd project-zero
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure required environment variables:

```
VITE_APPSYNC_ENDPOINT=your_appsync_endpoint
VITE_APPSYNC_API_KEY=your_api_key
VITE_GA_MEASUREMENT_ID=your_ga_id
```

### Environment-Setup

1. Initialize Terraform for infrastructure:

```bash
npm run tf:init
```

2. Create a development workspace:

```bash
npm run tf:workspace:new -- dev
```

3. Plan and apply infrastructure changes:

```bash
npm run tf:plan
npm run tf:apply
```

### Development-Workflow

1. Start the development server:

```bash
npm run dev
```

2. Build for production:

```bash
npm run build
```

3. Run tests:

```bash
npm run test
```

4. Preview production build:

```bash
npm run preview
```

---

## 3-Frontend-Architecture

### Project-Structure

```
src/
├── assets/         # Images, fonts, and other assets
├── components/     # Reusable UI components
│   ├── blog/       # Blog-specific components
│   ├── common/     # Shared UI elements
│   ├── features/   # Feature-specific components
│   ├── home/       # Homepage components
│   ├── layout/     # Layout components
│   ├── navigation/ # Navigation components
│   ├── portfolio/  # Portfolio components
│   ├── shared/     # Shared utility components
│   └── ui/         # Basic UI elements
├── contexts/       # React context providers
├── data/           # Data files and constants
├── graphql/        # GraphQL queries and mutations
├── hooks/          # Custom React hooks
├── lib/            # Helper functions and utilities
├── pages/          # Main application pages
├── scripts/        # Frontend scripts
├── services/       # API services and integrations
├── styles/         # CSS and style definitions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Component-Architecture

**Core Components:**

1. **Card Component:**

```typescript
interface CardProps {
  title: string
  content: string
  image?: string
  link?: string
  state?: 'minimized' | 'normal' | 'expanded' | 'maximized'
}
```

2. **Layout Components:**

```typescript
interface LayoutProps {
  children: React.ReactNode
  className?: string
}
```

3. **Navigation:**

```typescript
interface NavigationProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

### State-Management

The application uses React Context for global state management:

1. **Theme Context:**

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

2. **Reset Context:**

```typescript
interface ResetContextType {
  resetState: () => void
  isResetting: boolean
}
```

### Routing

The application uses React Router with the following main routes:

```typescript
<Routes>
  <Route path='/' element={<HomePage />} />
  <Route path='/about' element={<AboutPage />} />
  <Route path='/projects' element={<Projects />} />
  <Route path='/portfolio' element={<Portfolio />} />
  <Route path='/services' element={<Services />} />
  <Route path='/services/overview' element={<ServiceOverview />} />
  <Route path='/services/development' element={<DevelopmentServices />} />
  <Route path='/services/design' element={<DesignServices />} />
  <Route path='/services/cloud' element={<CloudServices />} />
  <Route path='/blog' element={<Blog />} />
  <Route path='/blog/:slug' element={<BlogPost />} />
  <Route path='/resources' element={<Resources />} />
  <Route path='/contact' element={<Contact />} />
</Routes>
```

### Styling-System

The project uses Tailwind CSS with a custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ... other shades
          900: 'var(--color-primary-900)'
        }
        // ... other color definitions
      }
      // ... other theme extensions
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
```

### Animation-Framework

The project uses multiple animation libraries:

1. **Framer Motion** for component animations:

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

2. **GSAP** for complex animations:

```typescript
useEffect(() => {
  gsap.to('.element', {
    duration: 1,
    x: 100,
    ease: 'power2.out'
  })
}, [])
```

3. **Three.js** for 3D effects:

```typescript
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
// ... Three.js setup
```

---

## 4-Backend-Services

### AWS-AppSync-API

The project uses AWS AppSync for GraphQL API:

**API Configuration:**

- Authentication: API Key
- Schema: GraphQL schema for contact forms and blog posts

**GraphQL Schema:**

```graphql
type ContactForm @model @auth(rules: [{ allow: public }]) {
  id: ID!
  name: String!
  email: String!
  message: String!
  createdAt: AWSDateTime!
  status: String!
}

type BlogPost @model @auth(rules: [{ allow: public }]) {
  id: ID!
  title: String!
  slug: String!
  content: String!
  excerpt: String
  author: String
  tags: [String]
  featuredImage: String
  status: String!
  publishedAt: AWSDateTime
  updatedAt: AWSDateTime
}
```

### DynamoDB-Tables

**Contact Forms Table:**

- Name: ContactForms
- Primary Key: id (String)
- Sort Key: createdAt (String)
- Streams: Enabled for Lambda trigger

**Blog Posts Table:**

- Name: {project_name}-{environment}-blog-posts
- Primary Key:
  - Hash Key: id (String)
  - Range Key: slug (String)
- Global Secondary Index:
  - Name: StatusIndex
  - Hash Key: status (String)
  - Range Key: publishedAt (String)
  - Projection Type: ALL

### Lambda-Functions

**Contact Form Processor:**

- Runtime: Node.js 18.x
- Trigger: DynamoDB Streams
- Environment Variables:
  - CONTACT_FORM_TABLE: ContactForms
  - FROM_EMAIL: your-email@example.com
  - TO_EMAIL: your-email@example.com

**Lambda Function Code:**

```javascript
exports.handler = async (event) => {
  // Process DynamoDB stream records
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      // Extract contact form data
      const newItem = record.dynamodb.NewImage

      // Send email notification
      await sendEmailNotification(newItem)

      // Update status in DynamoDB
      await updateStatus(newItem.id.S, 'PROCESSED')
    }
  }

  return { statusCode: 200 }
}
```

### SES-Email-Service

**Email Configuration:**

- Verified Sender: your-email@example.com
- Verified Recipient: your-email@example.com
- Template: Contact form notification

**Email Template:**

```html
<h1>New Contact Form Submission</h1>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Message:</strong> {{message}}</p>
<p><strong>Submitted:</strong> {{createdAt}}</p>
```

### API-Security

**Authentication:**

- API Key authentication with rate limiting
- Regular key rotation (every 6 months)
- Request validation using GraphQL schema

**Authorization:**

- Field-level authorization with @auth directives
- IAM roles with least privilege principle

---

## 5-Blog-System

### Content-Structure

Blog posts are stored in two locations:

1. **Content Directory:** `content/blog/*.md` - Production-ready posts
2. **Source Data:** `src/data/blog-posts/*.md` - Development/draft posts

### Frontmatter-Metadata

Each blog post requires comprehensive frontmatter metadata:

```yaml
---
title: Your Blog Post Title
slug: url-friendly-post-slug
excerpt: A brief summary of the post (140-160 characters recommended)
author: Author Name
tags: ['Tag1', 'Tag2', 'Tag3']
readingTime: 10
featuredImage: '/images/blog/featured/image-name.jpg'
status: published # or 'draft'

# SEO metadata
description: 'Comprehensive description for search engines (150-160 characters)'
keywords: ['keyword1', 'keyword2', 'keyword3']
ogTitle: 'Title for social media sharing'
ogDescription: 'Description for social media sharing'
ogImage: '/images/blog/featured/image-name.jpg'
ogType: 'article'
twitterCard: 'summary_large_image'
twitterCreator: '@username'
articleSection: 'Topic Category'
articleAuthor: 'Author Name'
datePublished: '2024-03-20'
dateModified: '2024-03-20'
---
```

### Image-Management

**Directory Structure:**

```
public/
└── images/
    └── blog/
        ├── featured/    # Hero images (1200x630px)
        ├── thumbnails/  # Thumbnail images (300x300px)
        ├── optimized/   # In-content images (800px width)
        └── original/    # Original unprocessed images
```

**Image Specifications:**

1. **Featured Images:**

   - Dimensions: 1200×630 pixels (optimal for social sharing)
   - Format: WebP (automatically converted)
   - Quality: 85%
   - Path: `/images/blog/featured/filename.webp`

2. **Thumbnail Images:**

   - Dimensions: 300×300 pixels
   - Format: WebP (automatically converted)
   - Quality: 80%
   - Path: `/images/blog/thumbnails/filename.webp`

3. **Optimized Content Images:**
   - Width: 800 pixels (height maintains aspect ratio)
   - Format: WebP (automatically converted)
   - Quality: 82%
   - Path: `/images/blog/optimized/filename.webp`

**Image Processing:**

```bash
# Process blog images
npm run blog:images

# Upload images to S3
npm run blog:s3-upload

# Generate static blog JSON
npm run blog:json

# Import to DynamoDB
npm run import:all-blogs
```

### Publishing-Workflow

1. **Creating a New Post:**

   - Create a new markdown file in `content/blog/`
   - Add required frontmatter metadata
   - Write content using markdown formatting
   - Add and optimize images
   - Set status to `draft`

2. **Testing Locally:**

   - Run development server: `npm run dev`
   - Navigate to `/blog/your-post-slug`
   - Verify content, formatting, and image display
   - Test responsiveness across devices

3. **Publishing:**
   - Update status to `published`
   - Update `datePublished` and `dateModified`
   - Run `npm run build` to generate production assets
   - Commit and push changes to repository

### GraphQL-API

**List Published Posts:**

```graphql
query ListBlogPosts {
  listBlogPosts(limit: 10) {
    items {
      id
      title
      slug
      excerpt
      publishedAt
    }
    nextToken
  }
}
```

**Get Single Post:**

```graphql
query GetBlogPost {
  getBlogPost(slug: "building-modern-portfolio") {
    id
    title
    content
    author
    publishedAt
  }
}
```

---

## 6-Infrastructure-Management

### Terraform-Configuration

**Main Configuration Files:**

- `terraform/main.tf`: Main infrastructure configuration
- `terraform/variables.tf`: Input variable definitions
- `terraform/terraform.tfvars`: Environment-specific values

**Terraform Variables:**

```hcl
project_name = "project-zero"
environment = "dev"
aws_region = "us-east-1"
from_email = "your-email@example.com"
to_email = "your-email@example.com"
```

### AWS-Resources

**AppSync API:**

```hcl
resource "aws_appsync_graphql_api" "portfolio_api" {
  name                = "${var.project_name}-${var.environment}-api"
  authentication_type = "API_KEY"

  schema = file("${path.module}/schema.graphql")
}

resource "aws_appsync_api_key" "portfolio_api_key" {
  api_id  = aws_appsync_graphql_api.portfolio_api.id
  expires = timeadd(timestamp(), "8760h") # 1 year
}
```

**DynamoDB Tables:**

```hcl
resource "aws_dynamodb_table" "contact_forms" {
  name         = "ContactForms"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "createdAt"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"
}
```

**Lambda Function:**

```hcl
resource "aws_lambda_function" "process_form" {
  function_name = "${var.project_name}-${var.environment}-process-form"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_role.arn

  filename         = "${path.module}/lambda/process-form.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/process-form.zip")

  environment {
    variables = {
      CONTACT_FORM_TABLE = aws_dynamodb_table.contact_forms.name
      FROM_EMAIL         = var.from_email
      TO_EMAIL           = var.to_email
    }
  }
}
```

### IAM-Roles-and-Policies

**Lambda Role:**

```hcl
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.contact_forms.arn
      },
      {
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams"
        ]
        Effect   = "Allow"
        Resource = "${aws_dynamodb_table.contact_forms.arn}/stream/*"
      },
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}
```

### Infrastructure-Workflows

**Available Commands:**

```bash
# Initialize Terraform working directory
npm run tf:init

# Create an execution plan
npm run tf:plan

# Apply changes (with confirmation prompt)
npm run tf:apply

# Apply changes automatically without confirmation
npm run tf:apply:auto

# Validate Terraform configuration files
npm run tf:validate

# Destroy infrastructure (with confirmation prompt)
npm run tf:destroy

# Destroy infrastructure automatically without confirmation
npm run tf:destroy:auto
```

### Environment-Management

**Workspace Management:**

```bash
# Create a new workspace
npm run tf:workspace:new -- workspace_name

# Select an existing workspace
npm run tf:workspace:select -- workspace_name

# List all workspaces
npm run tf:workspace:list
```

**Environment Structure:**

- `dev` - Development environment
- `staging` - Testing and QA
- `prod` - Production environment

---

## 7-Deployment

### Build-Process

**Build Configuration:**

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion']
        }
      }
    }
  }
})
```

**Build Commands:**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### AWS-Amplify-Setup

**IAM Role Configuration:**

1. Run `npm run tf:apply` to create the AWS resources including the Amplify build role
2. Note the output value for `amplify_build_role_arn`
3. Go to the AWS Amplify Console
4. Select your application
5. Navigate to "General" settings
6. Under "Service role", click "Edit"
7. Select "Existing service role"
8. Enter the ARN from step 2 (`amplify_build_role_arn`)
9. Click "Save"

**Environment Variables:**
Configure the following environment variables in the AWS Amplify Console:

- `SKIP_PREBUILD`: Set to 'true' to skip image processing during builds
- `NODE_ENV`: Set to 'production' for production builds

### Environment-Variables

**Required Environment Variables:**

```
VITE_APPSYNC_ENDPOINT=https://your-api-id.appsync-api.region.amazonaws.com/graphql
VITE_APPSYNC_API_KEY=your-api-key
VITE_GA_MEASUREMENT_ID=your-ga-id
```

**Optional Environment Variables:**

```
VITE_SES_FROM_EMAIL=your-verified@email.com
VITE_SES_TO_EMAIL=recipient@email.com
```

### Deployment-Pipeline

**GitHub Actions Integration:**
The blog content processing workflow requires AWS credentials:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following repository secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key with S3 and DynamoDB permissions
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

**Deployment Workflow:**

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Process blog content
        run: npm run blog:json
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Build
        run: npm run build

      # Amplify automatically deploys on push to main
```

---

## 8-Performance-Optimization

### Code-Splitting

**Route-Based Code Splitting:**

```typescript
// Lazy load components
const About = React.lazy(() => import('./pages/About'))
const Projects = React.lazy(() => import('./pages/Projects'))
const Blog = React.lazy(() => import('./pages/Blog'))

// In router
;<Routes>
  <Route path='/' element={<HomePage />} />
  <Route
    path='/about'
    element={
      <Suspense fallback={<Loading />}>
        <About />
      </Suspense>
    }
  />
  {/* Other routes */}
</Routes>
```

**Component-Level Code Splitting:**

```typescript
// Lazy load heavy components
const ThreeJSScene = React.lazy(() => import('./components/ThreeJSScene'))

// In component
{
  showScene && (
    <Suspense fallback={<Loading />}>
      <ThreeJSScene />
    </Suspense>
  )
}
```

### Image-Optimization

**Responsive Images:**

```jsx
<img
  src={`/images/blog/optimized/${imageName}-800.webp`}
  srcSet={`
    /images/blog/optimized/${imageName}-400.webp 400w,
    /images/blog/optimized/${imageName}-800.webp 800w,
    /images/blog/optimized/${imageName}-1200.webp 1200w
  `}
  sizes='(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px'
  alt={altText}
  loading='lazy'
/>
```

**Image Processing:**

```javascript
// scripts/blog-image-processor.ts
import sharp from 'sharp'

async function processImage(inputPath, outputPath, width, height, quality) {
  await sharp(inputPath)
    .resize(width, height)
    .webp({ quality })
    .toFile(outputPath)
}

// Process featured image
await processImage(
  `src/assets/${filename}`,
  `public/images/blog/featured/${basename}.webp`,
  1200,
  630,
  85
)
```

### Bundle-Size-Management

**Dependency Analysis:**

```bash
npm run analyze
```

**Chunk Optimization:**

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion'],
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
})
```

### Caching-Strategy

**Static Asset Caching:**

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
```

**API Response Caching:**

```typescript
// services/api.ts
const cachedData = new Map()

export async function fetchBlogPost(slug) {
  const cacheKey = `blog-${slug}`

  if (cachedData.has(cacheKey)) {
    return cachedData.get(cacheKey)
  }

  const data = await fetchFromAPI(/* GraphQL query */)
  cachedData.set(cacheKey, data)

  return data
}
```

---

## 9-Testing

**Example Unit Test:**

```typescript
// utils/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-03-20T12:00:00Z')
    expect(formatDate(date)).toBe('March 20, 2024')
  })

  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate(new Date('invalid'))).toBe('Invalid Date')
  })
})
```

### Component Testing

**Testing Library Setup:**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia
global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))
```

**Component Test Example:**

```typescript
// components/Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card'

describe('Card Component', () => {
  it('renders with title and content', () => {
    render(<Card title='Test Card' content='Test Content' />)

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <Card title='Clickable Card' content='Click me' onClick={handleClick} />
    )

    fireEvent.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders in different states', () => {
    const { rerender } = render(
      <Card title='State Card' content='Content' state='normal' />
    )

    expect(screen.getByText('State Card')).toHaveClass('card-normal')

    rerender(<Card title='State Card' content='Content' state='expanded' />)

    expect(screen.getByText('State Card')).toHaveClass('card-expanded')
  })
})
```

### Integration Testing

**API Integration Test:**

```typescript
// services/api.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { fetchBlogPosts, fetchBlogPost } from './api'
import { setupServer } from 'msw/node'
import { rest, graphql } from 'msw'

const server = setupServer(
  graphql.query('ListBlogPosts', (req, res, ctx) => {
    return res(
      ctx.data({
        listBlogPosts: {
          items: [
            {
              id: '1',
              title: 'Test Post',
              slug: 'test-post',
              excerpt: 'Test excerpt',
              publishedAt: '2024-03-20T12:00:00Z'
            }
          ],
          nextToken: null
        }
      })
    )
  }),

  graphql.query('GetBlogPost', (req, res, ctx) => {
    const { slug } = req.variables

    if (slug === 'test-post') {
      return res(
        ctx.data({
          getBlogPost: {
            id: '1',
            title: 'Test Post',
            slug: 'test-post',
            content: 'Test content',
            author: 'Test Author',
            publishedAt: '2024-03-20T12:00:00Z'
          }
        })
      )
    }

    return res(ctx.errors([{ message: 'Post not found' }]))
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('API Integration', () => {
  it('fetches blog posts', async () => {
    const posts = await fetchBlogPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe('Test Post')
  })

  it('fetches a single blog post', async () => {
    const post = await fetchBlogPost('test-post')

    expect(post.title).toBe('Test Post')
    expect(post.content).toBe('Test content')
  })

  it('handles errors when post not found', async () => {
    await expect(fetchBlogPost('non-existent')).rejects.toThrow(
      'Post not found'
    )
  })
})
```

### Test Coverage

**Coverage Configuration:**

```javascript
// vitest.config.ts
export default defineConfig({
  // ... other config
  test: {
    // ... other test config
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/types/**'
      ]
    }
  }
})
```

**Coverage Commands:**

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

## 10-Security-Considerations

### Frontend Security

**Input Validation:**

```typescript
// components/ContactForm.tsx
const validateForm = (data: ContactFormData): FormErrors => {
  const errors: FormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required'
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}
```

**XSS Prevention:**

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'strong',
      'em',
      'code',
      'pre',
      'blockquote'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}
```

**reCAPTCHA Integration:**

```typescript
// components/ContactForm.tsx
import ReCAPTCHA from 'react-google-recaptcha'

const ContactForm: React.FC = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification')
      return
    }

    // Form submission logic
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={handleRecaptchaChange}
      />
      <button type='submit' disabled={!recaptchaToken}>
        Submit
      </button>
    </form>
  )
}
```

### API Security

**Rate Limiting:**

```typescript
// services/api.ts
import { createRateLimiter } from './rateLimiter'

const apiLimiter = createRateLimiter({
  maxRequests: 10,
  timeWindow: 60000 // 1 minute
})

export const fetchWithRateLimit = async (
  url: string,
  options?: RequestInit
) => {
  await apiLimiter.acquire()

  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    throw error
  }
}
```

**API Key Rotation:**

```typescript
// terraform/main.tf
resource "aws_appsync_api_key" "portfolio_api_key" {
  api_id  = aws_appsync_graphql_api.portfolio_api.id
  expires = timeadd(timestamp(), "4380h") # 6 months
}
```

**Error Handling:**

```typescript
// services/api.ts
export const handleApiError = (error: any): never => {
  // Log error details for debugging
  console.error('API Error:', error)

  // Return user-friendly error message
  if (error.networkError) {
    throw new Error(
      'Network error. Please check your connection and try again.'
    )
  }

  if (error.graphQLErrors) {
    const errorMessage = error.graphQLErrors
      .map((e: any) => e.message)
      .join('. ')

    throw new Error(`Request failed: ${errorMessage}`)
  }

  throw new Error('An unexpected error occurred. Please try again later.')
}
```

### Infrastructure Security

**IAM Least Privilege:**

```hcl
# terraform/main.tf
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.contact_forms.arn
      },
      {
        Action = [
          "ses:SendEmail"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identity/${var.from_email}"
      }
    ]
  })
}
```

**Secure Headers:**

```javascript
// vite.config.ts
export default defineConfig({
  // ... other config
  plugins: [
    // ... other plugins
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-Frame-Options', 'DENY')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
          res.setHeader(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=()'
          )
          next()
        })
      }
    }
  ]
})
```

### Data Protection

**Sensitive Data Handling:**

```typescript
// services/contact.ts
export const submitContactForm = async (formData: ContactFormData) => {
  // Remove any sensitive data before logging
  const loggableData = {
    ...formData,
    email: `${formData.email.substring(0, 3)}...${
      formData.email.split('@')[1]
    }`,
    message: `${formData.message.substring(0, 10)}...`
  }

  console.log('Submitting contact form:', loggableData)

  // Submit form data
  const response = await API.graphql({
    query: createContactFormMutation,
    variables: { input: formData }
  })

  return response
}
```

**Environment Variable Protection:**

```javascript
// vite.config.ts
export default defineConfig({
  // ... other config
  define: {
    // Only expose specific environment variables to the client
    'import.meta.env.VITE_APPSYNC_ENDPOINT': JSON.stringify(
      process.env.VITE_APPSYNC_ENDPOINT
    ),
    'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(
      process.env.VITE_GA_MEASUREMENT_ID
    ),
    'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify(
      process.env.VITE_RECAPTCHA_SITE_KEY
    )
  }
})
```

---

## 11-Monitoring-and-Analytics

### Performance Monitoring

**Core Web Vitals:**

```typescript
// utils/webVitals.ts
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onFID(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

// In main.tsx
reportWebVitals((metric) => {
  console.log(metric)

  // Send to analytics
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      non_interaction: true
    })
  }
})
```

**Performance Marks:**

```typescript
// components/BlogPost.tsx
useEffect(() => {
  // Mark start of content loading
  performance.mark('blog-content-start')

  fetchBlogPost(slug)
    .then((data) => {
      setPost(data)

      // Mark end of content loading
      performance.mark('blog-content-end')
      performance.measure(
        'blog-content-load',
        'blog-content-start',
        'blog-content-end'
      )

      const measure = performance.getEntriesByName('blog-content-load')[0]
      console.log(`Blog content loaded in ${measure.duration}ms`)
    })
    .catch(setError)
}, [slug])
```

### Error Tracking

**Global Error Boundary:**

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo)

    // Report to monitoring service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${error.name}: ${error.message}`,
        fatal: false
      })
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='error-container'>
            <h2>Something went wrong</h2>
            <p>We're sorry, but an error occurred while rendering this page.</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

**API Error Logging:**

```typescript
// services/api.ts
export const logApiError = (error: any, context: string) => {
  // Log to console
  console.error(`API Error (${context}):`, error)

  // Send to monitoring service
  if (window.gtag) {
    window.gtag('event', 'api_error', {
      event_category: 'API',
      event_label: context,
      description: error.message || 'Unknown error'
    })
  }

  // You could also send to a dedicated error tracking service
}
```

### User Analytics

**Google Analytics Integration:**

```typescript
// components/GoogleAnalytics.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void
  }
}

const GoogleAnalytics: React.FC = () => {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!measurementId) return

    // Initialize Google Analytics
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      send_page_view: false
    })

    return () => {
      document.head.removeChild(script)
    }
  }, [measurementId])

  useEffect(() => {
    if (!measurementId || !window.gtag) return

    // Track page views
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    })
  }, [location, measurementId])

  return null
}

export default GoogleAnalytics
```

**Custom Event Tracking:**

```typescript
// hooks/useAnalytics.ts
import { useCallback } from 'react'

interface EventParams {
  action: string
  category?: string
  label?: string
  value?: number
  [key: string]: any
}

export const useAnalytics = () => {
  const trackEvent = useCallback((params: EventParams) => {
    if (!window.gtag) return

    window.gtag('event', params.action, {
      event_category: params.category || 'general',
      event_label: params.label,
      value: params.value,
      ...Object.fromEntries(
        Object.entries(params).filter(
          ([key]) => !['action', 'category', 'label', 'value'].includes(key)
        )
      )
    })
  }, [])

  return { trackEvent }
}
```

### AWS CloudWatch

**Lambda Logging:**

```javascript
// lambda/process-form/index.js
exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event))

  try {
    // Process records
    for (const record of event.Records) {
      console.log('Processing record:', record.eventID)

      // Extract data
      const newItem = record.dynamodb.NewImage
      console.log('New item:', JSON.stringify(newItem))

      // Process form
      await processContactForm(newItem)
    }

    console.log('Processing completed successfully')
    return { statusCode: 200 }
  } catch (error) {
    console.error('Error processing records:', error)
    throw error
  }
}
```

**CloudWatch Alarms:**

```hcl
# terraform/monitoring.tf
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors lambda function errors"

  dimensions = {
    FunctionName = aws_lambda_function.process_form.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"
}
```

---

## 12-Maintenance

### Regular Updates

**Dependency Updates:**

```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Update a specific package
npm update react react-dom

# Update to latest major versions (with caution)
npx npm-check-updates -u
npm install
```

**Security Updates:**

```bash
# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix

# Fix security issues with major version changes
npm audit fix --force
```

### Backup Strategy

**Code Repository:**

- Main repository on GitHub
- Regular commits and pushes
- Protected main branch
- Pull request workflow

**DynamoDB Backups:**

```hcl
# terraform/backup.tf
resource "aws_dynamodb_table" "blog_posts" {
  # ... other configuration

  point_in_time_recovery {
    enabled = true
  }
}
```

**Content Backups:**

```bash
# Export blog posts to JSON
npm run blog:export

# Backup images to S3
npm run blog:backup-images
```

### Security Audits

**Regular Security Checks:**

```bash
# Check for security vulnerabilities
npm audit

# Check for outdated dependencies
npm outdated

# Run security linting
npm run lint:security
```

**AWS Security Checks:**

```bash
# Check AWS security with AWS CLI
aws securityhub get-findings --filter '{"ResourceAwsAccountId": [{"Value": "YOUR_ACCOUNT_ID", "Comparison": "EQUALS"}], "WorkflowStatus": [{"Value": "NEW", "Comparison": "EQUALS"}]}'

# Check IAM access analyzer
aws accessanalyzer list-findings
```

### Content Management

**Blog Post Updates:**

```bash
# Update blog posts in DynamoDB
npm run blog:update

# Rebuild and deploy
npm run build
```

**Image Management:**

```bash
# Process new blog images
npm run blog:images

# Upload images to S3
npm run blog:s3-upload
```

---

## 13-Troubleshooting

### Common Issues

**Build Failures:**

```
Issue: Build fails with "Cannot find module"
Solution:
1. Clear npm cache: npm cache clean --force
2. Delete node_modules: rm -rf node_modules
3. Reinstall dependencies: npm install
4. Try building again: npm run build
```

**API Connection Issues:**

```
Issue: Cannot connect to AppSync API
Solution:
1. Check environment variables are set correctly
2. Verify API key is valid and not expired
3. Check network connectivity
4. Verify CORS settings in AppSync console
```

**Image Loading Issues:**

```
Issue: Blog images not loading
Solution:
1. Verify image paths are correct
2. Check if images exist in the correct directory
3. Run image processing: npm run blog:images
4. Check browser console for 404 errors
5. Verify S3 permissions if using S3 for images
```

### Debugging Techniques

**React DevTools:**

```
1. Install React DevTools browser extension
2. Use Components tab to inspect component hierarchy
3. Use Profiler tab to identify performance bottlenecks
```

**Network Debugging:**

```
1. Open browser DevTools
2. Go to Network tab
3. Filter by XHR/Fetch requests
4. Look for failed requests (red)
5. Check request/response details
```

**Performance Debugging:**

```
1. Open browser DevTools
2. Go to Performance tab
3. Record page load or interaction
4. Analyze render times and bottlenecks
5. Look for long tasks and layout shifts
```

### AWS Troubleshooting

**Lambda Function Logs:**

```bash
# Get Lambda function logs
aws logs get-log-events \
  --log-group-name "/aws/lambda/jeff-dev-process-form" \
  --log-stream-name "$(aws logs describe-log-streams \
    --log-group-name "/aws/lambda/jeff-dev-process-form" \
    --order-by LastEventTime \
    --descending \
    --limit 1 \
    --query 'logStreams[0].logStreamName' \
    --output text)"
```

**AppSync Testing:**

```
1. Go to AWS AppSync Console
2. Select your API
3. Go to Queries tab
4. Test queries and mutations directly
5. Check response and errors
```

**DynamoDB Inspection:**

```bash
# Scan DynamoDB table
aws dynamodb scan \
  --table-name ContactForms \
  --limit 10
```

### Support Resources

**Documentation:**

- React Documentation: https://reactjs.org/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs
- AWS AppSync Documentation: https://docs.aws.amazon.com/appsync
- Terraform Documentation: https://www.terraform.io/docs

**Community Support:**

- Stack Overflow
- GitHub Issues
- AWS Forums
- React Discord

---

## 14-Best-Practices

### Code Organization

**File Structure:**

- Group by feature, not by type
- Keep related files close together
- Use index files for cleaner imports
- Maintain consistent naming conventions

**Import Organization:**

```typescript
// External dependencies
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Internal utilities and hooks
import { formatDate } from '@/utils/formatDate'
import { useTheme } from '@/hooks/useTheme'

// Components
import Card from '@/components/common/Card'
import Button from '@/components/ui/Button'

// Styles and assets
import '@/styles/BlogPost.css'
import blogImage from '@/assets/blog.jpg'
```

### Component Design

**Component Principles:**

1. Single Responsibility: Each component should do one thing well
2. Composition: Prefer composition over inheritance
3. Reusability: Design components for reuse
4. Testability: Make components easy to test

**Component Template:**

```typescript
import React from 'react'

interface ComponentProps {
  // Define props with TypeScript
  title: string
  onClick?: () => void
}

/**
 * Component description
 *
 * @example
 * <Component title="Example" onClick={() => console.log('clicked')} />
 */
const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  // Component logic

  return (
    <div className='component' onClick={onClick}>
      <h2>{title}</h2>
    </div>
  )
}

export default Component
```

### State Management

**State Management Principles:**

1. Keep state as local as possible
2. Lift state up when needed
3. Use context for global state
4. Consider performance implications

**Custom Hooks:**

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T): void => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    setStoredValue(readValue())
  }, [])

  return [storedValue, setValue]
}
```

### Performance Optimization

**Memoization:**

```typescript
import React, { useMemo, useCallback } from 'react'

interface ExpensiveComponentProps {
  data: number[]
  onItemClick: (item: number) => void
}

const ExpensiveComponent: React.FC<ExpensiveComponentProps> = ({
  data,
  onItemClick
}) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    console.log('Processing data...')
    return data.map((item) => item * 2)
  }, [data])

  // Memoize callback functions
  const handleItemClick = useCallback(
    (item: number) => {
      console.log('Item clicked:', item)
      onItemClick(item)
    },
    [onItemClick]
  )

  return (
    <div>
      {processedData.map((item, index) => (
        <button key={index} onClick={() => handleItemClick(item)}>
          {item}
        </button>
      ))}
    </div>
  )
}

// Memoize the entire component
export default React.memo(ExpensiveComponent)
```

**Virtualization:**

```typescript
import React from 'react'
import { FixedSizeList as List } from 'react-window'

interface ItemData {
  items: string[]
  onItemClick: (item: string) => void
}

const Row: React.FC<{
  index: number
  style: React.CSSProperties
  data: ItemData
}> = ({ index, style, data }) => {
  const { items, onItemClick } = data
  const item = items[index]

  return (
    <div style={style} onClick={() => onItemClick(item)} className='list-item'>
      {item}
    </div>
  )
}

const VirtualizedList: React.FC<{
  items: string[]
  onItemClick: (item: string) => void
}> = ({ items, onItemClick }) => {
  const itemData: ItemData = { items, onItemClick }

  return (
    <List
      height={400}
      width='100%'
      itemCount={items.length}
      itemSize={50}
      itemData={itemData}
    >
      {Row}
    </List>
  )
}

export default VirtualizedList
```

### Security

**Content Security Policy:**

```html
<!-- public/index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://example.cloudfront.net;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.amazonaws.com https://*.appsync-api.*.amazonaws.com;
  frame-src https://www.google.com/recaptcha/;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
/>
```

**Secure Coding Practices:**

1. Validate all inputs
2. Sanitize outputs
3. Use HTTPS for all requests
4. Implement proper authentication and authorization
5. Keep dependencies updated
6. Follow the principle of least privilege
7. Implement proper error handling
8. Use secure headers
9. Protect against common web vulnerabilities (XSS, CSRF, etc.)
10. Regularly audit code for security issues

---

## 15-Resources

### Documentation

**Official Documentation:**

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync)
- [AWS Amplify Documentation](https://docs.amplify.aws)
- [Terraform Documentation](https://www.terraform.io/docs)

**Additional Resources:**

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Web Vitals](https://web.dev/vitals/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)

### Tools

**Development Tools:**

- [VS Code](https://code.visualstudio.com/) - Code editor
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) - React debugging
- [AWS CLI](https://aws.amazon.com/cli/) - AWS command line interface
- [Terraform CLI](https://www.terraform.io/downloads) - Infrastructure as code
- [Postman](https://www.postman.com/) - API testing

**VS Code Extensions:**

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GraphQL
- AWS Toolkit
- Terraform
- vscode-styled-components

### Libraries

**Core Libraries:**

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type system
- [React Router](https://reactrouter.com/) - Routing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Three.js](https://threejs.org/) - 3D library
- [AWS Amplify](https://aws.amazon.com/amplify/) - Cloud development platform

**Testing Libraries:**

- [Vitest](https://vitest.dev/) - Testing framework
- [Testing Library](https://testing-library.com/) - Testing utilities
- [MSW](https://mswjs.io/) - API mocking

**Utility Libraries:**

- [date-fns](https://date-fns.org/) - Date utilities
- [lodash](https://lodash.com/) - General utilities
- [zod](https://github.com/colinhacks/zod) - Schema validation
- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization

### References

**Style Guides:**

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Performance:**

- [Web Vitals](https://web.dev/vitals/)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Security:**

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
