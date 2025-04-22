"use client"

import { useEffect, useRef } from "react"

export function RippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Ripple class
    class Ripple {
      x: number
      y: number
      radius: number
      maxRadius: number
      speed: number
      color: string
      opacity: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = 1
        this.maxRadius = Math.random() * 100 + 50
        this.speed = Math.random() * 2 + 1
        this.color = "#7F5AF0"
        this.opacity = 0.5
      }

      update() {
        this.radius += this.speed
        this.opacity = 0.5 * (1 - this.radius / this.maxRadius)
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(127, 90, 240, ${this.opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      isFinished() {
        return this.radius >= this.maxRadius
      }
    }

    // Array to store ripples
    const ripples: Ripple[] = []

    // Create new ripples at random intervals
    const createRipple = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ripples.push(new Ripple(x, y))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw ripples
      for (let i = 0; i < ripples.length; i++) {
        ripples[i].update()
        ripples[i].draw(ctx)

        // Remove finished ripples
        if (ripples[i].isFinished()) {
          ripples.splice(i, 1)
          i--
        }
      }

      // Request next frame
      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Create ripples at random intervals
    const rippleInterval = setInterval(createRipple, 1000)

    // Initial ripples
    for (let i = 0; i < 5; i++) {
      createRipple()
    }

    // Cleanup
    return () => {
      clearInterval(rippleInterval)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 opacity-30" />
}
