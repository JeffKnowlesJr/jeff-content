import { AnimationCreator } from './canvasUtils'

// Box class with perspective and shading
class Box {
  x: number
  y: number
  width: number
  height: number
  depth: number // Z-coordinate for perspective
  baseOpacity: number
  color: string
  rotation: number
  rotationSpeed: number
  moveSpeed: number
  moveProgress: number
  moveDirection: 'x' | 'y' | 'z' | null
  targetX: number
  targetY: number
  targetDepth: number
  isMoving: boolean
  isHovered: boolean
  hoverProgress: number
  hoverSpeed: number
  frameColor: string
  frameWidth: number
  isDragging: boolean
  dragStartX: number
  dragStartY: number
  originalX: number
  originalY: number
  highlightColor: string
  highlightProgress: number
  highlightSpeed: number
  isPainted: boolean
  paintedOpacity: number

  constructor(width: number, height: number, theme: string | undefined) {
    this.width = Math.random() * 40 + 30 // Width between 30-70
    this.height = Math.random() * 40 + 30 // Height between 30-70
    this.x = Math.random() * (width - this.width)
    this.y = Math.random() * (height - this.height)
    this.depth = Math.random() * 800 // Random depth between 0-800
    this.baseOpacity = Math.random() * 0.03 + 0.01 // Increased opacity (1-4%)
    this.color =
      theme === 'dark'
        ? `rgba(255, 255, 255, ${this.baseOpacity})`
        : `rgba(0, 0, 0, ${this.baseOpacity})`
    this.rotation = Math.random() * Math.PI * 2 // Random rotation
    this.rotationSpeed = (Math.random() - 0.5) * 0.0002 // Very slow rotation
    this.moveSpeed = 0.0005 + Math.random() * 0.0005 // Very slow movement
    this.moveProgress = 0
    this.moveDirection = null
    this.targetX = this.x
    this.targetY = this.y
    this.targetDepth = this.depth
    this.isMoving = false
    this.isHovered = false
    this.hoverProgress = 0
    this.hoverSpeed = 0.05 // Speed of hover transition
    this.frameColor =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
    this.frameWidth = 1.5
    this.isDragging = false
    this.dragStartX = 0
    this.dragStartY = 0
    this.originalX = this.x
    this.originalY = this.y
    this.highlightColor =
      theme === 'dark'
        ? 'rgba(100, 200, 255, 0.3)' // Light blue for dark theme
        : 'rgba(255, 100, 100, 0.3)' // Light red for light theme
    this.highlightProgress = 0
    this.highlightSpeed = 0.1 // Speed of highlight transition
    this.isPainted = false
    this.paintedOpacity = 0
  }

  update(
    width: number,
    height: number,
    boxes: Box[],
    mouseX: number,
    mouseY: number,
    isMouseDown: boolean
  ) {
    // Update rotation
    this.rotation += this.rotationSpeed

    // Check for hover
    this.checkHover(mouseX, mouseY, width, height)

    // Update hover progress
    if (this.isHovered && this.hoverProgress < 1) {
      this.hoverProgress = Math.min(1, this.hoverProgress + this.hoverSpeed)
    } else if (!this.isHovered && this.hoverProgress > 0) {
      this.hoverProgress = Math.max(0, this.hoverProgress - this.hoverSpeed)
    }

    // Update highlight progress
    if (this.isDragging && this.highlightProgress < 1) {
      this.highlightProgress = Math.min(
        1,
        this.highlightProgress + this.highlightSpeed
      )
    } else if (!this.isDragging && this.highlightProgress > 0) {
      this.highlightProgress = Math.max(
        0,
        this.highlightProgress - this.highlightSpeed
      )
    }

    // Update painted opacity
    if (this.isPainted && this.paintedOpacity < 1) {
      this.paintedOpacity = Math.min(1, this.paintedOpacity + 0.02)
    }

    // Handle dragging
    if (this.isDragging && isMouseDown) {
      // Calculate drag offset
      const dx = mouseX - this.dragStartX
      const dy = mouseY - this.dragStartY

      // Apply perspective scaling based on depth
      const perspectiveFactor = 1000
      const scale = perspectiveFactor / (perspectiveFactor + this.depth)

      // Update position with perspective scaling
      this.x = this.originalX + dx / scale
      this.y = this.originalY + dy / scale

      // Keep within bounds
      if (this.x < 0) this.x = 0
      if (this.x > width - this.width) this.x = width - this.width
      if (this.y < 0) this.y = 0
      if (this.y > height - this.height) this.y = height - this.height
    } else if (this.isDragging && !isMouseDown) {
      // Stop dragging
      this.isDragging = false
      this.originalX = this.x
      this.originalY = this.y
    }

    // If not moving and not being dragged, randomly decide to move (very rarely)
    if (!this.isMoving && !this.isDragging && Math.random() < 0.0005) {
      this.startNewMovement(width, height, boxes)
    }

    // If moving, update position
    if (this.isMoving) {
      this.moveProgress += this.moveSpeed

      if (this.moveProgress >= 1) {
        // Movement complete
        this.x = this.targetX
        this.y = this.targetY
        this.depth = this.targetDepth
        this.isMoving = false
        this.moveDirection = null
        this.moveProgress = 0
      } else {
        // Ease in-out function for smooth movement
        const t = this.moveProgress
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

        if (this.moveDirection === 'x') {
          this.x = this.x + (this.targetX - this.x) * easeT
        } else if (this.moveDirection === 'y') {
          this.y = this.y + (this.targetY - this.y) * easeT
        } else if (this.moveDirection === 'z') {
          this.depth = this.depth + (this.targetDepth - this.depth) * easeT
        }
      }
    }
  }

