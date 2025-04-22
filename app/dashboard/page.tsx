import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, CheckCircle, TrendingUp, Calendar } from "lucide-react"

export default function DashboardPage() {
  // Sample completed tasks
  const completedTasks = [
    {
      title: "Sentiment Analysis",
      type: "Text" as const,
      date: "Apr 22, 2025",
      reward: 25,
      status: "Completed",
    },
    {
      title: "Voice Commands",
      type: "Audio" as const,
      date: "Apr 20, 2025",
      reward: 30,
      status: "Completed",
    },
    {
      title: "Object Labeling",
      type: "Image" as const,
      date: "Apr 18, 2025",
      reward: 45,
      status: "Completed",
    },
  ]

  return (
    <main className="min-h-screen bg-true-black">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-mono mb-8">Contributor Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="w-5 h-5 mr-2 relative overflow-hidden rounded-full">
                  <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                </div>
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 relative overflow-hidden rounded-full">
                  <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                </div>
                <p className="text-3xl font-mono text-mint-green">120.50 POOL</p>
              </div>
              <p className="text-sm text-off-white/70">Last withdrawal: 3 days ago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-indigo-glow" />
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono">42</p>
              <p className="text-sm text-off-white/70">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono">#128</p>
              <p className="text-sm text-off-white/70">Top 5%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#FF44A4]" />
                Time Contributed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono">18h 24m</p>
              <p className="text-sm text-off-white/70">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-glow" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-deep-violet/50 border border-indigo-glow/20"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Badge variant={task.type.toLowerCase() as any}>{task.type}</Badge>
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-off-white/70">{task.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="flex items-center justify-end">
                        <div className="w-4 h-4 mr-1 relative overflow-hidden rounded-full">
                          <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                        </div>
                        <p className="font-mono text-mint-green">{task.reward} POOL</p>
                      </div>
                      <p className="text-xs text-off-white/70">{task.status}</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-mint-green" />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
