import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-indigo-glow text-off-white",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        text: "border-transparent bg-[#FF44A4] text-off-white", // Changed from bg-deep-violet to use the same color as the text task type
        audio: "border-transparent bg-mint-green/20 text-mint-green",
        image: "border-transparent bg-indigo-glow/20 text-indigo-glow",
        sensor: "border-transparent bg-[#FF44A4]/20 text-[#FF44A4]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
