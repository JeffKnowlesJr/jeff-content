# Animation Troubleshooting

## Issue Description

The `EnhancedBackgroundAnimation` component is not displaying properly. The animation is either not visible at all or not showing the expected number of nodes and connections.

## Current Implementation

The current implementation attempts to replicate the original `LineArtBackground` animation with the following key features:

- Adaptive node count based on screen size
- Mobile-specific optimizations
- Touch interaction support
- Performance optimizations with device pixel ratio
- Theme-aware colors

## Attempted Fixes

### 1. Viewport and Node Generation Logic

- Updated node count calculation to match original:
  - Mobile: `Math.max(80, Math.min(220, scaledCount))`
  - Desktop: `Math.max(60, Math.min(350, scaledCount))`
- Adjusted viewport height calculation to include full scroll height
- Maintained original node radius values:
  - Mobile: 0.8-2.8 pixels
  - Desktop: 1-3 pixels

### 2. Color and Opacity Settings

- Set line color to `rgba(150, 130, 220, 0.40)`
- Set node color to `rgba(150, 130, 220, 0.55)`
- Implemented theme-aware colors for dark/light mode

### 3. Connection Distance and Opacity

- Set connection distance threshold to 150 pixels
- Implemented opacity calculation: `1 - distance / 150`

### 4. Added Debugging Code

- Added frame rate tracking to monitor animation performance
- Added connection count tracking to verify connections are being drawn
- Added detailed canvas setup logging to verify initialization
- Added periodic logging of animation statistics

### 5. Canvas Visibility Check

- Added a check to verify that the canvas is visible in the DOM
- Added a visual debug indicator (red border) to show canvas position
- Added logging of canvas dimensions and position

### 6. Fixed React Hook Dependencies

- Used useCallback to memoize the `calculateNodeCount`, `isSignificantResize`, and `initializeNodes` functions
- Updated the useEffect dependency array to include the memoized functions

## Current Status

Despite these changes, the animation is still not displaying properly. The nodes and connections are either not visible or not appearing in the expected density.

## Build Errors

The build process is showing several errors and warnings:

### 1. React Hook Dependencies Warning (Fixed)

```
./src/components/EnhancedBackgroundAnimation.tsx
694:6  Warning: React Hook useEffect has missing dependencies: 'initializeNodes' and 'isSignificantResize'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
```

### 2. Image Optimization Warnings

Several components are using `<img>` tags instead of Next.js `<Image>` component:

- `./src/components/blog/Blog.tsx` (line 58:19)
- `./src/components/navigation/MainHeader.tsx` (lines 35:17, 40:17)
- `./src/components/projects/ProjectList.tsx` (line 47:21)
- `./src/components/shared/LazyImage.tsx` (line 29:5)

### 3. Unescaped Entities Errors

Several components have unescaped entities:

- `./src/components/blog/BlogSearchResults.tsx` (lines 66:28, 66:36, 72:34, 72:42)
- `./src/components/common/ContactModal.tsx` (line 52:44)
- `./src/components/common/WorkRequestForm.tsx` (line 239:42)
- `./src/components/Hero.tsx` (line 25:57)

### 4. Unused Variables Errors

Several components have unused variables:

- `./src/components/common/Card.tsx` (lines 115:9, 120:9, 121:9, 123:9)
- `./src/components/common/ContactModal.tsx` (line 12:11)
- `./src/components/ContactForm.tsx` (line 41:13)
- `./src/components/layout/Sidebar.tsx` (lines 6:10, 73:9, 76:9, 77:9, 81:9, 82:9, 83:9, 84:9)
- `./src/components/navigation/MobileMenu.tsx` (lines 2:10, 10:58, 11:9)
- `./src/utils/imageUtils.ts` (lines 123:3, 151:12)

### 5. TypeScript Errors

- `./src/types/markdown.d.ts` (line 21:20): Unexpected any. Specify a different type.

## Debugging Information

The following debugging information has been added to help identify the issue:

1. **Canvas Setup Logging**:

   ```javascript
   console.log('LineArt: Canvas setup', {
     width: canvas.width,
     height: canvas.height,
     dpr,
     viewportWidth,
     viewportHeight
   })
   ```

2. **Frame Rate Logging**:

   ```javascript
   // Log FPS every 60 frames
   if (frameCountRef.current % 60 === 0) {
     const elapsed = now - lastFrameTimeRef.current
     const fps = 60 / (elapsed / 1000)
     console.log(`LineArt: FPS: ${fps.toFixed(1)}`)
     lastFrameTimeRef.current = now
   }
   ```

