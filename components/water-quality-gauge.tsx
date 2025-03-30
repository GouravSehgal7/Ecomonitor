"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface WaterQualityGaugeProps {
  name: string
  value: number
  unit: string
  min: number
  max: number
  safeLimit: number
}

export function WaterQualityGauge({ name, value, unit, min, max, safeLimit }: WaterQualityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Determine if the value exceeds safe limit
  const isSafe = value <= safeLimit

  // Calculate percentage for gauge
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  // Determine color based on safety
  const getColor = () => {
    if (value <= safeLimit * 0.7) return "#10b981" // green-500
    if (value <= safeLimit) return "#facc15" // yellow-400
    if (value <= safeLimit * 1.2) return "#f97316" // orange-500
    return "#ef4444" // red-500
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height - 10
    const radius = Math.min(canvas.width, canvas.height) * 0.8

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius / 2, Math.PI, 0, false)
    ctx.lineWidth = 10
    ctx.strokeStyle = "#e2e8f0" // slate-200
    ctx.stroke()

    // Draw value arc
    const angle = (percentage / 100) * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius / 2, Math.PI, Math.PI - angle, true)
    ctx.lineWidth = 10
    ctx.strokeStyle = getColor()
    ctx.stroke()

    // Draw safe limit marker
    const safePercentage = ((safeLimit - min) / (max - min)) * 100
    const safeAngle = (safePercentage / 100) * Math.PI
    const safeX = centerX - (radius / 2) * Math.cos(Math.PI - safeAngle)
    const safeY = centerY - (radius / 2) * Math.sin(Math.PI - safeAngle)

    ctx.beginPath()
    ctx.arc(safeX, safeY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#64748b" // slate-500
    ctx.fill()

    // Draw min and max labels
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#64748b" // slate-500
    ctx.textAlign = "left"
    ctx.fillText(min.toString(), centerX - radius / 2 - 15, centerY)
    ctx.textAlign = "right"
    ctx.fillText(max.toString(), centerX + radius / 2 + 15, centerY)
  }, [value, min, max, safeLimit, percentage])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="h-24 w-full" />
      <div className="mt-2 text-center">
        <p className="text-sm font-medium">{name}</p>
        <p
          className={cn(
            "text-lg font-bold",
            isSafe ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
          )}
        >
          {value} {unit}
        </p>
        <p className="text-xs text-muted-foreground">
          Safe limit: {safeLimit} {unit}
        </p>
      </div>
    </div>
  )
}

