"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TaskFilter } from "@/components/task-filter"
import { TaskCard } from "@/components/task-card"
import { LiveStatsBar } from "@/components/live-stats-bar"
import { Filter, Timer } from "lucide-react"
import Link from "next/link"

export default function Home() {
  // Sample tasks for the marketplace preview
  const allTasks = [
    {
      id: "image-task-1",
      title: "Label Objects in Street Scene",
      type: "Image" as const,
      duration: "~30 seconds",
      reward: 0.45,
      xp: 8,
      description: "Draw bounding boxes around vehicles, pedestrians, and traffic signs in this street scene.",
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    },
    {
      id: "audio-task-1",
      title: "Record Voice Command",
      type: "Audio" as const,
      duration: "~15 seconds",
      reward: 0.3,
      xp: 6,
      description: "Record yourself saying a specific phrase for voice recognition training.",
      isNew: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "text-task-1",
      title: "Classify Product Review",
      type: "Text" as const,
      duration: "~10 seconds",
      reward: 0.2,
      xp: 4,
      description: "Read a short product review and classify its sentiment.",
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    },
    {
      id: "sensor-task-1",
      title: "Record Hand Gesture",
      type: "Sensor" as const,
      duration: "~20 seconds",
      reward: 0.35,
      xp: 7,
      description: "Record a specific hand gesture using your device's camera.",
      isNew: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: "image-task-2",
      title: "Verify Image Caption",
      type: "Image" as const,
      duration: "~10 seconds",
      reward: 0.15,
      xp: 3,
      description: "Check if the provided caption accurately describes the image.",
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    {
      id: "audio-task-2",
      title: "Record Accent Phrase",
      type: "Audio" as const,
      duration: "~8 seconds",
      reward: 0.18,
      xp: 4,
      description: "Record yourself saying a specific phrase to help AI recognize different accents.",
      isNew: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
  ]

  const [filteredTasks, setFilteredTasks] = useState(allTasks)

  return (
    <main className="flex min-h-screen flex-col items-center bg-true-black">
      {/* Hero Snapshot */}
      <section className="w-full py-12 px-4 relative overflow-hidden bg-deep-violet/30">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -inset-[10%] bg-indigo-glow/5 blur-3xl rounded-full animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute top-[20%] right-[10%] w-64 h-64 bg-mint-green/5 blur-3xl rounded-full animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute bottom-[10%] left-[20%] w-48 h-48 bg-indigo-glow/5 blur-3xl rounded-full animate-pulse"
            style={{ animationDuration: "25s" }}
          ></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Robot Video Avatar */}
            <div className="w-full md:w-2/5 flex justify-center md:justify-start">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-mint-green/30 shadow-[0_0_30px_rgba(68,255,210,0.3)]">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src="/videos/friendly-robot-animation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Hero Text */}
            <div className="w-full md:w-3/5 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-mono mb-4 bg-gradient-to-r from-mint-green to-indigo-glow bg-clip-text text-transparent">
                Train AI. Get Paid. It's That Simple.
              </h1>
              <p className="text-lg md:text-xl text-off-white/80 mb-8">
                Join thousands earning crypto by completing short data tasks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="font-mono text-base">
                  Start Contributing
                </Button>
                <Link href="/post-bounty">
                  <Button size="lg" variant="bounty" className="font-mono text-base">
                    Post a Data Bounty
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <LiveStatsBar />

      {/* Live Task Feed */}
      <section className="w-full py-10 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-mono">Live Task Feed</h2>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="h-4 w-4 mr-2" /> All Filters
            </Button>
          </div>

          {/* Task Filter Component */}
          <TaskFilter tasks={allTasks} onFilterChange={setFilteredTasks} />

          {/* Task Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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
              <Button variant="outline" className="mt-4" onClick={() => setFilteredTasks(allTasks)}>
                Clear all filters
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/tasks">
              <Button variant="outline" className="font-mono">
                View All Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 px-4 bg-deep-violet/20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-mono text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-mint-green/20 flex items-center justify-center mb-6 relative">
                <span className="absolute -top-2 -right-2 bg-mint-green text-true-black w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  1
                </span>
                <Filter className="h-8 w-8 text-mint-green" />
              </div>
              <h3 className="text-xl font-mono mb-3">Choose a Task</h3>
              <p className="text-off-white/70">
                Browse through thousands of micro-tasks that match your skills and interests.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-glow/20 flex items-center justify-center mb-6 relative">
                <span className="absolute -top-2 -right-2 bg-indigo-glow text-off-white w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  2
                </span>
                <Timer className="h-8 w-8 text-indigo-glow" />
              </div>
              <h3 className="text-xl font-mono mb-3">Complete in Seconds</h3>
              <p className="text-off-white/70">
                Most tasks take less than a minute to complete. Do as many as you want.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FF44A4]/20 flex items-center justify-center mb-6 relative">
                <span className="absolute -top-2 -right-2 bg-[#FF44A4] text-off-white w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  3
                </span>
                <div className="w-8 h-8 relative overflow-hidden rounded-full">
                  <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                </div>
              </div>
              <h3 className="text-xl font-mono mb-3">Instant Payout</h3>
              <p className="text-off-white/70">Get paid immediately in POOL tokens after task verification.</p>
            </div>
          </div>

          <p className="text-center mt-12 text-lg font-mono text-indigo-glow">
            We're building the backbone of decentralized AI — task by task.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-indigo-glow/20 mt-auto">
        <div className="container mx-auto">
          <div className="text-center mt-6 text-off-white/50 text-sm">
            © 2025 POOL.AI — Contribute to AI. Earn Crypto.
          </div>
        </div>
      </footer>
    </main>
  )
}
