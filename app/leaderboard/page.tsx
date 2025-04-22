"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Trophy, Calendar, ChevronUp, ChevronDown, Sparkles, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define contributor type
interface Contributor {
  id: number
  rank: number
  name: string
  avatar?: string
  level: number
  xp: number
  tasksCompleted: number
  earnings: number
  streak: number
  taskTypes: {
    text: number
    audio: number
    image: number
    sensor: number
  }
  joinedDate: string
  lastActive: string
}

export default function LeaderboardPage() {
  // Filter states
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month" | "year">("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"rank" | "earnings" | "tasks" | "level">("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Sample leaderboard data
  const contributors: Contributor[] = [
    {
      id: 1,
      rank: 1,
      name: "neural_wizard",
      avatar: "/vibrant-street-market.png",
      level: 42,
      xp: 84250,
      tasksCompleted: 3842,
      earnings: 12450.75,
      streak: 124,
      taskTypes: { text: 1240, audio: 1842, image: 520, sensor: 240 },
      joinedDate: "2024-01-15",
      lastActive: "2025-04-24",
    },
    {
      id: 2,
      rank: 2,
      name: "data_nomad",
      avatar: "/diverse-group-city.png",
      level: 38,
      xp: 76120,
      tasksCompleted: 3215,
      earnings: 10820.5,
      streak: 86,
      taskTypes: { text: 2105, audio: 420, image: 580, sensor: 110 },
      joinedDate: "2024-02-03",
      lastActive: "2025-04-25",
    },
    {
      id: 3,
      rank: 3,
      name: "pixel_master",
      avatar: "/mystical-forest-spirit.png",
      level: 36,
      xp: 72340,
      tasksCompleted: 2950,
      earnings: 9875.25,
      streak: 62,
      taskTypes: { text: 320, audio: 180, image: 2320, sensor: 130 },
      joinedDate: "2024-01-28",
      lastActive: "2025-04-23",
    },
    {
      id: 4,
      rank: 4,
      name: "voice_virtuoso",
      level: 34,
      xp: 68750,
      tasksCompleted: 2780,
      earnings: 9340.8,
      streak: 94,
      taskTypes: { text: 480, audio: 1920, image: 210, sensor: 170 },
      joinedDate: "2024-02-12",
      lastActive: "2025-04-25",
    },
    {
      id: 5,
      rank: 5,
      name: "sensor_sage",
      avatar: "/diverse-professional-profiles.png",
      level: 33,
      xp: 66120,
      tasksCompleted: 2650,
      earnings: 8920.4,
      streak: 78,
      taskTypes: { text: 320, audio: 280, image: 450, sensor: 1600 },
      joinedDate: "2024-01-20",
      lastActive: "2025-04-24",
    },
    {
      id: 6,
      rank: 6,
      name: "ai_artisan",
      level: 31,
      xp: 62480,
      tasksCompleted: 2510,
      earnings: 8420.15,
      streak: 45,
      taskTypes: { text: 680, audio: 620, image: 710, sensor: 500 },
      joinedDate: "2024-02-18",
      lastActive: "2025-04-25",
    },
    {
      id: 7,
      rank: 7,
      name: "data_dynamo",
      avatar: "/vibrant-street-market.png",
      level: 29,
      xp: 58240,
      tasksCompleted: 2340,
      earnings: 7850.6,
      streak: 38,
      taskTypes: { text: 1540, audio: 320, image: 280, sensor: 200 },
      joinedDate: "2024-03-05",
      lastActive: "2025-04-22",
    },
    {
      id: 8,
      rank: 8,
      name: "pooluser",
      level: 28,
      xp: 56120,
      tasksCompleted: 2240,
      earnings: 7520.3,
      streak: 56,
      taskTypes: { text: 620, audio: 580, image: 640, sensor: 400 },
      joinedDate: "2024-02-25",
      lastActive: "2025-04-25",
    },
    {
      id: 9,
      rank: 9,
      name: "ml_maestro",
      avatar: "/diverse-professional-profiles.png",
      level: 27,
      xp: 54380,
      tasksCompleted: 2180,
      earnings: 7320.85,
      streak: 42,
      taskTypes: { text: 380, audio: 240, image: 1320, sensor: 240 },
      joinedDate: "2024-03-12",
      lastActive: "2025-04-23",
    },
    {
      id: 10,
      rank: 10,
      name: "quantum_quester",
      level: 26,
      xp: 52140,
      tasksCompleted: 2080,
      earnings: 6980.45,
      streak: 34,
      taskTypes: { text: 520, audio: 540, image: 580, sensor: 440 },
      joinedDate: "2024-03-08",
      lastActive: "2025-04-24",
    },
  ]

  // Filter and sort contributors
  const filteredContributors = contributors
    .filter((contributor) => {
      if (!searchQuery) return true
      return contributor.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "rank":
          comparison = a.rank - b.rank
          break
        case "earnings":
          comparison = a.earnings - b.earnings
          break
        case "tasks":
          comparison = a.tasksCompleted - b.tasksCompleted
          break
        case "level":
          comparison = a.level - b.level
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  // Handle sort toggle
  const handleSortToggle = (column: "rank" | "earnings" | "tasks" | "level") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("desc") // Default to descending when changing sort column
    }
  }

  return (
    <main className="min-h-screen bg-true-black">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-mono">Leaderboard</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-off-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-deep-violet border border-indigo-glow/30 text-off-white focus:outline-none focus:ring-2 focus:ring-mint-green"
              />
            </div>

            {/* Time filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  {timeFilter === "all" && "All Time"}
                  {timeFilter === "week" && "This Week"}
                  {timeFilter === "month" && "This Month"}
                  {timeFilter === "year" && "This Year"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTimeFilter("all")}>All Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter("week")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter("month")}>This Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter("year")}>This Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
                Top Contributor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4 border-2 border-[#FFD700]">
                  <AvatarImage src={contributors[0].avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-indigo-glow/30">
                    {contributors[0].name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-mono text-lg">{contributors[0].name}</p>
                  <div className="flex items-center text-sm text-off-white/70">
                    <span className="mr-2">Level {contributors[0].level}</span>
                    <span>•</span>
                    <span className="ml-2">{contributors[0].tasksCompleted.toLocaleString()} tasks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2 text-mint-green" />
                Highest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {contributors
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 1)
                  .map((contributor) => (
                    <div key={contributor.id} className="flex items-center w-full">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-mint-green">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-glow/30">
                          {contributor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-mono text-lg">{contributor.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-off-white/70">Current streak</span>
                          <span className="font-mono text-lg text-mint-green">{contributor.streak} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-glow" />
                Most Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {contributors
                  .sort((a, b) => b.earnings - a.earnings)
                  .slice(0, 1)
                  .map((contributor) => (
                    <div key={contributor.id} className="flex items-center w-full">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-indigo-glow">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-glow/30">
                          {contributor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-mono text-lg">{contributor.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-off-white/70">Total earnings</span>
                          <span className="font-mono text-lg text-indigo-glow">
                            {contributor.earnings.toLocaleString()} POOL
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-indigo-glow/20">
                  <th
                    className="px-4 py-3 text-left font-mono text-sm cursor-pointer"
                    onClick={() => handleSortToggle("rank")}
                  >
                    <div className="flex items-center">
                      <span>Rank</span>
                      {sortBy === "rank" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-sm">Contributor</th>
                  <th
                    className="px-4 py-3 text-left font-mono text-sm cursor-pointer"
                    onClick={() => handleSortToggle("level")}
                  >
                    <div className="flex items-center">
                      <span>Level</span>
                      {sortBy === "level" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-mono text-sm cursor-pointer hidden md:table-cell"
                    onClick={() => handleSortToggle("tasks")}
                  >
                    <div className="flex items-center">
                      <span>Tasks</span>
                      {sortBy === "tasks" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-mono text-sm cursor-pointer"
                    onClick={() => handleSortToggle("earnings")}
                  >
                    <div className="flex items-center">
                      <span>Earnings</span>
                      {sortBy === "earnings" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContributors.map((contributor, index) => {
                  // Determine row styling based on rank
                  const rowClass = "border-b border-indigo-glow/10 hover:bg-deep-violet/50"
                  let rankBadgeClass = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"

                  if (contributor.rank === 1) {
                    rankBadgeClass += " bg-[#FFD700] text-true-black"
                  } else if (contributor.rank === 2) {
                    rankBadgeClass += " bg-[#C0C0C0] text-true-black"
                  } else if (contributor.rank === 3) {
                    rankBadgeClass += " bg-[#CD7F32] text-true-black"
                  } else {
                    rankBadgeClass += " bg-deep-violet text-off-white"
                  }

                  return (
                    <tr key={contributor.id} className={rowClass}>
                      <td className="px-4 py-4">
                        <div className={rankBadgeClass}>{contributor.rank}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-indigo-glow/30">
                              {contributor.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-mono">{contributor.name}</p>
                            <p className="text-xs text-off-white/60">{contributor.streak} day streak</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="flex items-center">
                            <span className="font-mono mr-2">{contributor.level}</span>
                            <div className="text-xs text-off-white/60">{contributor.xp.toLocaleString()} XP</div>
                          </div>
                          <Progress value={75} className="h-1 w-16 mt-1" />
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="font-mono">{contributor.tasksCompleted.toLocaleString()}</div>
                        <div className="flex gap-1 mt-1">
                          {contributor.taskTypes.text > 0 && (
                            <Badge variant="text" className="text-xs py-0 h-5">
                              📝 {contributor.taskTypes.text}
                            </Badge>
                          )}
                          {contributor.taskTypes.audio > 0 && (
                            <Badge variant="audio" className="text-xs py-0 h-5">
                              🎧 {contributor.taskTypes.audio}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-mint-green">{contributor.earnings.toLocaleString()} POOL</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Your Position */}
        <Card className="border-mint-green/30 bg-gradient-to-r from-deep-violet to-deep-violet/80">
          <div className="p-4">
            <h3 className="text-lg font-mono mb-4">Your Position</h3>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-deep-violet flex items-center justify-center text-xs font-mono mr-4">
                128
              </div>
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src="/abstract-user.png" />
                <AvatarFallback className="bg-indigo-glow/30">P</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-mono">pooluser</p>
                  <p className="font-mono text-mint-green">120.50 POOL</p>
                </div>
                <div className="flex justify-between items-center text-xs text-off-white/60 mt-1">
                  <div>Level 8 • 42 tasks this month</div>
                  <div>Top 5%</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress to next rank</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-off-white/60 mt-2">Complete 8 more tasks to reach rank 127</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
