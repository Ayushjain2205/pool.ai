"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Flame, DollarSign, Clock } from "lucide-react"

type TaskType = "Text" | "Audio" | "Image" | "Sensor"

interface Task {
  title: string
  type: TaskType
  duration: string
  reward: number
  xp: number
  description: string
  isNew?: boolean
  createdAt?: Date
}

interface TaskFilterProps {
  tasks: Task[]
  onFilterChange?: (filteredTasks: Task[]) => void
}

export function TaskFilter({ tasks, onFilterChange }: TaskFilterProps) {
  // Filter states
  const [typeFilter, setTypeFilter] = useState<TaskType | "All">("All")
  const [showNew, setShowNew] = useState(false)
  const [showHighReward, setShowHighReward] = useState(false)
  const [showShortDuration, setShowShortDuration] = useState(false)

  // Helper function to check if a date is within the last 24 hours
  const isWithin24Hours = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    return diffInHours < 24
  }

  // Handle filter changes
  const handleFilterChange = (
    newTypeFilter?: TaskType | "All",
    newShowNew?: boolean,
    newShowHighReward?: boolean,
    newShowShortDuration?: boolean,
  ) => {
    // Update local state with new values or keep current values
    const updatedTypeFilter = newTypeFilter !== undefined ? newTypeFilter : typeFilter
    const updatedShowNew = newShowNew !== undefined ? newShowNew : showNew
    const updatedShowHighReward = newShowHighReward !== undefined ? newShowHighReward : showHighReward
    const updatedShowShortDuration = newShowShortDuration !== undefined ? newShowShortDuration : showShortDuration

    // Update local state
    if (newTypeFilter !== undefined) setTypeFilter(updatedTypeFilter)
    if (newShowNew !== undefined) setShowNew(updatedShowNew)
    if (newShowHighReward !== undefined) setShowHighReward(updatedShowHighReward)
    if (newShowShortDuration !== undefined) setShowShortDuration(updatedShowShortDuration)

    // Apply filters
    if (onFilterChange) {
      let result = [...tasks]

      // Apply type filter
      if (updatedTypeFilter !== "All") {
        result = result.filter((task) => task.type === updatedTypeFilter)
      }

      // Apply new filter
      if (updatedShowNew) {
        result = result.filter((task) => task.isNew || (task.createdAt && isWithin24Hours(task.createdAt)))
      }

      // Apply high reward filter
      if (updatedShowHighReward) {
        // Get the top 30% of rewards
        const sortedRewards = [...tasks].sort((a, b) => b.reward - a.reward)
        const highRewardThreshold = sortedRewards[Math.floor(sortedRewards.length * 0.3)]?.reward || 0
        result = result.filter((task) => task.reward >= highRewardThreshold)
      }

      // Apply short duration filter
      if (updatedShowShortDuration) {
        // Simple heuristic: tasks with "seconds" in duration
        result = result.filter((task) => task.duration.includes("seconds") || Number.parseInt(task.duration) < 15)
      }

      onFilterChange(result)
    }
  }

  const clearFilters = () => {
    setTypeFilter("All")
    setShowNew(false)
    setShowHighReward(false)
    setShowShortDuration(false)

    if (onFilterChange) {
      onFilterChange(tasks)
    }
  }

  return (
    <div className="space-y-4">
      {/* Type Filters */}
      <div className="flex overflow-x-auto pb-4 gap-2 sticky-filters">
        <Badge
          variant={typeFilter === "All" ? "default" : "text"}
          className={`cursor-pointer ${typeFilter === "All" ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange("All")}
        >
          All Tasks
        </Badge>
        <Badge
          variant={typeFilter === "Audio" ? "default" : "audio"}
          className={`cursor-pointer ${typeFilter === "Audio" ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(typeFilter === "Audio" ? "All" : "Audio")}
        >
          🎧 Audio
        </Badge>
        <Badge
          variant={typeFilter === "Image" ? "default" : "image"}
          className={`cursor-pointer ${typeFilter === "Image" ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(typeFilter === "Image" ? "All" : "Image")}
        >
          🖼️ Image
        </Badge>
        <Badge
          variant={typeFilter === "Text" ? "default" : "text"}
          className={`cursor-pointer ${typeFilter === "Text" ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(typeFilter === "Text" ? "All" : "Text")}
        >
          📝 Text
        </Badge>
        <Badge
          variant={typeFilter === "Sensor" ? "default" : "sensor"}
          className={`cursor-pointer ${typeFilter === "Sensor" ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(typeFilter === "Sensor" ? "All" : "Sensor")}
        >
          📟 Sensor
        </Badge>

        <div className="border-r border-indigo-glow/30 mx-2"></div>

        {/* Additional Filters */}
        <Badge
          variant={showNew ? "default" : "secondary"}
          className={`cursor-pointer ${showNew ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(undefined, !showNew)}
        >
          <Flame className="h-3 w-3 mr-1" /> New
        </Badge>
        <Badge
          variant={showHighReward ? "default" : "secondary"}
          className={`cursor-pointer ${showHighReward ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(undefined, undefined, !showHighReward)}
        >
          <DollarSign className="h-3 w-3 mr-1" /> High Reward
        </Badge>
        <Badge
          variant={showShortDuration ? "default" : "secondary"}
          className={`cursor-pointer ${showShortDuration ? "bg-mint-green text-true-black" : ""}`}
          onClick={() => handleFilterChange(undefined, undefined, undefined, !showShortDuration)}
        >
          <Clock className="h-3 w-3 mr-1" /> Short Duration
        </Badge>
      </div>

      {/* Filter Results Summary */}
      <div className="flex justify-between items-center text-sm text-off-white/70">
        <div>{/* We don't display the exact count here anymore */}</div>
        {(typeFilter !== "All" || showNew || showHighReward || showShortDuration) && (
          <button className="text-mint-green hover:underline" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
