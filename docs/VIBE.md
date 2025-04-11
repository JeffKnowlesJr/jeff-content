# Vibe Coding

This document outlines approaches to improve the overall "vibe" of our codebase - making it more enjoyable to work with, more intuitive, and more aligned with modern development aesthetics.

## What is Vibe Coding?

Vibe coding is about creating a development experience that feels good. It's about:

- Clean, consistent code that's pleasing to read
- Developer experience that reduces friction
- Visual and structural harmony across the codebase
- Thoughtful defaults that "just work"
- Eliminating unnecessary complexity

## Vibe Improvements for Our Codebase

### 1. Consistent File & Directory Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Generic UI elements
│   ├── layout/        # Layout components
│   └── [feature]/     # Feature-specific components
├── hooks/             # Custom React hooks
├── services/          # API and external services
├── utils/             # Utility functions
├── styles/            # Global styles
└── app/               # Next.js app router pages
```

- Group related files together
- Use consistent naming conventions (kebab-case for files, PascalCase for components)
- Keep directory depth manageable (max 3-4 levels deep)

### 2. Code Aesthetics & Formatting

- Use Prettier with consistent settings
- Add whitespace strategically for readability
- Organize imports in a consistent order:
  1. React/Next.js
  2. External libraries
  3. Internal absolute imports
  4. Internal relative imports
  5. CSS/style imports

### 3. Intentional Comments

- Replace "how" comments with "why" comments
- Use JSDoc for public functions and interfaces
- Add code section headers for longer files
- Remove commented-out code - use git history instead

### 4. Developer Experience Enhancements

- Add useful VS Code settings in .vscode/settings.json
- Create snippets for common patterns
- Add a dev/debug route that shows component playground
- Improve error messages with actionable suggestions

### 5. Reduce Boilerplate

- Create higher-order components for common patterns
- Use custom hooks to encapsulate repeated logic
- Extract config into separate files
- Use TypeScript utility types to avoid repetition

### 6. Visual Harmony

- Consistent spacing (8px grid system)
- Limited color palette from design tokens
- Consistent animation timings and curves
- Component composition over complex conditionals

### 7. Performance and Feel

- Add subtle loading states
- Implement optimistic UI updates
- Use smooth transitions between states
- Prefer CSS transitions over JS animations for UI

## Specific Vibe Improvement Tasks

1. **Implement Component Showcase**

   - Create a `/debug` route with examples of all components
   - Add interactive props controls

2. **Standardize Error Handling**

   - Create a `<ErrorBoundary>` with helpful messages
   - Add consistent error UIs for API failures

3. **Enhance Code Editor Experience**

   - Add useful VS Code extensions recommendations
   - Create custom snippets for common patterns

4. **Streamline GraphQL Operations**

   - Create a more elegant GraphQL client wrapper
   - Add type generation from schema

5. **Improve Project Documentation**
   - Add diagrams for architecture
   - Create a "Getting Started" guide with visuals
   - Add animated GIFs for complex workflows

## Measuring Vibe

Good vibes can be measured by:

- Reduced onboarding time for new developers
- Fewer questions about "how does this work?"
- More consistent code reviews
- Faster development cycles
- Positive feedback on codebase organization

## Next Steps

1. Do a "vibe audit" of the codebase
2. Identify the top 3 friction points
3. Create small, focused PRs to address each one
4. Establish coding standards that prioritize vibe
5. Set up automation to maintain the vibe
