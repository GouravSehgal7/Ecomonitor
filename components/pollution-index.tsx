import { cn } from "@/lib/utils"

interface PollutionIndexProps {
  value: number
  size?: "sm" | "md" | "lg"
}

export function PollutionIndex({ value, size = "lg" }: PollutionIndexProps) {
  // Determine AQI category and color
  const getCategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "bg-green-500", textColor: "text-green-700" }
    if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-400", textColor: "text-yellow-700" }
    if (aqi <= 200) return { label: "Poor", color: "bg-orange-500", textColor: "text-orange-700" }
    if (aqi <= 300) return { label: "Very Poor", color: "bg-red-500", textColor: "text-red-700" }
    return { label: "Severe", color: "bg-purple-600", textColor: "text-purple-700" }
  }

  const { label, color, textColor } = getCategory(value)

  // Size classes
  const sizeClasses = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  }

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex flex-col items-center">
      <div className={cn("font-bold", sizeClasses[size])}>{value}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className={cn("h-3 w-3 rounded-full", color)} />
        <span className={cn("font-medium", textColor, labelSizeClasses[size])}>{label}</span>
      </div>
    </div>
  )
}

