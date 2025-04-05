import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower === "active" || statusLower === "active") {
      return "bg-green-100 text-green-800"
    } else if (statusLower === "inactive" || statusLower === "inactive") {
      return "bg-gray-100 text-gray-800"
    } else if (statusLower === "pending" || statusLower === "chờ xử lý") {
      return "bg-yellow-100 text-yellow-800"
    } else if (statusLower === "suspended" || statusLower === "tạm ngưng") {
      return "bg-red-100 text-red-800"
    }

    return "bg-gray-100 text-gray-800"
  }

  return <span className={cn("px-2 py-1 rounded-full text-xs", getStatusColor(status), className)}>{status}</span>
}

