# Website Visual Documentation

## Core Layout Structure

### Root Layout (`RootLayout`)

The application uses a Next.js App Router layout system with the following structure:

```tsx
<html lang='en' className={`${inter.variable} ${merriweather.variable}`}>
  <body className='bg-[var(--color-cream-bg)] dark:bg-gray-900'>
    <ThemedApp>
      <div className='relative min-h-screen flex flex-col'>
        <BackgroundAnimation />
        <Header />
        <main className='flex-grow w-full'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ThemedApp>
  </body>
</html>
```

### Theme Provider (`ThemedApp`)

- Uses next-themes for theme management
- Handles system preference detection
- Manages theme persistence
- Provides viewport height calculations

## Background Animation System

### Line Art Background (`BackgroundAnimation`)

A canvas-based animation system that creates an interactive network effect:

#### Visual Characteristics

- **Node Colors**: Theme-aware with light/dark mode support
- **Line Colors**:
  - Light mode: `rgba(0,0,0,0.03)`
  - Dark mode: `rgba(255,255,255,0.03)`
- **Performance**: Optimized for mobile and desktop

#### Animation Features

1. **Node Network**

   ```typescript
   class Node {
     x: number
     y: number
     vx: number
     vy: number
     width: number
     height: number
   }
   ```

   - Dynamic node count based on viewport size
   - Smooth particle movement
   - Edge bounce physics

2. **Connection System**

   - Maximum distance: 150px
   - Automatic connection drawing
   - Theme-aware line rendering

3. **Performance Optimizations**
   - RequestAnimationFrame for smooth animation
   - Viewport-based node count calculation
   - Efficient canvas clearing
   - Mobile-specific optimizations

### Theme Support

- Dark/Light mode via next-themes
- CSS variables for colors
- Smooth transitions (800ms)
- System preference detection

## Responsive Design

### Mobile Considerations

- Dynamic viewport height calculation
- Reduced animation complexity
- Touch-friendly interactions
- Proper viewport meta tags

### Desktop Enhancements

- Higher node count
- More complex connections
- Mouse interaction support
- Rich hover effects

## CSS Architecture

### Base Styles

```css
@layer base {
  :root {
    /* Color variables */
    --color-primary-light: #5eead4;
    --color-primary: #14b8a6;
    --color-primary-dark: #0f766e;
    /* ... other variables ... */
  }

  body {
    @apply bg-[var(--color-cream-bg)] dark:bg-gray-900;
    @apply text-gray-900 dark:text-white;
    @apply font-sans;
  }
}
```

### Component Classes

```css
@layer components {
  .card {
    @apply bg-[var(--color-cream-bg)] dark:bg-gray-800;
    @apply rounded-lg shadow-lg overflow-hidden;
    @apply transition-colors duration-500;
  }

  .btn {
    @apply px-6 py-2 rounded-lg font-medium;
    @apply transition-colors duration-500;
  }
}
```

### Utility Classes

```css
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r;
  }

  .glass {
    @apply bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm;
  }
}
```

## Performance Considerations

### Animation Optimization

- Throttled resize handlers
- Efficient node updates
- Canvas size optimization
- Mobile-specific node count

### Theme Transitions

- Smooth color transitions
- Hardware-accelerated animations
- Reduced motion support
- Efficient class toggling

## Implementation Notes

### Critical Measurements

- Header height: 96px (h-24)
- Content max-width: 1280px (max-w-7xl)
- Page padding: 1.5rem mobile, 3rem desktop
- Animation node distance: 150px

### Browser Support

- Modern browser focus
- Next.js polyfills
- Fallback handling
- Mobile optimization

## Best Practices

1. **Performance**

   - Canvas optimization
   - Theme transition smoothing
   - Image optimization
   - Font loading strategy

2. **Accessibility**

   - ARIA attributes
   - Keyboard navigation
   - Screen reader support
   - Color contrast compliance

3. **Maintainability**

   - Consistent class naming
   - Component documentation
   - Type definitions
   - Clear architecture

4. **Responsiveness**
   - Mobile-first approach
   - Breakpoint consistency
   - Fluid typography
   - Adaptive layouts
