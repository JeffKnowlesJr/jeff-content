# Backend SPA Setup Guide

This document outlines how to set up a separate Single Page Application (SPA) for the backend/admin interface that complements the main Next.js content site while sharing the existing AppSync API.

## Project Organization

```
admin-spa/
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD workflows
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, etc.
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Basic UI elements
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── tables/             # Table components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   │   ├── auth/               # Authentication pages
│   │   ├── blog/               # Blog management pages
│   │   ├── dashboard/          # Dashboard pages
│   │   └── projects/           # Project management pages
│   ├── services/               # API and external services
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Vite type definitions
├── .env.example                # Example environment variables
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore file
├── amplify.yml                 # Amplify build configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Feature Modules

### 1. Authentication Module

**Location:** `src/pages/auth/` and `src/context/AuthContext.tsx`

**Features:**

- User login/logout
- Session management
- Role-based access control
- Password reset functionality

**Implementation Status:** Core login/logout implemented

**Planned Enhancements:**

- Multi-factor authentication
- Role-based permissions
- Session timeout configuration

### 2. Content Management Module

**Location:** `src/pages/blog/` and `src/pages/projects/`

**Features:**

- Blog post CRUD operations
- Project management
- Content scheduling
- Draft/preview functionality

**Implementation Status:** Basic blog listing implemented

**Planned Enhancements:**

- Rich text editor integration
- Image upload and management
- Version history
- Publishing workflow

### 3. Dashboard Module

**Location:** `src/pages/dashboard/`

**Features:**

- Overview statistics
- Recent activity feed
- Quick actions
- Performance metrics

**Implementation Status:** Basic dashboard shell implemented

**Planned Enhancements:**

- Interactive charts and graphs
- Customizable dashboard widgets
- Real-time content updates

### 4. User Management Module

**Location:** `src/pages/users/` (to be implemented)

**Features:**

- User account management
- Role assignment
- Permission management
- Activity logging

**Implementation Status:** Not started

**Planned Enhancements:**

- User invitation system
- Detailed access logs
- Permission templates

## Known Issues and Limitations

| ID  | Issue                                                        | Priority | Status | Resolution Plan                                         |
| --- | ------------------------------------------------------------ | -------- | ------ | ------------------------------------------------------- |
| 1   | Style JSX syntax may not be compatible with all React setups | Medium   | Open   | Replace with CSS modules or styled-components           |
| 2   | AppSync IAM authentication requires proper IAM role setup    | High     | Open   | Document IAM policy requirements in detail              |
| 3   | Missing comprehensive error handling                         | Medium   | Open   | Implement global error boundary and consistent error UI |
| 4   | No offline support                                           | Low      | Open   | Implement local storage caching and sync                |
| 5   | Form validation is minimal                                   | Medium   | Open   | Add comprehensive validation with error messages        |

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- ✅ Core authentication system
- ✅ Basic dashboard shell
- ✅ Content listing views
- ⬜ AppSync integration with IAM auth
- ⬜ CI/CD pipeline setup

### Phase 2: Core Functionality (Week 3-4)

- ⬜ Full blog content management
- ⬜ Project management
- ⬜ Image upload functionality
- ⬜ Form validation and error handling
- ⬜ User profile management

### Phase 3: Advanced Features (Week 5-6)

- ⬜ Rich text editor integration
- ⬜ Content scheduling
- ⬜ Analytics dashboard
- ⬜ User management
- ⬜ Role-based access control

### Phase 4: Optimization & Polish (Week 7-8)

- ⬜ Performance optimization
- ⬜ Responsive design refinements
- ⬜ Accessibility improvements
- ⬜ Comprehensive testing
- ⬜ Production deployment

## Development Environment Setup

Follow these steps to set up your local development environment:

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/admin-spa.git
   cd admin-spa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file based on `.env.example`:

   ```
   VITE_APPSYNC_ENDPOINT=https://your-appsync-endpoint.appsync-api.region.amazonaws.com/graphql
   VITE_AWS_REGION=us-west-2
   VITE_USER_POOL_ID=us-west-2_xxxxxxxxx
   VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxx
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   The app will be available at `http://localhost:5173`

## AWS Deployment

### Creating a New Amplify App

1. **Open AWS Amplify Console**

   - Navigate to AWS Amplify in your AWS Console
   - Click "New app" → "Host web app"