  checkHover(mouseX: number, mouseY: number, width: number, height: number) {
    // Apply perspective scaling based on depth
    const perspectiveFactor = 1000 // Controls perspective strength
    const scale = perspectiveFactor / (perspectiveFactor + this.depth)

    // Calculate scaled dimensions
    const scaledWidth = this.width * scale
    const scaledHeight = this.height * scale

    // Calculate position with perspective offset
    const centerX = width / 2
    const centerY = height / 2
    const offsetX = (this.x + this.width / 2 - centerX) * (1 - scale)
    const offsetY = (this.y + this.height / 2 - centerY) * (1 - scale)

    const drawX = this.x - offsetX
    const drawY = this.y - offsetY

    // Check if mouse is within the box bounds
    const isInBounds =
      mouseX >= drawX &&
      mouseX <= drawX + scaledWidth &&
      mouseY >= drawY &&
      mouseY <= drawY + scaledHeight

    this.isHovered = isInBounds
  }

  startDrag(mouseX: number, mouseY: number) {
    if (this.isHovered) {
      this.isDragging = true
      this.dragStartX = mouseX
      this.dragStartY = mouseY
      this.originalX = this.x
      this.originalY = this.y
      return true
    }
    return false
  }

  startNewMovement(width: number, height: number, boxes: Box[]) {
    // Decide whether to move horizontally, vertically, or in depth
    const rand = Math.random()
    if (rand < 0.4) {
      this.moveDirection = 'x'
    } else if (rand < 0.8) {
      this.moveDirection = 'y'
    } else {
      this.moveDirection = 'z'
    }

    // Find a new target position
    if (this.moveDirection === 'x') {
      // Move horizontally
      const direction = Math.random() < 0.5 ? -1 : 1
      const distance = Math.random() * 50 + 25 // 25-75px (reduced from previous)
      this.targetX = this.x + direction * distance

      // Keep within bounds
      if (this.targetX < 0) this.targetX = 0
      if (this.targetX > width - this.width) this.targetX = width - this.width
    } else if (this.moveDirection === 'y') {
      // Move vertically
      const direction = Math.random() < 0.5 ? -1 : 1
      const distance = Math.random() * 50 + 25 // 25-75px (reduced from previous)
      this.targetY = this.y + direction * distance

      // Keep within bounds
      if (this.targetY < 0) this.targetY = 0
      if (this.targetY > height - this.height)
        this.targetY = height - this.height
    } else {
      // Move in depth (z-axis)
      const direction = Math.random() < 0.5 ? -1 : 1
      const distance = Math.random() * 100 + 50 // 50-150 units (reduced from previous)
      this.targetDepth = this.depth + direction * distance

      // Keep within reasonable depth range
      if (this.targetDepth < 0) this.targetDepth = 0
      if (this.targetDepth > 1000) this.targetDepth = 1000
    }

    // Check for collisions with other boxes
    let hasCollision = false
    for (const box of boxes) {
      if (box === this) continue

      if (this.moveDirection === 'x') {
        if (this.willCollideX(box)) {
          hasCollision = true
          break
        }
      } else if (this.moveDirection === 'y') {
        if (this.willCollideY(box)) {
          hasCollision = true
          break
        }
      }
      // No collision check for z-axis movement
    }

    // If collision, don't move
    if (hasCollision) {
      this.isMoving = false
      this.moveDirection = null
    } else {
      this.isMoving = true
      this.moveProgress = 0
    }
  }

