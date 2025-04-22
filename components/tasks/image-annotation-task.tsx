"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Check, Undo, ImageIcon } from "lucide-react"

interface Box {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  color: string
}

interface ImageAnnotationTaskProps {
  imageUrl: string
  objectsToLabel: string[]
  onProgress: (progress: number) => void
  onComplete: (result: { boxes: Box[] }) => void
}

export function ImageAnnotationTask({ imageUrl, objectsToLabel, onProgress, onComplete }: ImageAnnotationTaskProps) {
  // References
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // State
  const [boxes, setBoxes] = useState<Box[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string>(objectsToLabel[0] || "Object")
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })
  const [imageLoaded, setImageLoaded] = useState(false)

  // Color mapping for different labels
  const colorMap: Record<string, string> = {
    Car: "#FF44A4",
    Pedestrian: "#44FFD2",
    "Traffic Sign": "#7F5AF0",
    Bicycle: "#FFD700",
    default: "#FF6B6B",
  }

  // Get color for a label
  const getColorForLabel = (label: string) => {
    return colorMap[label] || colorMap.default
  }

  // Initialize canvas
  useEffect(() => {
    if (!containerRef.current) return

    // Set canvas size based on container
    const containerWidth = containerRef.current.clientWidth
    setCanvasSize({
      width: containerWidth,
      height: Math.floor(containerWidth * 0.6), // 5:3 aspect ratio
    })

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      setCanvasSize({
        width: newWidth,
        height: Math.floor(newWidth * 0.6),
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw everything on canvas when needed
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#1B0F29" // deep violet
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid pattern
    ctx.strokeStyle = "rgba(127, 90, 240, 0.2)" // indigo glow with low opacity
    ctx.lineWidth = 1

    // Draw grid lines
    const gridSize = 20
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw placeholder text
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "16px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Show different message based on image load status
    if (!imageLoaded) {
      ctx.fillText("Annotation Canvas", canvas.width / 2, canvas.height / 2 - 20)
      ctx.fillText("Click and drag to draw boxes", canvas.width / 2, canvas.height / 2 + 20)
    }

    // Draw all existing boxes
    boxes.forEach((box) => {
      // Draw box
      ctx.strokeStyle = box.color
      ctx.lineWidth = 2
      ctx.strokeRect(box.x, box.y, box.width, box.height)

      // Draw label background
      ctx.fillStyle = `${box.color}CC` // semi-transparent
      const padding = 4
      const textWidth = ctx.measureText(box.label).width
      ctx.fillRect(box.x, box.y - 24, textWidth + padding * 2, 20)

      // Draw label text
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "12px monospace"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(box.label, box.x + padding, box.y - 14)
    })

    // Draw current box if drawing
    if (isDrawing && startPoint && endPoint) {
      const width = endPoint.x - startPoint.x
      const height = endPoint.y - startPoint.y

      ctx.strokeStyle = getColorForLabel(selectedLabel)
      ctx.lineWidth = 2
      ctx.strokeRect(startPoint.x, startPoint.y, width, height)
    }
  }, [boxes, isDrawing, startPoint, endPoint, canvasSize, selectedLabel, imageLoaded])

  // Update progress based on number of boxes
  useEffect(() => {
    const progressPerBox = 20
    const progress = Math.min(boxes.length * progressPerBox, 100)
    onProgress(progress)
  }, [boxes, onProgress])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStartPoint({ x, y })
    setEndPoint({ x, y })
    setIsDrawing(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPoint) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setEndPoint({ x, y })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !endPoint) return

    // Only add box if it has some size
    const width = endPoint.x - startPoint.x
    const height = endPoint.y - startPoint.y

    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      // Normalize coordinates (handle negative width/height)
      const x = width > 0 ? startPoint.x : endPoint.x
      const y = height > 0 ? startPoint.y : endPoint.y

      const newBox: Box = {
        id: Date.now().toString(),
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        label: selectedLabel,
        color: getColorForLabel(selectedLabel),
      }

      setBoxes([...boxes, newBox])
    }

    setIsDrawing(false)
    setStartPoint(null)
    setEndPoint(null)
  }

  // Handle mouse leave - same as mouse up
  const handleMouseLeave = handleMouseUp

  // Remove the last box
  const handleUndo = () => {
    if (boxes.length > 0) {
      setBoxes(boxes.slice(0, -1))
    }
  }

  // Clear all boxes
  const handleClear = () => {
    setBoxes([])
    onProgress(0)
  }

  // Submit annotations
  const handleSubmit = () => {
    onComplete({ boxes })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Label selection */}
      <div className="mb-4">
        <h3 className="font-mono mb-2">SELECT OBJECT TYPE:</h3>
        <div className="flex flex-wrap gap-2">
          {objectsToLabel.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className={`cursor-pointer ${
                selectedLabel === label ? "bg-mint-green text-true-black" : "bg-deep-violet"
              }`}
              onClick={() => setSelectedLabel(label)}
              style={{
                borderColor: selectedLabel === label ? undefined : getColorForLabel(label),
              }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Canvas container */}
      <div className="flex-1 mb-6" ref={containerRef}>
        <div className="relative border border-indigo-glow/30 rounded-lg overflow-hidden flex justify-center bg-deep-violet/30">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="cursor-crosshair"
          />

          {/* Instructions overlay - only show when no boxes drawn */}
          {boxes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-true-black/70 pointer-events-none">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-mint-green/50 mx-auto mb-2" />
                <p className="text-mint-green font-mono mb-2">CLICK AND DRAG TO DRAW BOXES</p>
                <p className="text-off-white/70">Label all objects in the scene</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Box count indicator */}
      <div className="mb-4 text-center">
        <p className="text-off-white/70">
          {boxes.length > 0 ? (
            <>
              <span className="text-mint-green font-mono">{boxes.length}</span> object{boxes.length !== 1 ? "s" : ""}{" "}
              labeled
            </>
          ) : (
            "No objects labeled yet"
          )}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={boxes.length === 0}>
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={boxes.length === 0}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>

        <Button onClick={handleSubmit} disabled={boxes.length === 0}>
          <Check className="h-4 w-4 mr-1" /> Submit
        </Button>
      </div>
    </div>
  )
}
