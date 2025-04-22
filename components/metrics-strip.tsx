import type React from "react"
import { Users, Database, Clock } from "lucide-react"

interface Metric {
  value: string
  label: string
  icon: React.ElementType
}

export function MetricsStrip() {
  const metrics: Metric[] = [
    {
      value: "$23M",
      label: "Paid to Contributors",
      icon: Database,
    },
    {
      value: "1.2K",
      label: "Active Tasks",
      icon: Clock,
    },
    {
      value: "7.8K",
      label: "Contributors",
      icon: Users,
    },
  ]

  return (
    <div className="w-full bg-deep-violet/50 backdrop-blur-md py-6 border-y border-indigo-glow/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-center">
              <metric.icon className="w-6 h-6 text-mint-green mr-3" />
              <div className="flex flex-col">
                <span className="text-2xl font-mono text-off-white">{metric.value}</span>
                <span className="text-sm text-off-white/70">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
