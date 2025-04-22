"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { TaskFilter } from "@/components/task-filter"
import { Search, Filter, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  // Sample tasks for the marketplace
  const allTasks = [
    {
      id: "image-task-1",
      title: "Label Objects in Street Scene",
      type: "Image" as const,
      duration: "5-10 min",
      reward: 25,
      description: "Draw bounding boxes around vehicles, pedestrians, and traffic signs in this street scene.",
      xp: 15,
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    },
    {
      id: "audio-task-1",
      title: "Record Voice Command",
      type: "Audio" as const,
      duration: "3-5 min",
      reward: 30,
      description: "Record voice commands for smart home devices in various environments.",
      xp: 20,
      isNew: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "text-task-1",
      title: "Classify Product Review Sentiment",
      type: "Text" as const,
      duration: "8-12 min",
      reward: 45,
      description: "Classify the sentiment of product reviews as positive, negative, or neutral.",
      xp: 25,
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    },
    {
      id: "sensor-task-1",
      title: "Motion Data",
      type: "Sensor" as const,
      duration: "15-20 min",
      reward: 60,
      description: "Collect smartphone motion data while performing specific physical activities.",
      xp: 35,
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 72 hours ago
    },
    {
      id: "text-task-2",
      title: "Text Classification",
      type: "Text" as const,
      duration: "4-8 min",
      reward: 20,
      description: "Categorize news articles into different topics like politics, sports, technology, etc.",
      xp: 12,
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    },
    {
      id: "audio-task-2",
      title: "Accent Recognition",
      type: "Audio" as const,
      duration: "2-4 min",
      reward: 35,
      description: "Record specific phrases to help AI recognize different accents and dialects.",
      xp: 18,
      isNew: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "image-task-2",
      title: "Facial Expressions",
      type: "Image" as const,
      duration: "5-7 min",
      reward: 40,
      description: "Capture facial expressions representing different emotions for AI training.",
      xp: 22,
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    {
      id: "sensor-task-2",
      title: "Gesture Recognition",
      type: "Sensor" as const,
      duration: "10-15 min",
      reward: 55,
      description: "Perform specific hand gestures while wearing a smartwatch to collect motion data.",
      xp: 30,
      isNew: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes ago
    },
  ]

  const [filteredTasks, setFilteredTasks] = useState(allTasks)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query) {
      setFilteredTasks(allTasks)
      return
    }

    const results = allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query),
    )

    setFilteredTasks(results)
  }

  // Handle filter changes from TaskFilter component
  const handleFilterChange = (filtered: any[]) => {
    // If there's a search query, apply it to the filtered tasks
    if (searchQuery) {
      const results = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTasks(results)
    } else {
      setFilteredTasks(filtered)
    }
  }

  return (
    <main className="min-h-screen bg-true-black">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-mono mb-8">Task Marketplace</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-off-white/50 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-deep-violet border border-indigo-glow/30 text-off-white focus:outline-none focus:ring-2 focus:ring-mint-green"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Clock className="h-4 w-4 mr-2" /> Duration
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <TrendingUp className="h-4 w-4 mr-2" /> Reward
            </Button>
          </div>
        </div>

        {/* Task Filters */}
        <TaskFilter tasks={allTasks} onFilterChange={handleFilterChange} />

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredTasks.map((task) => (
            <Link href={`/tasks/${task.id}`} key={task.id} className="block h-full">
              <TaskCard {...task} />
            </Link>
          ))}
        </div>

        {/* No results message */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 mt-8">
            <p className="text-off-white/70 text-lg">No tasks match your current filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setFilteredTasks(allTasks)
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