3. **Connection Count Logging**:

   ```javascript
   // Log connection count every 60 frames
   if (frameCountRef.current % 60 === 0) {
     console.log(`LineArt: ${connectionCount} connections drawn`)
   }
   ```

4. **Canvas Visibility Check**:
   ```javascript
   console.log('LineArt: Canvas visibility check', {
     width: rect.width,
     height: rect.height,
     top: rect.top,
     left: rect.left,
     isVisible
   })
   ```

## Potential Solutions

### 1. Fix React Hook Dependencies (Completed)

- Used useCallback to memoize the `calculateNodeCount`, `isSignificantResize`, and `initializeNodes` functions
- Updated the useEffect dependency array to include the memoized functions

### 2. Fix Image Optimization Warnings

Replace `<img>` tags with Next.js `<Image>` component:

```jsx
// Before
;<img src='/path/to/image.jpg' alt='Description' />

// After
import Image from 'next/image'
;<Image src='/path/to/image.jpg' alt='Description' width={500} height={300} />
```

### 3. Fix Unescaped Entities Errors

Replace unescaped quotes and apostrophes with their HTML entities:

```jsx
// Before
<p>"This is a quote"</p>
<p>It's a nice day</p>

// After
<p>&quot;This is a quote&quot;</p>
<p>It&apos;s a nice day</p>
```

### 4. Fix Unused Variables Errors

Remove or use the unused variables:

```jsx
// Before
const { theme, buttonBgColor, headingTextColor } = props

// After
const { theme } = props
// Remove unused variables or use them in the component
```

### 5. Fix TypeScript Errors

Replace `any` with a more specific type:

```typescript
// Before
function processData(data: any): void {
  // ...
}

// After
function processData(data: Record<string, unknown>): void {
  // ...
}
```

### 6. Check for Canvas Rendering Issues

- Verify that the canvas is being rendered with the correct dimensions
- Ensure that the canvas is not being hidden by other elements
- Check if the canvas is being rendered in the correct position in the DOM

### 7. Optimize Animation Performance

- Reduce the number of nodes or connections if performance is an issue
- Implement throttling or debouncing for mouse/touch events
- Use requestAnimationFrame with a lower frequency for mobile devices

### 8. Consider Alternative Implementation

- Explore using a different animation technique, such as CSS animations or SVG
- Consider using a library for canvas animations, such as PixiJS or Three.js
- Evaluate if the animation is necessary for the user experience

## Next Steps for Investigation

1. **Check Console Logs**

   - Review the console logs to verify that the canvas is being initialized correctly
   - Check if the animation loop is running at an acceptable frame rate
   - Verify that connections are being drawn in the expected quantity
   - Check if the canvas is visible in the DOM

2. **Inspect DOM**

   - Check if the canvas element is being rendered in the DOM
   - Verify that the canvas has the correct dimensions
   - Ensure that the canvas is visible and not hidden by other elements
   - Look for the red debug border to confirm canvas position

3. **Compare with Original Implementation**

   - Review the original `LineArtBackground` implementation in detail
   - Identify any differences in the animation logic
   - Check for any missing features or optimizations

4. **Test in Different Environments**

   - Test the animation in different browsers
   - Test on different devices (desktop, mobile)
   - Test with different screen sizes and orientations

5. **Fix Build Errors**
   - Address the React Hook dependencies warning (completed)
   - Fix unused variables and unescaped entities
   - Replace `<img>` tags with Next.js `<Image>` component
   - Fix TypeScript errors

## Questions to Answer

1. Is the canvas element being rendered in the DOM?
2. Is the animation loop running (check console logs)?
3. Are nodes being generated with the expected count?
4. Are the nodes and connections being drawn with the correct colors and opacity?
5. Is there any error in the console related to the animation?
6. What is the frame rate of the animation?
7. How many connections are being drawn?
8. Is the canvas visible in the DOM (check for red border)?
9. Are the React Hook dependencies causing issues with the animation?
10. Are the linting errors affecting the animation's functionality?

## Conclusion

The animation troubleshooting is ongoing. We need to systematically debug each aspect of the implementation to identify the root cause of the issue. The added debugging code will provide valuable information to help diagnose the problem. Additionally, we should address the build errors to ensure that the application is functioning correctly. The React Hook dependencies issue has been fixed, and the next step is to address the remaining linting errors and continue debugging the animation.
