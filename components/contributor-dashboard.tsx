"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Clock, TrendingUp } from "lucide-react"

export function ContributorDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-mono mb-4">Sign in to view your dashboard</h3>
            <p className="text-off-white/70 mb-6">
              Track your earnings, manage your tasks, and build your contributor profile.
            </p>
            <Button onClick={() => setIsLoggedIn(true)} className="font-mono">
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Wallet */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-5 h-5 mr-2 relative overflow-hidden rounded-full">
              <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
            </div>
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-2 relative overflow-hidden rounded-full">
                <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-mono text-mint-green">12.45 POOL</span>
            </div>
            <Button size="sm">Withdraw</Button>
          </div>
          <p className="text-xs text-off-white/70">Last payout: 2 hours ago</p>
        </CardContent>
      </Card>

      {/* Streak XP */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-glow" />
            Streak XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono
                    ${i < 3 ? "bg-indigo-glow text-off-white" : "bg-deep-violet/50 text-off-white/50"}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <span className="text-lg font-mono text-indigo-glow">+45 XP</span>
          </div>
          <p className="text-xs text-off-white/70">3-day streak! Keep it going!</p>
        </CardContent>
      </Card>

      {/* Ongoing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#FF44A4]" />
            Ongoing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">Label Image – 12% complete</p>
          <Progress value={12} className="h-2 mb-2" />
          <div className="flex justify-between">
            <Button size="sm" variant="outline">
              Resume
            </Button>
            <p className="text-xs text-off-white/70 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> 2:45 left
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next-up CTA */}
      <Card className="bg-gradient-to-br from-deep-violet to-indigo-glow/30 border-indigo-glow/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-mint-green" />
            Level Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">🎯 Do one more task and level up to SILVER</p>
          <Progress value={95} className="h-2 mb-3" />
          <Button className="w-full">Find a Task</Button>
        </CardContent>
      </Card>
    </div>
  )
}
