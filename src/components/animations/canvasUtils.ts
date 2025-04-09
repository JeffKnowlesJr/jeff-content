// Type for animation creation function
export type AnimationCreator = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  theme: string | undefined
) => {
  update: () => void
  draw: () => void
  cleanup: () => void
}

/**
 * Sets up a canvas element with an animation
 * @param canvas The canvas element to set up
 * @param createAnimation Function that creates the animation
 * @param theme Current theme
 * @returns Cleanup function
 */
export function setupCanvas(
  canvas: HTMLCanvasElement,
  createAnimation: AnimationCreator,
  theme: string | undefined
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  // Initial resize
  resizeCanvas()

  // Create animation
  const animation = createAnimation(canvas, ctx, theme)

  // Animation loop
  let animationFrameId: number
  const animate = () => {
    animation.update()
    animation.draw()
    animationFrameId = requestAnimationFrame(animate)
  }

  // Start animation
  animate()

  // Add resize listener
  window.addEventListener('resize', resizeCanvas)

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationFrameId)
    animation.cleanup()
  }
}
