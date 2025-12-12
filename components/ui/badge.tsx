import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "active" | "expired" | "pending" | "paid" | "default" | "secondary" | "outline"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    active: "status-active",
    expired: "status-expired",
    pending: "status-pending",
    paid: "status-paid",
    default: "bg-gray-100 text-gray-700 border-gray-200",
    secondary: "bg-blue-50 text-blue-700 border-blue-100",
    outline: "bg-transparent border-gray-200 text-gray-700",
  }

  return (
    <span className={cn(
      `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`,
      className
    )}>
      {children}
    </span>
  )
}
