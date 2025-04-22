"use client"

import { useEffect, useRef } from "react"

export function GlobalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 220 // Fixed height for the map
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw world map outline (simplified)
    const drawMap = () => {
      ctx.fillStyle = "#1B0F29" // Deep violet background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(127, 90, 240, 0.3)" // Indigo glow for map outlines
      ctx.lineWidth = 1

      // Simplified world map - just some continent-like shapes
      ctx.beginPath()
      // North America
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3)
      ctx.bezierCurveTo(
        canvas.width * 0.15,
        canvas.height * 0.2,
        canvas.width * 0.2,
        canvas.height * 0.25,
        canvas.width * 0.25,
        canvas.height * 0.4,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.22,
        canvas.height * 0.5,
        canvas.width * 0.15,
        canvas.height * 0.45,
        canvas.width * 0.1,
        canvas.height * 0.3,
      )

      // South America
      ctx.moveTo(canvas.width * 0.25, canvas.height * 0.5)
      ctx.bezierCurveTo(
        canvas.width * 0.28,
        canvas.height * 0.6,
        canvas.width * 0.25,
        canvas.height * 0.7,
        canvas.width * 0.2,
        canvas.height * 0.8,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.18,
        canvas.height * 0.7,
        canvas.width * 0.2,
        canvas.height * 0.6,
        canvas.width * 0.25,
        canvas.height * 0.5,
      )

      // Europe
      ctx.moveTo(canvas.width * 0.45, canvas.height * 0.25)
      ctx.bezierCurveTo(
        canvas.width * 0.5,
        canvas.height * 0.2,
        canvas.width * 0.55,
        canvas.height * 0.25,
        canvas.width * 0.5,
        canvas.height * 0.35,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.48,
        canvas.height * 0.3,
        canvas.width * 0.47,
        canvas.height * 0.28,
        canvas.width * 0.45,
        canvas.height * 0.25,
      )

      // Africa
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.35)
      ctx.bezierCurveTo(
        canvas.width * 0.55,
        canvas.height * 0.45,
        canvas.width * 0.55,
        canvas.height * 0.6,
        canvas.width * 0.5,
        canvas.height * 0.7,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.45,
        canvas.height * 0.65,
        canvas.width * 0.45,
        canvas.height * 0.45,
        canvas.width * 0.5,
        canvas.height * 0.35,
      )

      // Asia
      ctx.moveTo(canvas.width * 0.55, canvas.height * 0.25)
      ctx.bezierCurveTo(
        canvas.width * 0.65,
        canvas.height * 0.2,
        canvas.width * 0.75,
        canvas.height * 0.25,
        canvas.width * 0.8,
        canvas.height * 0.4,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.75,
        canvas.height * 0.5,
        canvas.width * 0.65,
        canvas.height * 0.45,
        canvas.width * 0.55,
        canvas.height * 0.35,
      )

      // Australia
      ctx.moveTo(canvas.width * 0.8, canvas.height * 0.6)
      ctx.bezierCurveTo(
        canvas.width * 0.85,
        canvas.height * 0.55,
        canvas.width * 0.9,
        canvas.height * 0.6,
        canvas.width * 0.85,
        canvas.height * 0.7,
      )
      ctx.bezierCurveTo(
        canvas.width * 0.8,
        canvas.height * 0.75,
        canvas.width * 0.75,
        canvas.height * 0.65,
        canvas.width * 0.8,
        canvas.height * 0.6,
      )

      ctx.stroke()
    }

    // Activity point class
    class ActivityPoint {
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
        this.maxRadius = Math.random() * 10 + 5
        this.speed = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? "#44FFD2" : "#7F5AF0" // Mint green or indigo
        this.opacity = 1
      }

      update() {
        this.radius += this.speed
        this.opacity = 1 - this.radius / this.maxRadius
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()
      }

      isFinished() {
        return this.radius >= this.maxRadius
      }
    }

    // Array to store activity points
    const activityPoints: ActivityPoint[] = []

    // Create new activity points at random locations
    const createActivityPoint = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      activityPoints.push(new ActivityPoint(x, y))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the map
      drawMap()

      // Update and draw activity points
      for (let i = 0; i < activityPoints.length; i++) {
        activityPoints[i].update()
        activityPoints[i].draw(ctx)

        // Remove finished points
        if (activityPoints[i].isFinished()) {
          activityPoints.splice(i, 1)
          i--
        }
      }

      // Request next frame
      requestAnimationFrame(animate)
    }

    // Start animation
    drawMap()
    animate()

    // Create activity points at random intervals
    const pointInterval = setInterval(() => {
      if (activityPoints.length < 30) {
        // Limit the number of points
        createActivityPoint()
      }
    }, 300)

    // Initial points
    for (let i = 0; i < 10; i++) {
      createActivityPoint()
    }

    // Cleanup
    return () => {
      clearInterval(pointInterval)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="w-full h-[220px] relative overflow-hidden rounded-lg">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
