"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TaskCardProps {
  id?: string
  title: string
  type: "Text" | "Audio" | "Image" | "Sensor"
  duration: string
  reward: number
  xp: number
  description: string
  isNew?: boolean
  createdAt?: Date
}

export function TaskCard({ title, type, duration, reward, xp, description, isNew, createdAt }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [progress, setProgress] = useState(0)

  // Map task type to variant
  const getVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "text":
        return "text"
      case "audio":
        return "audio"
      case "image":
        return "image"
      case "sensor":
        return "sensor"
      default:
        return "default"
    }
  }

  // Map task type to emoji and color
  const getTaskTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "text":
        return { emoji: "📝", color: "#FF44A4", bgColor: "rgba(255, 68, 164, 0.1)" }
      case "audio":
        return { emoji: "🎧", color: "#44FFD2", bgColor: "rgba(68, 255, 210, 0.1)" }
      case "image":
        return { emoji: "🖼️", color: "#7F5AF0", bgColor: "rgba(127, 90, 240, 0.1)" }
      case "sensor":
        return { emoji: "📟", color: "#FFD700", bgColor: "rgba(255, 215, 0, 0.1)" }
      default:
        return { emoji: "", color: "#FFFFFF", bgColor: "rgba(255, 255, 255, 0.1)" }
    }
  }

  const typeInfo = getTaskTypeInfo(type)

  // Simulate task completion
  const handleDoTask = (e: React.MouseEvent) => {
    // Don't prevent default - allow navigation to the task page
    // The Link wrapper will handle the navigation
  }

  // Format time ago for new tasks
  const getTimeAgo = () => {
    if (!createdAt) return null

    const now = new Date()
    const diffMs = now.getTime() - createdAt.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`transition-all duration-300 h-[280px] ${isHovered ? "shadow-[0_0_20px_rgba(127,90,240,0.4)]" : ""}`}
        style={{
          borderColor: isHovered ? typeInfo.color : "",
        }}
      >
        <CardHeader className="pb-2 relative">
          {/* Type indicator line */}
          <div
            className="absolute top-0 left-0 h-1 transition-all duration-300"
            style={{
              width: isHovered ? "100%" : "30%",
              background: `linear-gradient(to right, ${typeInfo.color}, transparent)`,
            }}
          ></div>

          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {/* Emoji circle */}
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full mr-2 text-sm flex-shrink-0"
                style={{ backgroundColor: typeInfo.bgColor, color: typeInfo.color }}
              >
                {typeInfo.emoji}
              </div>

              {/* Title */}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>

            {/* Type badge - only visible on hover */}
            <div className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
              <Badge variant={getVariant(type)} className="ml-2 flex-shrink-0">
                {type}
              </Badge>
            </div>
          </div>

          {createdAt && isNew && <div className="text-xs text-mint-green mt-1 ml-10">{getTimeAgo()}</div>}
        </CardHeader>

        <CardContent className="py-2 flex-1 overflow-hidden">
          <p className="text-sm text-off-white/80 line-clamp-3">{description}</p>
          <div className="flex justify-between items-center text-sm mt-4">
            <div className="flex items-center text-off-white/70">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center text-mint-green font-mono">
              <div className="w-4 h-4 mr-1 relative overflow-hidden rounded-full">
                <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
              </div>
              <span>{reward.toFixed(2)} POOL</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          {isCompleting ? (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Completing task...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center w-full py-2 text-mint-green"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Task completed!
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center text-indigo-glow">
                <div className="w-4 h-4 mr-1 relative overflow-hidden rounded-full">
                  <img src="/pool-logo.png" alt="XP" className="w-full h-full object-contain opacity-70" />
                </div>
                <span className="text-sm">+{xp} XP</span>
              </div>

              {/* Do Task button - only visible on hover */}
              <div className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                <Button
                  size="sm"
                  className="rounded-full bg-mint-green text-true-black hover:bg-mint-green/90 font-medium"
                  onClick={handleDoTask}
                >
                  Do Task
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
