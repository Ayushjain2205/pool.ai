"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, Undo, ImageIcon } from "lucide-react";

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

interface ImageAnnotationTaskProps {
  imageUrls: string[];
  objectsToLabel: string[];
  onProgress: (progress: number) => void;
  onComplete: (result: { boxesPerImage: Box[][] }) => void;
}

export function ImageAnnotationTask({
  imageUrls,
  objectsToLabel,
  onProgress,
  onComplete,
}: ImageAnnotationTaskProps) {
  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxesPerImage, setBoxesPerImage] = useState<Box[][]>(
    imageUrls.map(() => [])
  );
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    objectsToLabel[0] || "Object"
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [draggedBoxId, setDraggedBoxId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  // Color mapping for different labels
  const colorMap: Record<string, string> = {
    Car: "#FF44A4",
    Pedestrian: "#44FFD2",
    "Traffic Sign": "#7F5AF0",
    Bicycle: "#FFD700",
    default: "#FF6B6B",
  };

  // Get color for a label
  const getColorForLabel = (label: string) => {
    return colorMap[label] || colorMap.default;
  };

  // Initialize canvas
  useEffect(() => {
    if (!containerRef.current) return;

    // Responsive: max height 60vh, keep 5:3 aspect ratio, don't exceed container width
    const maxHeight = Math.floor(window.innerHeight * 0.6);
    const aspectRatio = 5 / 3;
    let height = Math.min(containerRef.current.clientHeight, maxHeight);
    let width = Math.floor(height * aspectRatio);
    // Don't exceed container width
    if (containerRef.current.clientWidth < width) {
      width = containerRef.current.clientWidth;
      height = Math.floor(width / aspectRatio);
    }
    setCanvasSize({ width, height });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const maxHeight = Math.floor(window.innerHeight * 0.6);
      let height = Math.min(containerRef.current.clientHeight, maxHeight);
      let width = Math.floor(height * aspectRatio);
      if (containerRef.current.clientWidth < width) {
        width = containerRef.current.clientWidth;
        height = Math.floor(width / aspectRatio);
      }
      setCanvasSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update boxes when currentIndex changes
  useEffect(() => {
    setBoxes(boxesPerImage[currentIndex]);
  }, [currentIndex]);

  // Save boxes to boxesPerImage when boxes change
  useEffect(() => {
    setBoxesPerImage((prev) =>
      prev.map((b, i) => (i === currentIndex ? boxes : b))
    );
  }, [boxes, currentIndex]);

  // Hide instructions after 3 seconds
  useEffect(() => {
    if (boxes.length === 0 && showInstructions) {
      const timer = setTimeout(() => setShowInstructions(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [boxes.length, showInstructions]);

  // Image loading
  useEffect(() => {
    setImageLoaded(false);
    if (!imageUrls[currentIndex]) return;
    const img = new window.Image();
    img.src = imageUrls[currentIndex];
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
  }, [imageUrls, currentIndex, canvasSize]);

  // Draw everything on canvas when needed (no grid)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw image if loaded
    if (imageLoaded && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#1B0F29";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Draw placeholder text if image not loaded
    if (!imageLoaded) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Annotation Canvas",
        canvas.width / 2,
        canvas.height / 2 - 20
      );
      ctx.fillText(
        "Click and drag to draw boxes",
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    }
    // Draw all existing boxes
    boxes.forEach((box) => {
      ctx.strokeStyle = box.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = `${box.color}CC`;
      const padding = 4;
      const textWidth = ctx.measureText(box.label).width;
      ctx.fillRect(box.x, box.y - 24, textWidth + padding * 2, 20);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(box.label, box.x + padding, box.y - 14);
    });
    // Draw current box if drawing
    if (isDrawing && startPoint && endPoint) {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      ctx.strokeStyle = getColorForLabel(selectedLabel);
      ctx.lineWidth = 2;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    }
  }, [
    boxes,
    isDrawing,
    startPoint,
    endPoint,
    canvasSize,
    selectedLabel,
    imageLoaded,
  ]);

  // Progress: percent of images with at least one box
  useEffect(() => {
    const completed = boxesPerImage.filter((b) => b.length > 0).length;
    onProgress(Math.round((completed / imageUrls.length) * 100));
  }, [boxesPerImage, imageUrls.length, onProgress]);

  // Navigation
  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(imageUrls.length - 1, i + 1));

  // Submit only if all images have at least one box
  const canSubmit = boxesPerImage.every((b) => b.length > 0);
  const handleSubmit = () => {
    if (canSubmit) onComplete({ boxesPerImage });
  };

  // Mouse event handlers (updated for box moving)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is inside any box (from topmost to bottom)
    for (let i = boxes.length - 1; i >= 0; i--) {
      const box = boxes[i];
      if (
        x >= box.x &&
        x <= box.x + box.width &&
        y >= box.y &&
        y <= box.y + box.height
      ) {
        setDraggedBoxId(box.id);
        setDragOffset({ x: x - box.x, y: y - box.y });
        return;
      }
    }
    // Otherwise, start drawing a new box
    setStartPoint({ x, y });
    setEndPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && startPoint) {
      setEndPoint({ x, y });
    } else if (draggedBoxId && dragOffset) {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === draggedBoxId
            ? { ...box, x: x - dragOffset.x, y: y - dragOffset.y }
            : box
        )
      );
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && startPoint && endPoint) {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      if (Math.abs(width) > 5 && Math.abs(height) > 5) {
        const x = width > 0 ? startPoint.x : endPoint.x;
        const y = height > 0 ? startPoint.y : endPoint.y;
        const newBox: Box = {
          id: Date.now().toString(),
          x,
          y,
          width: Math.abs(width),
          height: Math.abs(height),
          label: selectedLabel,
          color: getColorForLabel(selectedLabel),
        };
        setBoxes([...boxes, newBox]);
      }
      setIsDrawing(false);
      setStartPoint(null);
      setEndPoint(null);
    }
    setDraggedBoxId(null);
    setDragOffset(null);
  };

  const handleMouseLeave = handleMouseUp;

  // Remove the last box
  const handleUndo = () => {
    if (boxes.length > 0) {
      setBoxes(boxes.slice(0, -1));
    }
  };

  // Clear all boxes
  const handleClear = () => {
    setBoxes([]);
    onProgress(0);
  };

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
                selectedLabel === label
                  ? "bg-mint-green text-true-black"
                  : "bg-deep-violet"
              }`}
              onClick={() => setSelectedLabel(label)}
              style={{
                borderColor:
                  selectedLabel === label ? undefined : getColorForLabel(label),
              }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Canvas container */}
      <div
        className="flex-1 mb-6 flex flex-col items-center"
        ref={containerRef}
      >
        <div
          className="relative border border-indigo-glow/30 rounded-lg overflow-hidden flex justify-center bg-deep-violet/30 w-full max-w-[900px] mx-auto"
          style={{ height: "60vh" }}
        >
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
          {boxes.length === 0 && showInstructions && (
            <div className="absolute inset-0 flex items-center justify-center bg-true-black/70 pointer-events-none">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-mint-green/50 mx-auto mb-2" />
                <p className="text-mint-green font-mono mb-2">
                  CLICK AND DRAG TO DRAW BOXES
                </p>
                <p className="text-off-white/70">
                  Label all objects in the scene
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Navigation and progress */}
        <div className="flex justify-between items-center mt-2 gap-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <span className="text-off-white/70 font-mono">
            Image {currentIndex + 1} of {imageUrls.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === imageUrls.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Box count indicator */}
      <div className="mb-4 text-center">
        <p className="text-off-white/70">
          {boxes.length > 0 ? (
            <>
              <span className="text-mint-green font-mono">{boxes.length}</span>{" "}
              object{boxes.length !== 1 ? "s" : ""} labeled
            </>
          ) : (
            "No objects labeled yet"
          )}
        </p>
      </div>
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={boxes.length === 0}
          >
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={boxes.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          <Check className="h-4 w-4 mr-1" /> Submit
        </Button>
      </div>
    </div>
  );
}