  willCollideX(other: Box): boolean {
    // Check if moving horizontally would cause collision
    const thisLeft = this.x
    const thisRight = this.x + this.width
    const thisTop = this.y
    const thisBottom = this.y + this.height

    const otherLeft = other.x
    const otherRight = other.x + other.width
    const otherTop = other.y
    const otherBottom = other.y + other.height

    // Check if boxes overlap vertically
    const verticalOverlap = !(thisBottom < otherTop || thisTop > otherBottom)

    if (!verticalOverlap) return false

    // Check if moving would cause horizontal overlap
    if (this.targetX < this.x) {
      // Moving left
      return this.targetX < otherRight && thisLeft > otherLeft
    } else {
      // Moving right
      return this.targetX + this.width > otherLeft && thisRight < otherRight
    }
  }

  willCollideY(other: Box): boolean {
    // Check if moving vertically would cause collision
    const thisLeft = this.x
    const thisRight = this.x + this.width
    const thisTop = this.y
    const thisBottom = this.y + this.height

    const otherLeft = other.x
    const otherRight = other.x + other.width
    const otherTop = other.y
    const otherBottom = other.y + other.height

    // Check if boxes overlap horizontally
    const horizontalOverlap = !(thisRight < otherLeft || thisLeft > otherRight)

    if (!horizontalOverlap) return false

    // Check if moving would cause vertical overlap
    if (this.targetY < this.y) {
      // Moving up
      return this.targetY < otherBottom && thisTop > otherTop
    } else {
      // Moving down
      return this.targetY + this.height > otherTop && thisBottom < otherBottom
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Apply perspective scaling based on depth
    const perspectiveFactor = 1000 // Controls perspective strength
    const scale = perspectiveFactor / (perspectiveFactor + this.depth)

    // Calculate scaled dimensions
    const scaledWidth = this.width * scale
    const scaledHeight = this.height * scale

    // Calculate position with perspective offset
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const offsetX = (this.x + this.width / 2 - centerX) * (1 - scale)
    const offsetY = (this.y + this.height / 2 - centerY) * (1 - scale)

    const drawX = this.x - offsetX
    const drawY = this.y - offsetY

    // Save context state
    ctx.save()

    // Translate to center of box for rotation
    ctx.translate(drawX + scaledWidth / 2, drawY + scaledHeight / 2)
    ctx.rotate(this.rotation)

    // Apply shading based on depth
    const depthShading = Math.max(0.5, 1 - this.depth / 1000)
    const opacity = this.baseOpacity * depthShading

    // Draw the box with perspective and shading
    ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${opacity})`)

    // Draw with slight gradient for 3D effect
    const gradient = ctx.createLinearGradient(
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth / 2,
      scaledHeight / 2
    )

    // Normal gradient
    if (this.color.includes('255, 255, 255')) {
      // Light theme
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 1.2})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.8})`)
    } else {
      // Dark theme
      gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity * 1.2})`)
      gradient.addColorStop(1, `rgba(0, 0, 0, ${opacity * 0.8})`)
    }

    ctx.fillStyle = gradient

    // Draw the box
    ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)

    // If hovered or being dragged, draw cube frame
    if (this.hoverProgress > 0 || this.isDragging) {
      // Calculate cube dimensions based on hover progress
      const cubeSize = Math.min(scaledWidth, scaledHeight)
      const cubeScale = 0.8 + this.hoverProgress * 0.2 // Scale from 0.8 to 1.0
      const finalCubeSize = cubeSize * cubeScale

      // Draw cube frame
      if (this.isDragging) {
        // Use highlight color for the frame when dragging
        ctx.strokeStyle = this.highlightColor
        ctx.lineWidth = this.frameWidth * (1 + this.highlightProgress)
      } else {
        ctx.strokeStyle = this.frameColor
        ctx.lineWidth = this.frameWidth * this.hoverProgress
      }

      // Draw front face
      ctx.strokeRect(
        -finalCubeSize / 2,
        -finalCubeSize / 2,
        finalCubeSize,
        finalCubeSize
      )

      // Draw back face (offset by depth)
      const depthOffset =
        finalCubeSize * 0.2 * (this.isDragging ? 1 : this.hoverProgress)
      ctx.strokeRect(
        -finalCubeSize / 2 + depthOffset,
        -finalCubeSize / 2 + depthOffset,
        finalCubeSize,
        finalCubeSize
      )

      // Draw connecting lines - FIXED to correctly connect the corners
      ctx.beginPath()
      // Front top-left to back top-left
      ctx.moveTo(-finalCubeSize / 2, -finalCubeSize / 2)
      ctx.lineTo(
        -finalCubeSize / 2 + depthOffset,
        -finalCubeSize / 2 + depthOffset
      )
      // Front top-right to back top-right
      ctx.moveTo(finalCubeSize / 2, -finalCubeSize / 2)
      ctx.lineTo(
        finalCubeSize / 2 + depthOffset,
        -finalCubeSize / 2 + depthOffset
      )
      // Front bottom-right to back bottom-right
      ctx.moveTo(finalCubeSize / 2, finalCubeSize / 2)
      ctx.lineTo(
        finalCubeSize / 2 + depthOffset,
        finalCubeSize / 2 + depthOffset
      )
      // Front bottom-left to back bottom-left
      ctx.moveTo(-finalCubeSize / 2, finalCubeSize / 2)
      ctx.lineTo(
        -finalCubeSize / 2 + depthOffset,
        finalCubeSize / 2 + depthOffset
      )
      ctx.stroke()

      // If painted, draw filled cube with highlight color
      if (this.isPainted && this.paintedOpacity > 0) {
        const paintedColor = this.highlightColor.replace(
          /[\d.]+\)$/,
          `${this.paintedOpacity * 0.15})`
        )
        ctx.fillStyle = paintedColor

        // Draw filled cube
        ctx.fillRect(
          -finalCubeSize / 2,
          -finalCubeSize / 2,
          finalCubeSize,
          finalCubeSize
        )

        // Draw back face with fill
        ctx.fillRect(
          -finalCubeSize / 2 + depthOffset,
          -finalCubeSize / 2 + depthOffset,
          finalCubeSize,
          finalCubeSize
        )

        // Draw connecting faces
        ctx.beginPath()
        // Top face
        ctx.moveTo(-finalCubeSize / 2, -finalCubeSize / 2)
        ctx.lineTo(
          -finalCubeSize / 2 + depthOffset,
          -finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(
          finalCubeSize / 2 + depthOffset,
          -finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(finalCubeSize / 2, -finalCubeSize / 2)
        ctx.closePath()
        ctx.fill()

        // Right face
        ctx.beginPath()
        ctx.moveTo(finalCubeSize / 2, -finalCubeSize / 2)
        ctx.lineTo(
          finalCubeSize / 2 + depthOffset,
          -finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(
          finalCubeSize / 2 + depthOffset,
          finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(finalCubeSize / 2, finalCubeSize / 2)
        ctx.closePath()
        ctx.fill()

        // Bottom face
        ctx.beginPath()
        ctx.moveTo(finalCubeSize / 2, finalCubeSize / 2)
        ctx.lineTo(
          finalCubeSize / 2 + depthOffset,
          finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(
          -finalCubeSize / 2 + depthOffset,
          finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(-finalCubeSize / 2, finalCubeSize / 2)
        ctx.closePath()
        ctx.fill()

        // Left face
        ctx.beginPath()
        ctx.moveTo(-finalCubeSize / 2, finalCubeSize / 2)
        ctx.lineTo(
          -finalCubeSize / 2 + depthOffset,
          finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(
          -finalCubeSize / 2 + depthOffset,
          -finalCubeSize / 2 + depthOffset
        )
        ctx.lineTo(-finalCubeSize / 2, -finalCubeSize / 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Restore context state
    ctx.restore()
  }
}

/**
 * Creates a perspective boxes animation
 */
export const createPerspectiveBoxes: AnimationCreator = (
  canvas,
  ctx,
  theme
) => {
  // Create boxes
  const boxes: Box[] = []
  const boxCount = Math.floor((canvas.width * canvas.height) / 30000) // Fewer boxes for better performance

  for (let i = 0; i < boxCount; i++) {
    boxes.push(new Box(canvas.width, canvas.height, theme))
  }

  // Track mouse position and state
  let mouseX = 0
  let mouseY = 0
  let isMouseDown = false
  let draggedBox: Box | null = null

  // Performance monitoring
  let frameCount = 0
  let lastTime = performance.now()
  let fps = 0
  let lowPerformanceMode = false

  // Add mouse event listeners to document instead of canvas
  const handleMouseMove = (e: MouseEvent) => {
    // Always update mouse position for hover effects
    mouseX = e.clientX
    mouseY = e.clientY

    // Check if we're over an interactive element
    const target = e.target as HTMLElement
    const isOverInteractiveElement =
      target &&
      (target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest(
          'a, button, input, select, textarea, [role="button"], [role="link"]'
        ))

    // If over an interactive element, don't process drag events
    if (isOverInteractiveElement && draggedBox) {
      isMouseDown = false
      draggedBox = null
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    // Check if we're over an interactive element
    const target = e.target as HTMLElement
    const isOverInteractiveElement =
      target &&
      (target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest(
          'a, button, input, select, textarea, [role="button"], [role="link"]'
        ))

    // If over an interactive element, don't process drag events
    if (isOverInteractiveElement) {
      return
    }

    isMouseDown = true
    mouseX = e.clientX
    mouseY = e.clientY

    // Try to find a box to drag
    if (!draggedBox) {
      // Sort boxes by depth (front to back) for proper hit detection
      const sortedBoxes = [...boxes].sort((a, b) => a.depth - b.depth)

      for (const box of sortedBoxes) {
        if (box.startDrag(mouseX, mouseY)) {
          draggedBox = box
          break
        }
      }
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    const target = e.target
    const isOverInteractiveElement =
      target instanceof Element &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest(
          'a, button, input, select, textarea, [role="button"], [role="link"]'
        ))

    // If over an interactive element, don't process drag events
    if (isOverInteractiveElement) {
      return
    }

    isMouseDown = false
    draggedBox = null
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mouseleave', handleMouseUp)

  // Sort boxes by depth (draw furthest first)
  const sortBoxesByDepth = () => {
    boxes.sort((a, b) => b.depth - a.depth)
  }

  // Update function
  const update = () => {
    // Check performance
    frameCount++
    const currentTime = performance.now()
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameCount = 0
      lastTime = currentTime

      // If FPS is low, enable low performance mode
      if (fps < 30 && !lowPerformanceMode) {
        lowPerformanceMode = true
        console.log('Enabling low performance mode for animation')
      }
    }

    // Update boxes with performance optimization
    for (const box of boxes) {
      // Skip updates for boxes that are far away or not visible in low performance mode
      if (
        lowPerformanceMode &&
        box.depth > 800 &&
        !box.isHovered &&
        !box.isDragging
      ) {
        continue
      }

      box.update(
        canvas.width,
        canvas.height,
        boxes,
        mouseX,
        mouseY,
        isMouseDown
      )
    }

    sortBoxesByDepth()
  }

  // Draw function
  const draw = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw boxes with performance optimization
    for (const box of boxes) {
      // Skip drawing for boxes that are far away or not visible in low performance mode
      if (
        lowPerformanceMode &&
        box.depth > 800 &&
        !box.isHovered &&
        !box.isDragging
      ) {
        continue
      }

      box.draw(ctx, canvas)
    }
  }

  // Cleanup function
  const cleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseleave', handleMouseUp)
  }

  return { update, draw, cleanup }
}