2. **Connect to GitHub**

   - Select GitHub as your repository provider
   - Authenticate and select your repository

3. **Configure Build Settings**

   - The build settings should be automatically detected from your `amplify.yml`
   - Add environment variables as defined in `.env.example`

4. **Set Up Domain**
   - Use a separate subdomain like `admin.yourdomain.com`
   - Configure DNS records as provided by Amplify

### Security Configuration

1. **Configure Security Headers**

   Ensure your `amplify.yml` includes:

   ```yaml
   customHeaders:
     - pattern: '**/*'
       headers:
         - key: 'Strict-Transport-Security'
           value: 'max-age=31536000; includeSubDomains'
         - key: 'X-Frame-Options'
           value: 'DENY'
         - key: 'X-XSS-Protection'
           value: '1; mode=block'
         - key: 'X-Content-Type-Options'
           value: 'nosniff'
         - key: 'Content-Security-Policy'
           value: "default-src 'self'; connect-src 'self' https://*.amazonaws.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
   ```

2. **Auth Configuration**
   - Ensure Cognito User Pool has high password requirements
   - Enable MFA if needed
   - Set appropriate session timeouts

## Testing Strategy

### Unit Testing

- Component tests with React Testing Library
- Service and utility function tests
- Auth context testing

### Integration Testing

- API integration tests
- Form submission flows
- Authentication flows

### End-to-End Testing

- Critical user journeys
- Cross-browser testing
- Mobile responsiveness testing

## Contribution Guidelines

### Code Style

- Follow the TypeScript style guide
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive comments

### Pull Request Process

1. Create feature branches from `develop`
2. Update documentation with changes
3. Ensure all tests pass
4. Request review from at least one team member
5. Squash commits on merge

## Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Mantine UI Components](https://mantine.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Implementation Details

This section will grow as features are implemented. Key implementation details will be documented here to facilitate knowledge sharing and maintenance.

### Code Samples and Implementation Guide

Refer to the original basic implementation details in the appendix section below.

---

## Appendix: Basic Implementation

### Utility Functions

Core authentication configuration from `src/utils/auth-config.ts`:

```typescript
import { Amplify, Auth } from 'aws-amplify'

export function configureAmplify() {
  Amplify.configure({
    // AppSync API configuration
    API: {
      GraphQL: {
        endpoint:
          import.meta.env.VITE_APPSYNC_ENDPOINT ||
          process.env.REACT_APP_APPSYNC_ENDPOINT,
        region:
          import.meta.env.VITE_AWS_REGION || process.env.REACT_APP_AWS_REGION,
        // For admin SPA, we'll use IAM auth rather than API key
        authenticationType: 'AWS_IAM'
      }
    },
    // Cognito configuration for user authentication
    Auth: {
      region:
        import.meta.env.VITE_AWS_REGION || process.env.REACT_APP_AWS_REGION,
      userPoolId:
        import.meta.env.VITE_USER_POOL_ID || process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId:
        import.meta.env.VITE_USER_POOL_CLIENT_ID ||
        process.env.REACT_APP_USER_POOL_CLIENT_ID,
      mandatorySignIn: true
    }
  })
}

// Helper functions for authentication
export async function getCurrentUser() {
  try {
    return await Auth.currentAuthenticatedUser()
  } catch (error) {
    return null
  }
}

export async function signIn(username: string, password: string) {
  return Auth.signIn(username, password)
}

export async function signOut() {
  return Auth.signOut()
}
```

### API Service

Basic API service from `src/services/api-service.ts`:

```typescript
import { API, graphqlOperation } from 'aws-amplify'

// Generic GraphQL query function
export async function query(queryString: string, variables = {}) {
  try {
    const response = await API.graphql(graphqlOperation(queryString, variables))
    return response
  } catch (error) {
    console.error('GraphQL query error:', error)
    throw error
  }
}

// Generic GraphQL mutation function
export async function mutate(mutationString: string, variables = {}) {
  try {
    const response = await API.graphql(
      graphqlOperation(mutationString, variables)
    )
    return response
  } catch (error) {
    console.error('GraphQL mutation error:', error)
    throw error
  }
}

// Example specific query functions
export async function fetchBlogPosts() {
  const queryString = `
    query ListBlogPosts {
      listBlogPosts {
        items {
          id
          title
          slug
          status
          datePublished
        }
      }
    }
  `

  const result = await query(queryString)
  return result.data.listBlogPosts.items
}
```
